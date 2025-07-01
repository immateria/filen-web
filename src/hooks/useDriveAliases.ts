import { useCallback, useEffect } from "react"
import { useAliasesStore } from "@/stores/aliases.store"
import worker from "@/lib/worker"
import useErrorToast from "@/hooks/useErrorToast"

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
       const errorToast = useErrorToast()

       useEffect(() => {
               worker
                       .listDriveAliases()
                       .then(result => setAliases(result))
                       .catch(e => {
                               console.error(e)
                               errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
                       })
       }, [setAliases, errorToast])

       const validatedAddAlias = useCallback(
               async (name: string) => {
                       const trimmed = name.trim()

                       if (!trimmed || trimmed in aliases) {
                               return
                       }

                       try {
                               await worker.createDriveAlias({ name: trimmed })
                               addAlias(trimmed)
                       } catch (e) {
                               console.error(e)
                               errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
                       }
               },
               [aliases, addAlias, errorToast]
       )

       const validatedRemoveAlias = useCallback(
               async (name: string) => {
                       if (!(name in aliases)) {
                               return
                       }

                       try {
                               await worker.deleteDriveAlias({ name })
                               removeAlias(name)
                       } catch (e) {
                               console.error(e)
                               errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
                       }
               },
               [aliases, removeAlias, errorToast]
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

                       try {
                               await worker.addDriveItemToAlias({ alias: trimmedAlias, uuid })
                               addItemToAlias(trimmedAlias, uuid)
                       } catch (e) {
                               console.error(e)
                               errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
                       }
               },
               [aliases, addItemToAlias, errorToast]
       )

       const validatedRemoveItemFromAlias = useCallback(
               async (alias: string, uuid: string) => {
                       const items = aliases[alias]

                       if (!items || !items.includes(uuid)) {
                               return
                       }

                       const remaining = items.length - 1

                       try {
                               await worker.removeDriveItemFromAlias({ alias, uuid })
                               removeItemFromAlias(alias, uuid)

                               if (remaining <= 0) {
                                       removeAlias(alias)
                               }
                       } catch (e) {
                               console.error(e)
                               errorToast((e as unknown as Error).message ?? (e as unknown as Error).toString())
                       }
               },
               [aliases, removeItemFromAlias, removeAlias, errorToast]
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
