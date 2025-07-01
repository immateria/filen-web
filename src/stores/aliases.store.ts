import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type DriveAliasMap = Record<string, string[]>

export type AliasesState = {
	aliases: DriveAliasMap
	search: string
}

export type AliasesStore = AliasesState & {
	setAliases: Setter<DriveAliasMap>
	setSearch: Setter<string>
	addAlias: (name: string) => void
	removeAlias: (name: string) => void
	addItemToAlias: (alias: string, uuid: string) => void
	removeItemFromAlias: (alias: string, uuid: string) => void
	getItemAliases: (uuid: string) => string[]
	reset: () => void
}

const initialState: AliasesState = {
	aliases: {},
	search: ""
}

export const useAliasesStore = create<AliasesStore>((set, get) => {
	const createSetter = createStoreSetter<AliasesState>(set)

	return {
		...initialState,
		setAliases: createSetter("aliases"),
		setSearch: createSetter("search"),
		addAlias(name) {
			set(state => {
				if (name in state.aliases) {
					return {}
				}

				return { aliases: { ...state.aliases, [name]: [] } }
			})
		},
		removeAlias(name) {
			set(state => {
				if (!(name in state.aliases)) {
					return {}
				}

				const aliases = { ...state.aliases }
				delete aliases[name]

				return { aliases }
			})
		},
		addItemToAlias(alias, uuid) {
			set(state => {
				const items = state.aliases[alias]

				if (!items || items.includes(uuid)) {
					return {}
				}

				return {
					aliases: {
						...state.aliases,
						[alias]: [...items, uuid]
					}
				}
			})
		},
		removeItemFromAlias(alias, uuid) {
			set(state => {
				const items = state.aliases[alias]

				if (!items) {
					return {}
				}

				return {
					aliases: {
						...state.aliases,
						[alias]: items.filter(id => id !== uuid)
					}
				}
			})
		},
		getItemAliases(uuid) {
			const names: string[] = []

			for (const [name, items] of Object.entries(get().aliases)) {
				if (items.includes(uuid)) {
					names.push(name)
				}
			}

			return names
		},
		reset() {
			set({ ...initialState })
		}
	}
})
