import { type Note } from "@filen/sdk/dist/types/api/v3/notes"
import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type NotesState = {
	notes: Note[]
	selectedNote: Note | null
	synced: boolean
	search: string
	activeTag: string
	maxSizeReached: boolean
}

export type NotesStore = NotesState & {
	setNotes: Setter<Note[]>
	setSelectedNote: Setter<Note | null>
	setSynced: Setter<boolean>
	setSearch: Setter<string>
	setActiveTag: Setter<string>
	setMaxSizeReached: Setter<boolean>
	updateNote: (uuid: string, updater: (note: Note) => Note) => void
	removeNoteById: (uuid: string) => void
	reset: () => void
}

const initialState: NotesState = {
	notes: [],
	selectedNote: null,
	synced: true,
	search: "",
	activeTag: "all",
	maxSizeReached: false
}

export const useNotesStore = create<NotesStore>(set => {
        const createSetter = createStoreSetter<NotesState>(set)

	return {
		...initialState,
		setNotes: createSetter("notes"),
		setSelectedNote: createSetter("selectedNote"),
		setSynced: createSetter("synced"),
		setSearch: createSetter("search"),
		setActiveTag: createSetter("activeTag"),
		setMaxSizeReached: createSetter("maxSizeReached"),
		updateNote(uuid, updater) {
			set(state => ({
				notes: state.notes.map(note => (note.uuid === uuid ? updater(note) : note)),
				selectedNote: state.selectedNote && state.selectedNote.uuid === uuid ? updater(state.selectedNote) : state.selectedNote
			}))
		},
		removeNoteById(uuid) {
			set(state => ({
				notes: state.notes.filter(note => note.uuid !== uuid),
				selectedNote: state.selectedNote && state.selectedNote.uuid === uuid ? null : state.selectedNote
			}))
		},
		reset() {
			set({ ...initialState })
		}
	}
})
