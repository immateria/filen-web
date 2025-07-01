import { create } from "zustand"
import { type Setter, createStoreSetter } from "./helpers"

export type ContactsState = {
       requestsInCount: number
}

export type ContactsStore = ContactsState & {
       setRequestsInCount: Setter<number>
       reset: () => void
}

const initialState: ContactsState = {
       requestsInCount: 0
}

export const useContactsStore = create<ContactsStore>(set => {
       const createSetter = createStoreSetter<ContactsState>(set)

       return {
               ...initialState,
               setRequestsInCount: createSetter("requestsInCount"),
               reset() {
                       set({ ...initialState })
               }
       }
})
