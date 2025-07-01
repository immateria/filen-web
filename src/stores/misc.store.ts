import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type MiscState = {
       lockDialogOpen: boolean
       updateDialogOpen: boolean
       isOnlineDialogOpen: boolean
       maintenanceDialogOpen: boolean
}

export type MiscStore = MiscState & {
       setLockDialogOpen: Setter<boolean>
       setUpdateDialogOpen: Setter<boolean>
       setIsOnlineDialogOpen: Setter<boolean>
       setMaintenanceDialogOpen: Setter<boolean>
       reset: () => void
}

const initialState: MiscState = {
       lockDialogOpen: false,
       updateDialogOpen: false,
       isOnlineDialogOpen: false,
       maintenanceDialogOpen: false
}

export const useMiscStore = create<MiscStore>(set => {
       const createSetter = createStoreSetter<MiscState>(set)

       return {
               ...initialState,
               setLockDialogOpen: createSetter("lockDialogOpen"),
               setUpdateDialogOpen: createSetter("updateDialogOpen"),
               setIsOnlineDialogOpen: createSetter("isOnlineDialogOpen"),
               setMaintenanceDialogOpen: createSetter("maintenanceDialogOpen"),
               reset() {
                       set({ ...initialState })
               }
       }
})
