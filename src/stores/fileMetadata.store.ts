import { create } from "zustand"
import { setItem, getItem, removeItem } from "@/lib/localForage"

const opQueues = new Map<string, Promise<void>>()

function queueOp<T>(uuid: string, op: () => Promise<T>): Promise<T> {
        const prev = opQueues.get(uuid) ?? Promise.resolve()
        const next = prev.then(op, op)
        opQueues.set(uuid, next.then(() => {}, () => {}))
        return next
}

export type MetadataType =
        | "string"
        | "integer"
        | "number"
        | "boolean"
        | "date"
        | "datetime"

export interface MetadataEntry {
        type: MetadataType
        value: string | number | boolean
}

export type FileMetadata = Record<string, MetadataEntry>

export type FileMetadataState = {
        metadata: Record<string, FileMetadata>
}

export const METADATA_KEY_MAX_LENGTH = 255

// eslint-disable-next-line no-control-regex
const KEY_REGEX = /^[^\x00-\x1F\x7F]+$/

export function isValidMetadataKey(key: string): boolean {
        return key.length > 0 && key.length <= METADATA_KEY_MAX_LENGTH && KEY_REGEX.test(key)
}

export type FileMetadataStore = FileMetadataState & {
        setMetadata: (uuid: string, metadata: FileMetadata) => Promise<void>
        setMetadataField: (
                uuid: string,
                key: string,
                entry: MetadataEntry
        ) => Promise<void>
        removeMetadataField: (uuid: string, key: string) => Promise<void>
        removeMetadata: (uuid: string) => Promise<void>
        fetchMetadata: (uuid: string) => Promise<FileMetadata | null>
        reset: () => void
}

const initialState: FileMetadataState = {
        metadata: {}
}

export const useFileMetadataStore = create<FileMetadataStore>((set, get) => {

        return {
                ...initialState,
                async setMetadata(uuid, metadata) {
                        await queueOp(uuid, async () => {
                                await setItem("fileMetadata:" + uuid, metadata)
                                set(state => ({
                                        metadata: { ...state.metadata, [uuid]: metadata }
                                }))
                        })
                },
                async setMetadataField(uuid, key, entry) {
                        if (!isValidMetadataKey(key)) {
                                return
                        }

                        await queueOp(uuid, async () => {
                                const prev = get().metadata[uuid] ?? {}
                                const updated = { ...prev, [key]: entry }
                                await setItem("fileMetadata:" + uuid, updated)
                                set({ metadata: { ...get().metadata, [uuid]: updated } })
                        })
                },
                async removeMetadataField(uuid, key) {
                        await queueOp(uuid, async () => {
                                const prev = get().metadata[uuid]
                                if (!prev || !(key in prev)) {
                                        return
                                }

                                const updated = { ...prev }
                                delete updated[key]

                                if (Object.keys(updated).length === 0) {
                                        await removeItem("fileMetadata:" + uuid)
                                        set(state => {
                                                const metadata = { ...state.metadata }
                                                delete metadata[uuid]
                                                return { metadata }
                                        })
                                } else {
                                        await setItem("fileMetadata:" + uuid, updated)
                                        set(state => ({
                                                metadata: { ...state.metadata, [uuid]: updated }
                                        }))
                                }
                        })
                },
                async removeMetadata(uuid) {
                        await queueOp(uuid, async () => {
                                await removeItem("fileMetadata:" + uuid)
                                set(state => {
                                        const copy = { ...state.metadata }
                                        delete copy[uuid]
                                        return { metadata: copy }
                                })
                        })
                },
                async fetchMetadata(uuid) {
                        return queueOp(uuid, async () => {
                                try {
                                        const meta = await getItem<FileMetadata>("fileMetadata:" + uuid)
                                        if (meta) {
                                                set(state => ({
                                                        metadata: { ...state.metadata, [uuid]: meta }
                                                }))
                                                return meta
                                        }
                                } catch (e) {
                                        console.error(e)
                                }

                                return null
                        })
                },
                reset() {
                        set({ ...initialState })
                }
        }
})
