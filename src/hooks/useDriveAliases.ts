import { useLocalStorage } from "@uidotdev/usehooks"
import { useCallback } from "react"

export type DriveAliasMap = Record<string, string[]>

export default function useDriveAliases() {
        const [aliases, setAliases] = useLocalStorage<DriveAliasMap>("driveAliases", {})

        const addAlias = useCallback((name: string) => {
                setAliases(prev => ({
                        ...prev,
                        [name]: prev[name] ?? []
                }))
        }, [setAliases])

        const removeAlias = useCallback((name: string) => {
                setAliases(prev => {
                        const copy = { ...prev }
                        delete copy[name]
                        return copy
                })
        }, [setAliases])

        const addItemToAlias = useCallback((alias: string, uuid: string) => {
                setAliases(prev => ({
                        ...prev,
                        [alias]: Array.from(new Set([...(prev[alias] ?? []), uuid]))
                }))
        }, [setAliases])

        const removeItemFromAlias = useCallback((alias: string, uuid: string) => {
                setAliases(prev => ({
                        ...prev,
                        [alias]: (prev[alias] ?? []).filter(id => id !== uuid)
                }))
        }, [setAliases])

        return { aliases, addAlias, removeAlias, addItemToAlias, removeItemFromAlias }
}
