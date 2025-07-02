import { memo, useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import eventEmitter from "@/lib/eventEmitter"
import {
        useFileMetadataStore,
        isValidMetadataKey,
        METADATA_KEY_MAX_LENGTH,
        MetadataEntry,
        MetadataType
} from "@/stores/fileMetadata.store"

export const MetadataDialog = memo(() => {
        const { t } = useTranslation()
        const [open, setOpen] = useState(false)
        const [uuid, setUUID] = useState<string | null>(null)
        const [name, setName] = useState<string>("")
        const [keyInput, setKeyInput] = useState("")
        const [valueInput, setValueInput] = useState("")
        const [typeInput, setTypeInput] = useState<MetadataType>("string")
        const [error, setError] = useState<string | null>(null)
        const { metadata, setMetadataField, removeMetadataField, fetchMetadata } =
                useFileMetadataStore(
                        useCallback(
                                state => ({
                                        metadata: state.metadata,
                                        setMetadataField: state.setMetadataField,
                                        removeMetadataField: state.removeMetadataField,
                                        fetchMetadata: state.fetchMetadata
                                }),
                                []
                        )
                )

        useEffect(() => {
                const listener = eventEmitter.on(
                        "openMetadataDialog",
                        async ({ uuid: id, name: n }: { uuid: string; name: string }) => {
                                setUUID(id)
                                setName(n)
                                setKeyInput("")
                                setValueInput("")
                                setTypeInput("string")
                                setError(null)
                                setOpen(true)
                                await fetchMetadata(id)
                        }
                )

                return () => listener.remove()
        }, [fetchMetadata])

        const parseValue = useCallback(
                (value: string, type: MetadataType): MetadataEntry | null => {
                        switch (type) {
                                case "integer": {
                                        const v = parseInt(value, 10)
                                        return Number.isFinite(v)
                                                ? { type, value: v }
                                                : null
                                }
                                case "number": {
                                        const v = parseFloat(value)
                                        return Number.isFinite(v)
                                                ? { type, value: v }
                                                : null
                                }
                                case "boolean": {
                                        if (/^(true|false|1|0)$/i.test(value)) {
                                                return {
                                                        type,
                                                        value:
                                                                value === "1" ||
                                                                value.toLowerCase() === "true"
                                                }
                                        }
                                        return null
                                }
                                case "date":
                                case "datetime": {
                                        const d = new Date(value)
                                        if (Number.isNaN(d.getTime())) {
                                                return null
                                        }
                                        return {
                                                type,
                                                value:
                                                        type === "date"
                                                                ? d.toISOString().split("T")[0]!
                                                                : d.toISOString()
                                        }
                                }
                                default:
                                        return { type, value }
                        }
                },
                []
        )

        const add = useCallback(() => {
                if (!uuid) {
                        return
                }

                const key = keyInput.trim()

                if (!isValidMetadataKey(key)) {
                        setError(t("dialogs.metadata.invalidKey"))
                        return
                }

                const entry = parseValue(valueInput, typeInput)

                if (!entry) {
                        setError(t("dialogs.metadata.invalidValue"))
                        return
                }

                setMetadataField(uuid, key, entry)
                setKeyInput("")
                setValueInput("")
                setTypeInput("string")
                setError(null)
        }, [uuid, keyInput, valueInput, typeInput, setMetadataField, parseValue, t])

        const remove = useCallback(
                (key: string) => {
                        if (!uuid) {
                                return
                        }
                        removeMetadataField(uuid, key)
                },
                [uuid, removeMetadataField]
        )

        const meta = uuid ? metadata[uuid] ?? {} : {}

        return (
                <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="outline-none focus:outline-none active:outline-none">
                                <DialogHeader>{t("dialogs.metadata.title", { name })}</DialogHeader>
                                <div className="flex flex-col gap-3 py-2">
                                        {Object.entries(meta).map(([k, v]) => (
                                                <div key={k} className="flex flex-row items-center gap-2">
                                                        <p className="flex-1 break-all text-sm">
                                                                {k} ({t(`dialogs.metadata.types.${v.type}`)}): {String(v.value)}
                                                        </p>
                                                        <Button variant="ghost" onClick={() => remove(k)}>
                                                                {t("dialogs.metadata.remove")}
                                                        </Button>
                                                </div>
                                        ))}
                                        <div className="flex flex-row items-center gap-2">
                                                <Input
                                                        value={keyInput}
                                                        onChange={e => setKeyInput(e.target.value)}
                                                        placeholder={t("dialogs.metadata.key")}
                                                        autoCapitalize="none"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        maxLength={METADATA_KEY_MAX_LENGTH}
                                                />
                                                <Input
                                                        value={valueInput}
                                                        onChange={e => setValueInput(e.target.value)}
                                                        placeholder={t("dialogs.metadata.value")}
                                                />
                                                <select
                                                        className="border p-2 text-sm"
                                                        value={typeInput}
                                                        onChange={e => setTypeInput(e.target.value as MetadataType)}
                                                >
                                                        {(["string", "integer", "number", "boolean", "date", "datetime"] as MetadataType[]).map(tk => (
                                                                <option key={tk} value={tk}>
                                                                        {t(`dialogs.metadata.types.${tk}`)}
                                                                </option>
                                                        ))}
                                                </select>
                                                <Button onClick={add}>{t("dialogs.metadata.add")}</Button>
                                        </div>
                                        {error && <p className="text-destructive text-sm">{error}</p>}
                                </div>
                                <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpen(false)}>
                                                {t("dialogs.close")}
                                        </Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
        )
})

export default MetadataDialog
