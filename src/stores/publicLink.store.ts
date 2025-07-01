import { create } from "zustand"
import { type DriveCloudItem } from "@/components/drive"
import { type Setter, createStoreSetter } from "./helpers"

export type DirectoryPublicLinkState = {
       items: DriveCloudItem[]
       searchTerm: string
       virtualURL: string
       passwordState: {
               uuid: string
               password: string
       }
       downloadBtn: boolean
}

export type DirectoryPublicLinkStore = DirectoryPublicLinkState & {
       setItems: Setter<DriveCloudItem[]>
       setSearchTerm: Setter<string>
       setVirtualURL: Setter<string>
       setPasswordState: Setter<{ uuid: string; password: string }>
       setDownloadBtn: Setter<boolean>
       reset: () => void
}

const directoryInitialState: DirectoryPublicLinkState = {
       items: [],
       searchTerm: "",
       virtualURL: "",
       passwordState: {
               uuid: "",
               password: ""
       },
       downloadBtn: false
}

export const useDirectoryPublicLinkStore = create<DirectoryPublicLinkStore>(set => {
       const createSetter = createStoreSetter<DirectoryPublicLinkState>(set)

       return {
               ...directoryInitialState,
               setItems: createSetter("items"),
               setSearchTerm: createSetter("searchTerm"),
               setVirtualURL: createSetter("virtualURL"),
               setPasswordState: createSetter("passwordState"),
               setDownloadBtn: createSetter("downloadBtn"),
               reset() {
                       set({ ...directoryInitialState })
               }
       }
})

export type PublicLinkState = {
       passwordState: {
               uuid: string
               password: string
               salt: string
       }
}

export type PublicLinkStore = PublicLinkState & {
       setPasswordState: Setter<{ uuid: string; password: string; salt: string }>
       reset: () => void
}

const publicInitialState: PublicLinkState = {
       passwordState: {
               uuid: "",
               password: "",
               salt: ""
       }
}

export const usePublicLinkStore = create<PublicLinkStore>(set => {
       const createSetter = createStoreSetter<PublicLinkState>(set)

       return {
               ...publicInitialState,
               setPasswordState: createSetter("passwordState"),
               reset() {
                       set({ ...publicInitialState })
               }
       }
})
