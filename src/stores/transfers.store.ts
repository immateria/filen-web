import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type TransferState = "started" | "queued" | "finished" | "error" | "stopped" | "paused"

export type Transfer = {
	type: "upload" | "download"
	uuid: string
	state: TransferState
	bytes: number
	name: string
	size: number
	startedTimestamp: number
	finishedTimestamp: number
	queuedTimestamp: number
	errorTimestamp: number
	progressTimestamp: number
	createdDirectories: number
	fileType: "file" | "directory"
}

export type TransfersState = {
       transfers: Transfer[]
       finishedTransfers: Transfer[]
       speed: number
       remaining: number
       progress: number
}

export type TransfersStore = TransfersState & {
       setTransfers: Setter<Transfer[]>
       setFinishedTransfers: Setter<Transfer[]>
       setSpeed: Setter<number>
       setRemaining: Setter<number>
       setProgress: Setter<number>
       reset: () => void
}

const initialState: TransfersState = {
       transfers: [],
       finishedTransfers: [],
       speed: 0,
       remaining: 0,
       progress: 0
}

export const useTransfersStore = create<TransfersStore>(set => {
       const createSetter = createStoreSetter<TransfersState>(set)

       return {
               ...initialState,
               setTransfers: createSetter("transfers"),
               setFinishedTransfers: createSetter("finishedTransfers"),
               setSpeed: createSetter("speed"),
               setRemaining: createSetter("remaining"),
               setProgress: createSetter("progress"),
               reset() {
                       set({ ...initialState })
               }
       }
})
