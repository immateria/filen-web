import { create } from "zustand"
import { type SyncPair, type TransferData, type CycleState } from "@filen/sync/dist/types"
import { type LocalTreeIgnored } from "@filen/sync/dist/lib/filesystems/local"
import { type RemoteTreeIgnored } from "@filen/sync/dist/lib/filesystems/remote"
import { type SerializedError } from "@filen/sync/dist/utils"
import { type Setter, createStoreSetter } from "./helpers"

export type TransferDataWithTimestamp = TransferData & { timestamp: number }

export type GeneralError = {
	type: "cycle" | "general" | "localTree" | "transfer" | "task"
	error: SerializedError
	uuid: string
}

export type ConfirmDeletion = {
	where: "local" | "remote" | "both"
	previous: number
	current: number
}

export type SyncsState = {
	selectedSync: SyncPair | null
	transferEvents: Record<string, TransferDataWithTimestamp[]>
	cycleState: Record<string, { state: CycleState; timestamp: number }>
	remoteIgnored: Record<string, RemoteTreeIgnored[]>
	localIgnored: Record<string, LocalTreeIgnored[]>
	errors: Record<string, GeneralError[]>
	search: string
	changing: boolean
	remainingReadable: Record<string, string>
	remaining: Record<string, number>
	speed: Record<string, number>
	progress: Record<string, number>
	tasksCount: Record<string, number>
	tasksSize: Record<string, number>
	tasksBytes: Record<string, number>
       confirmDeletion: Record<string, ConfirmDeletion | null>
}

export type SyncsStore = SyncsState & {
       setSelectedSync: Setter<SyncPair | null>
       setChanging: Setter<boolean>
       setTransferEvents: Setter<Record<string, TransferDataWithTimestamp[]>>
       setCycleState: Setter<Record<string, { state: CycleState; timestamp: number }>>
       setRemoteIgnored: Setter<Record<string, RemoteTreeIgnored[]>>
       setLocalIgnored: Setter<Record<string, LocalTreeIgnored[]>>
       setErrors: Setter<Record<string, GeneralError[]>>
       setSearch: Setter<string>
       setRemainingReadable: Setter<Record<string, string>>
       setRemaining: Setter<Record<string, number>>
       setSpeed: Setter<Record<string, number>>
       setProgress: Setter<Record<string, number>>
       setTasksCount: Setter<Record<string, number>>
       setTasksSize: Setter<Record<string, number>>
       setTasksBytes: Setter<Record<string, number>>
       setConfirmDeletion: Setter<Record<string, ConfirmDeletion | null>>
       reset: () => void
}

const initialState: SyncsState = {
       selectedSync: null,
       transferEvents: {},
       cycleState: {},
       remoteIgnored: {},
       localIgnored: {},
       errors: {},
       search: "",
       changing: false,
       remainingReadable: {},
       remaining: {},
       speed: {},
       progress: {},
       tasksCount: {},
       tasksSize: {},
       tasksBytes: {},
       confirmDeletion: {}
}

export const useSyncsStore = create<SyncsStore>(set => {
       const createSetter = createStoreSetter<SyncsState>(set)

       return {
               ...initialState,
               setSelectedSync: createSetter("selectedSync"),
               setTransferEvents: createSetter("transferEvents"),
               setCycleState: createSetter("cycleState"),
               setRemoteIgnored: createSetter("remoteIgnored"),
               setLocalIgnored: createSetter("localIgnored"),
               setErrors: createSetter("errors"),
               setSearch: createSetter("search"),
               setChanging: createSetter("changing"),
               setRemainingReadable: createSetter("remainingReadable"),
               setProgress: createSetter("progress"),
               setRemaining: createSetter("remaining"),
               setSpeed: createSetter("speed"),
               setTasksCount: createSetter("tasksCount"),
               setTasksSize: createSetter("tasksSize"),
               setTasksBytes: createSetter("tasksBytes"),
               setConfirmDeletion: createSetter("confirmDeletion"),
               reset() {
                       set({ ...initialState })
               }
       }
})
