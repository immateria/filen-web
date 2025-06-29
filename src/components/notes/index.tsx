import { memo, useCallback } from "react"
import { useNotesStore } from "@/stores/notes.store"
import { cn } from "@/lib/utils"
import NoteContent from "./components/NoteContent"
import EmptyState from "./components/EmptyState"

export const Notes = memo(() => {
       const { selectedNote, notes } = useNotesStore(useCallback(state => ({ selectedNote: state.selectedNote, notes: state.notes }), []))

	return (
		<div className={cn("w-full h-[calc(100dvh-48px)] flex flex-col border-t", !selectedNote && "items-center justify-center")}>
                       {selectedNote ? (
                               <NoteContent key={`${selectedNote.uuid}-${selectedNote.type}`} note={selectedNote} />
                       ) : notes.length === 0 ? (
                               <EmptyState />
                       ) : null}
		</div>
	)
})

export default Notes
