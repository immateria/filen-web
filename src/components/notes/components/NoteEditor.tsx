import TextEditor from "@/components/textEditor"
import RichTextEditor from "@/components/textEditor/rich"
import { DESKTOP_TOPBAR_HEIGHT } from "@/constants"
import { Loader } from "lucide-react"
import { type Note } from "@filen/sdk/dist/types/api/v3/notes"
import { MAX_NOTE_SIZE } from "@filen/sdk"
import {
    usesRichEditor,
    codeLike,
    type NoteType
} from "@components/notes/constants/noteTypes"

export interface NoteEditorProps {
    note: Note
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    onValueChange: (v: string) => void
    windowSize: { width: number; height: number }
    resizablePanelSizes: { right: { width: number } }
    hasWritePermissions: boolean
    editorType: string
    querySuccess: boolean
    placeholder: string
}

export default function NoteEditor({
    note,
    value,
    setValue,
    onValueChange,
    windowSize,
    resizablePanelSizes,
    hasWritePermissions,
    editorType,
    querySuccess,
    placeholder
}: NoteEditorProps) {
    if (!querySuccess) {
        return (
            <div
                style={{
                    height: windowSize.height - 48 - DESKTOP_TOPBAR_HEIGHT,
                    width: "100%"
                }}
            >
                <div className="flex flex-row items-center justify-center w-full h-full">
                    <Loader className="animate-spin-medium" />
                </div>
            </div>
        )
    }

    if (usesRichEditor(note.type as NoteType)) {
        return (
            <RichTextEditor
                key={`${note.uuid}-${note.type}`}
                value={value}
                setValue={setValue}
                onValueChange={onValueChange}
                width={resizablePanelSizes.right.width}
                height={windowSize.height - 48 - DESKTOP_TOPBAR_HEIGHT}
                type={note.type as "rich" | "checklist"}
                placeholder={placeholder}
                readOnly={!hasWritePermissions}
                maxLength={MAX_NOTE_SIZE - 64}
                showCharCount={true}
            />
        )
    }

    return (
        <TextEditor
            key={`${note.uuid}-${note.type}`}
            fileName={note.type === "md" || editorType === "md" ? "note.md" : note.title}
            value={value}
            setValue={setValue}
            onValueChange={onValueChange}
            height={windowSize.height - 48 - DESKTOP_TOPBAR_HEIGHT}
            type={editorType === "code" || editorType === "md" || codeLike(note.type) ? "code" : "text"}
            placeholder={placeholder}
            showMarkdownPreview={note.type === "md"}
            readOnly={!hasWritePermissions}
            maxLength={MAX_NOTE_SIZE - 64}
            showCharCount={true}
        />
    )
}
