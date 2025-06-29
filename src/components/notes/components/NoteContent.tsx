import { memo } from "react"
import { type Note } from "@filen/sdk/dist/types/api/v3/notes"
import useNoteContent from "../hooks/useNoteContent"
import NoteEditor from "./NoteEditor"

export const NoteContent = memo(({ note }: { note: Note }) => {
    const editorProps = useNoteContent(note)

    return <NoteEditor note={note} {...editorProps} />
})

export default NoteContent
