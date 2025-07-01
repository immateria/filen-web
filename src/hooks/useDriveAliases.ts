import { useCallback, useEffect } from "react"
import { useAliasesStore } from "@/stores/aliases.store"
import worker from "@/lib/worker"

export default function useDriveAliases() {
       const { aliases, setAliases, addAlias, removeAlias, addItemToAlias, removeItemFromAlias, getItemAliases } = useAliasesStore(state => ({
               aliases: state.aliases,
               setAliases: state.setAliases,
               addAlias: state.addAlias,
               removeAlias: state.removeAlias,
               addItemToAlias: state.addItemToAlias,
               removeItemFromAlias: state.removeItemFromAlias,
               getItemAliases: state.getItemAliases
       }))

       useEffect(() => {
               worker
                       .listDriveAliases()
                       .then(result => setAliases(result))
                       .catch(console.error)
       }, [setAliases])

       const validatedAddAlias = useCallback(
               async (name: string) => {
                       const trimmed = name.trim()

                       if (!trimmed || trimmed in aliases) {
                               return
                       }

                       await worker.createDriveAlias({ name: trimmed })
                       addAlias(trimmed)
               },
               [aliases, addAlias]
       )

       const validatedRemoveAlias = useCallback(
               async (name: string) => {
                       if (!(name in aliases)) {
                               return
                       }

                       await worker.deleteDriveAlias({ name })
                       removeAlias(name)
               },
               [aliases, removeAlias]
       )

       const validatedAddItemToAlias = useCallback(
               async (alias: string, uuid: string) => {
                       const trimmedAlias = alias.trim()

                       if (!trimmedAlias || !uuid || !(trimmedAlias in aliases)) {
                               return
                       }

			const items = aliases[trimmedAlias]

			if (items && items.includes(uuid)) {
				return
			}

                       await worker.addDriveItemToAlias({ alias: trimmedAlias, uuid })
                       addItemToAlias(trimmedAlias, uuid)
               },
               [aliases, addItemToAlias]
       )

       const validatedRemoveItemFromAlias = useCallback(
               async (alias: string, uuid: string) => {
                       const items = aliases[alias]

                       if (!items || !items.includes(uuid)) {
                               return
                       }

                       await worker.removeDriveItemFromAlias({ alias, uuid })
                       removeItemFromAlias(alias, uuid)
               },
               [aliases, removeItemFromAlias]
       )

	return {
		aliases,
		addAlias: validatedAddAlias,
		removeAlias: validatedRemoveAlias,
		addItemToAlias: validatedAddItemToAlias,
		removeItemFromAlias: validatedRemoveItemFromAlias,
		getItemAliases
	}
}
