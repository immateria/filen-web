import { type ChatConversation } from "@filen/sdk/dist/types/api/v3/chat/conversations"
import { create } from "zustand"
import { type ChatMessage } from "@filen/sdk/dist/types/api/v3/chat/messages"
import { type Setter, createStoreSetter } from "./helpers"

export type ChatsState = {
       conversations: ChatConversation[]
       selectedConversation: ChatConversation | null
       search: string
       messages: ChatMessage[]
       failedMessages: string[]
       editUUID: string
       replyMessage: ChatMessage | null
       conversationsUnread: Record<string, number>
       unread: number
}

const initialState: ChatsState = {
       conversations: [],
       selectedConversation: null,
       search: "",
       messages: [],
       failedMessages: [],
       editUUID: "",
       replyMessage: null,
       conversationsUnread: {},
       unread: 0
}

export type ChatsStore = ChatsState & {
       setConversations: Setter<ChatConversation[]>
       setSelectedConversation: Setter<ChatConversation | null>
       setSearch: Setter<string>
       setMessages: Setter<ChatMessage[]>
       setFailedMessages: Setter<string[]>
       setEditUUID: Setter<string>
       setReplyMessage: Setter<ChatMessage | null>
       setConversationsUnread: Setter<Record<string, number>>
       setUnread: Setter<number>
       reset: () => void
}

export const useChatsStore = create<ChatsStore>(set => {
       const createSetter = createStoreSetter<ChatsState>(set)

       return {
               ...initialState,
               setConversations: createSetter("conversations"),
               setSelectedConversation: createSetter("selectedConversation"),
               setSearch: createSetter("search"),
               setMessages: createSetter("messages"),
               setFailedMessages: createSetter("failedMessages"),
               setEditUUID: createSetter("editUUID"),
               setReplyMessage: createSetter("replyMessage"),
               setConversationsUnread: createSetter("conversationsUnread"),
               setUnread: createSetter("unread"),
               reset() {
                       set({ ...initialState })
               }
       }
})
