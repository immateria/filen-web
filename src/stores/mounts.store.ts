import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type MountsState = {
       enablingNetworkDrive: boolean
       enablingS3: boolean
       enablingWebDAV: boolean
}

export type MountsStore = MountsState & {
       setEnablingNetworkDrive: Setter<boolean>
       setEnablingS3: Setter<boolean>
       setEnablingWebDAV: Setter<boolean>
       reset: () => void
}

const initialState: MountsState = {
       enablingNetworkDrive: false,
       enablingS3: false,
       enablingWebDAV: false
}

export const useMountsStore = create<MountsStore>(set => {
       const createSetter = createStoreSetter<MountsState>(set)

       return {
               ...initialState,
               setEnablingNetworkDrive: createSetter("enablingNetworkDrive"),
               setEnablingS3: createSetter("enablingS3"),
               setEnablingWebDAV: createSetter("enablingWebDAV"),
               reset() {
                       set({ ...initialState })
               }
       }
})
