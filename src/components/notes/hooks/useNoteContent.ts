import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { type Note } from "@filen/sdk/dist/types/api/v3/notes"
import { useQuery } from "@tanstack/react-query"
import worker from "@/lib/worker"
import { useNotesStore } from "@/stores/notes.store"
import useWindowSize from "@/hooks/useWindowSize"
import useResizablePanelSizes from "@/hooks/useResizablePanelSizes"
import { fileNameToPreviewType } from "@/components/dialogs/previewDialog/utils"
import useRouteParent from "@/hooks/useRouteParent"
import { normalizeChecklistValue } from "../utils"
import { isChecklist, type NoteType } from "@components/notes/constants/noteTypes"
import { type SocketEvent, MAX_NOTE_SIZE } from "@filen/sdk"
import { getSocket } from "@/lib/socket"
import { useNavigate } from "@tanstack/react-router"
import useSDKConfig from "@/hooks/useSDKConfig"
import { useTranslation } from "react-i18next"
import useErrorToast from "@/hooks/useErrorToast"
import eventEmitter from "@/lib/eventEmitter"

export interface UseNoteContentResult {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    onValueChange: (v: string) => void
    windowSize: { width: number; height: number }
    resizablePanelSizes: ReturnType<typeof useResizablePanelSizes>
    hasWritePermissions: boolean
    editorType: string
    querySuccess: boolean
    placeholder: string
}

export default function useNoteContent(note: Note): UseNoteContentResult {
    const { setSelectedNote, setNotes, setSynced, setMaxSizeReached } = useNotesStore(
        useCallback(
            state => ({
                setSelectedNote: state.setSelectedNote,
                setNotes: state.setNotes,
                setSynced: state.setSynced,
                setMaxSizeReached: state.setMaxSizeReached
            }),
            []
        )
    )
    const windowSize = useWindowSize()
    const resizablePanelSizes = useResizablePanelSizes()
    const [value, setValue] = useState<string>("")
    const editContentTimeout = useRef<ReturnType<typeof setTimeout>>()
    const parent = useRouteParent()
    const lastNoteUUIDRef = useRef<string>("")
    const initialValueRef = useRef<string>("")
    const queryUpdatedAtRef = useRef<number>(-1)
    const navigate = useNavigate()
    const { userId } = useSDKConfig()
    const { t } = useTranslation()
    const errorToast = useErrorToast()

    const query = useQuery({
        queryKey: ["fetchNoteContent", note.uuid],
        queryFn: () => worker.fetchNoteContent({ uuid: note.uuid })
    })

    const editorType = useMemo(() => {
        return fileNameToPreviewType(note.title)
    }, [note.title])

    const hasWritePermissions = useMemo(() => {
        return note.participants.some(p => p.userId === userId && (p.isOwner || p.permissionsWrite))
    }, [note.participants, userId])

    const editContent = useCallback(
        async (val: string) => {
            if (val.length >= MAX_NOTE_SIZE - 64) {
                setMaxSizeReached(true)
                setSynced(false)

                errorToast(t("notes.maxSizeReached", { chars: MAX_NOTE_SIZE - 64 }))

                return
            }

            if (parent !== note.uuid || JSON.stringify(initialValueRef.current) === JSON.stringify(val) || !hasWritePermissions) {
                setSynced(true)

                return
            }

            setMaxSizeReached(false)

            try {
                await worker.editNoteContent({
                    uuid: note.uuid,
                    type: note.type,
                    content: val
                })

                initialValueRef.current = val

                setSynced(true)
                setSelectedNote(prev => (prev && prev.uuid === note.uuid ? { ...prev, editedTimestamp: Date.now() } : prev))
                setNotes(prev => prev.map(prevNote => (prevNote.uuid === note.uuid ? { ...prevNote, editedTimestamp: Date.now() } : prevNote)))
            } catch (e) {
                console.error(e)

                errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
            }
        },
        [parent, note.uuid, setSelectedNote, setNotes, note.type, setSynced, hasWritePermissions, setMaxSizeReached, errorToast, t]
    )

    const editContentDebounce = useCallback(
        (val: string) => {
            clearTimeout(editContentTimeout.current)

            editContentTimeout.current = setTimeout(() => editContent(val), 2000)
        },
        [editContent]
    )

    const onValueChange = useCallback(
        (val: string) => {
            if (parent === note.uuid && JSON.stringify(initialValueRef.current) !== JSON.stringify(val) && hasWritePermissions) {
                setSynced(false)
                editContentDebounce(val)
            }
        },
        [editContentDebounce, note.uuid, parent, setSynced, hasWritePermissions]
    )

    const socketEventListener = useCallback(
        async (event: SocketEvent) => {
            try {
                if (event.type === "noteContentEdited") {
                    if (event.data.note !== note.uuid || event.data.editorId === userId) {
                        return
                    }

                    await query.refetch()
                } else if (event.type === "noteDeleted") {
                    if (parent === event.data.note) {
                        navigate({
                            to: "/notes"
                        })
                    }
                }
            } catch (e) {
                console.error(e)
            }
        },
        [query, parent, navigate, userId, note.uuid]
    )

    const keyDownListener = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "s" && (e.ctrlKey || e.metaKey) && hasWritePermissions) {
                e.preventDefault()
                e.stopPropagation()

                editContent(value)

                return
            }
        },
        [editContent, value, hasWritePermissions]
    )

    useEffect(() => {
        if (query.isSuccess && queryUpdatedAtRef.current !== query.dataUpdatedAt) {
            queryUpdatedAtRef.current = query.dataUpdatedAt

            const content = isChecklist(note.type as NoteType)
                ? normalizeChecklistValue(query.data.content)
                : query.data.content

            if (JSON.stringify(initialValueRef.current) !== JSON.stringify(content)) {
                setValue(content)

                initialValueRef.current = content

                setSynced(true)
                setMaxSizeReached(false)
            }
        }
    }, [query.isSuccess, query.data, note.type, setSynced, query.dataUpdatedAt, setMaxSizeReached])

    useEffect(() => {
        if (lastNoteUUIDRef.current !== note.uuid) {
            lastNoteUUIDRef.current = note.uuid

            clearTimeout(editContentTimeout.current)

            query.refetch().catch(console.error)
        }
    }, [note.uuid, query])

    useEffect(() => {
        const noteHistoryRestoredListener = eventEmitter.on("noteHistoryRestored", (uuid: string) => {
            if (uuid === note.uuid) {
                query.refetch().catch(console.error)
            }
        })

        return () => {
            noteHistoryRestoredListener.remove()
        }
    }, [note.uuid, query])

    useEffect(() => {
        const socket = getSocket()

        socket.addListener("socketEvent", socketEventListener)
        window.addEventListener("keydown", keyDownListener)

        return () => {
            socket.removeListener("socketEvent", socketEventListener)
            window.removeEventListener("keydown", keyDownListener)
        }
    }, [socketEventListener, keyDownListener])

    return {
        value,
        setValue,
        onValueChange,
        windowSize,
        resizablePanelSizes,
        hasWritePermissions,
        editorType,
        querySuccess: query.isSuccess,
        placeholder: t("notes.contentPlaceholder")
    }
}
