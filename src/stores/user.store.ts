import { create } from "zustand"
import { type UserAccountResponse } from "@filen/sdk/dist/types/api/v3/user/account"
import { type UserSettingsResponse } from "@filen/sdk/dist/types/api/v3/user/settings"
import { type Setter, createStoreSetter } from "./helpers"

export type UserState = {
       account: UserAccountResponse | null
       settings: UserSettingsResponse | null
       cancelledSubs: string[]
}

export type UserStore = UserState & {
       setAccount: Setter<UserAccountResponse | null>
       setSettings: Setter<UserSettingsResponse | null>
       setCancelledSubs: Setter<string[]>
       reset: () => void
}

const initialState: UserState = {
       account: null,
       settings: null,
       cancelledSubs: []
}

export const useUserStore = create<UserStore>(set => {
       const createSetter = createStoreSetter<UserState>(set)

       return {
               ...initialState,
               setAccount: createSetter("account"),
               setSettings: createSetter("settings"),
               setCancelledSubs: createSetter("cancelledSubs"),
               reset() {
                       set({ ...initialState })
               }
       }
})
