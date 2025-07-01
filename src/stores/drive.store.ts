import { create } from "zustand"
import { type DriveCloudItem } from "@/components/drive"
import { type CloudItemReceiver } from "@filen/sdk/dist/types/cloud"
import { type Setter, createStoreSetter } from "./helpers"

export type DriveItemsState = {
       items: DriveCloudItem[]
       searchTerm: string
}

export type DriveItemsStore = DriveItemsState & {
       setItems: Setter<DriveCloudItem[]>
       setSearchTerm: Setter<string>
       reset: () => void
}

const driveItemsInitialState: DriveItemsState = {
       items: [],
       searchTerm: ""
}

export const useDriveItemsStore = create<DriveItemsStore>(set => {
       const createSetter = createStoreSetter<DriveItemsState>(set)

       return {
               ...driveItemsInitialState,
               setItems: createSetter("items"),
               setSearchTerm: createSetter("searchTerm"),
               reset() {
                       set({ ...driveItemsInitialState })
               }
       }
})

export type DriveSharedState = {
       currentReceiverId: number
       currentReceiverEmail: string
       currentSharerId: number
       currentSharerEmail: string
       currentReceivers: CloudItemReceiver[]
}

export type DriveSharedStore = DriveSharedState & {
       setCurrentReceiverId: Setter<number>
       setCurrentReceiverEmail: Setter<string>
       setCurrentSharerId: Setter<number>
       setCurrentSharerEmail: Setter<string>
       setCurrentReceivers: Setter<CloudItemReceiver[]>
       reset: () => void
}

const driveSharedInitialState: DriveSharedState = {
       currentReceiverId: 0,
       currentReceiverEmail: "",
       currentSharerId: 0,
       currentSharerEmail: "",
       currentReceivers: []
}

export const useDriveSharedStore = create<DriveSharedStore>(set => {
       const createSetter = createStoreSetter<DriveSharedState>(set)

       return {
               ...driveSharedInitialState,
               setCurrentReceiverId: createSetter("currentReceiverId"),
               setCurrentReceiverEmail: createSetter("currentReceiverEmail"),
               setCurrentSharerId: createSetter("currentSharerId"),
               setCurrentSharerEmail: createSetter("currentSharerEmail"),
               setCurrentReceivers: createSetter("currentReceivers"),
               reset() {
                       set({ ...driveSharedInitialState })
               }
       }
})
