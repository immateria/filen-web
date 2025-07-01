import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type AliasItem = {
	uuid: string
	targetUUID: string
	name: string
	isFolder: boolean
}

export type AliasesState = {
	aliases: AliasItem[]
	search: string
}

export type AliasesStore = AliasesState & {
	setAliases: Setter<AliasItem[]>
	setSearch: Setter<string>
	updateAlias: (uuid: string, updater: (alias: AliasItem) => AliasItem) => void
	removeAlias: (uuid: string) => void
	reset: () => void
}

const initialState: AliasesState = {
	aliases: [],
	search: ""
}

export const useAliasesStore = create<AliasesStore>(set => {
	const createSetter = createStoreSetter<AliasesState>(set)

	return {
		...initialState,
		setAliases: createSetter("aliases"),
		setSearch: createSetter("search"),
		updateAlias(uuid, updater) {
			set(state => ({
				aliases: state.aliases.map(alias =>
					alias.uuid === uuid ? updater(alias) : alias
				)
			}))
		},
		removeAlias(uuid) {
			set(state => ({
				aliases: state.aliases.filter(alias => alias.uuid !== uuid)
			}))
		},
		reset() {
			set({ ...initialState })
		}
	}
})
