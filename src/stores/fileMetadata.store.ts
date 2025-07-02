import { create } from "zustand"
import { setItem, getItem, removeItem } from "@/lib/localForage"

export type MetadataType =
        | "string"
        | "integer"
        | "number"
        | "boolean"
        | "date"
        | "datetime"

export interface MetadataEntry {
        type: MetadataType
        value: string | number | boolean
}

export type FileMetadata = Record<string, MetadataEntry>

export type FileMetadataState = {
        metadata: Record<string, FileMetadata>
}

export const METADATA_KEY_MAX_LENGTH = 255

// eslint-disable-next-line no-control-regex
const KEY_REGEX = /^[^\x00-\x1F\x7F]+$/

export function isValidMetadataKey(key: string): boolean {
        return key.length > 0 && key.length <= METADATA_KEY_MAX_LENGTH && KEY_REGEX.test(key)
}

export type FileMetadataStore = FileMetadataState & {
        setMetadata: (uuid: string, metadata: FileMetadata) => void
        setMetadataField: (
                uuid: string,
                key: string,
                entry: MetadataEntry
        ) => void
        removeMetadataField: (uuid: string, key: string) => void
        removeMetadata: (uuid: string) => void
        fetchMetadata: (uuid: string) => Promise<FileMetadata | null>
        reset: () => void
}

const initialState: FileMetadataState = {
        metadata: {}
}

export const useFileMetadataStore = create<FileMetadataStore>(set => {

        return {
                ...initialState,
                setMetadata(uuid, metadata) {
                        set(state => ({
                                metadata: { ...state.metadata, [uuid]: metadata }
                        }))
                        setItem("fileMetadata:" + uuid, metadata).catch(console.error)
                },
                setMetadataField(uuid, key, entry) {
                        if (!isValidMetadataKey(key)) {
                                return
                        }

                        let updated: FileMetadata = {}

                        set(state => {
                                const prev = state.metadata[uuid] ?? {}
                                updated = { ...prev, [key]: entry }

                                return {
                                        metadata: { ...state.metadata, [uuid]: updated }
                                }
                        })

                        setItem("fileMetadata:" + uuid, updated).catch(console.error)
                },
                removeMetadataField(uuid, key) {
                        set(state => {
                                const prev = state.metadata[uuid]
                                if (!prev) {
                                        return { metadata: state.metadata }
                                }

                                const copy = { ...prev }
                                delete copy[key]

                                const newState = { ...state.metadata, [uuid]: copy }

                                return {
                                        metadata: newState
                                }
                        })
                        getItem<FileMetadata>("fileMetadata:" + uuid)
                                .then(meta => {
                                        if (!meta) {
                                                return
                                        }
                                        const copy = { ...meta }
                                        delete copy[key]
                                        setItem("fileMetadata:" + uuid, copy).catch(console.error)
                                })
                                .catch(console.error)
                },
                removeMetadata(uuid) {
                        set(state => {
                                const copy = { ...state.metadata }
                                delete copy[uuid]
                                return { metadata: copy }
                        })
                        removeItem("fileMetadata:" + uuid).catch(console.error)
                },
                async fetchMetadata(uuid) {
                        try {
                                const meta = await getItem<FileMetadata>("fileMetadata:" + uuid)
                                if (meta) {
                                        set(state => ({
                                                metadata: { ...state.metadata, [uuid]: meta }
                                        }))
                                        return meta
                                }
                        } catch (e) {
                                console.error(e)
                        }

                        return null
                },
                reset() {
                        set({ ...initialState })
                }
        }
})
