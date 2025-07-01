import { create } from "zustand"
import { type RemoteConfig } from "@/types"
import { type Setter, createStoreSetter } from "./helpers"

export type RemoteConfigState = {
       config: RemoteConfig | null
}

export type RemoteConfigStore = RemoteConfigState & {
       setConfig: Setter<RemoteConfig | null>
       reset: () => void
}

const initialState: RemoteConfigState = {
       config: null
}

export const useRemoteConfigStore = create<RemoteConfigStore>(set => {
       const createSetter = createStoreSetter<RemoteConfigState>(set)

       return {
               ...initialState,
               setConfig: createSetter("config"),
               reset() {
                       set({ ...initialState })
               }
       }
})
