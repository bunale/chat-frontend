import { defineStore } from 'pinia'
import type { Conversation } from '@/types/conversation'

const CONVERSATION_KEY = 'conversations'

export const useConversationStore = defineStore(CONVERSATION_KEY, {
    state: () => {
        return {
            conversations: JSON.parse(
                localStorage.getItem(CONVERSATION_KEY) || '[]'
            ) as Conversation[],
        }
    },

    getters: {
        getConversations: (state): Conversation[] => {
            return state.conversations
        },

        getConversationById: (state) => (conversationId: number) => {
            return state.conversations.find((c) => c.conversationId === conversationId)
        },
    },

    actions: {
        setConversations(conversations: Conversation[]) {
            this.conversations = conversations
            this.persist()
        },

        addConversation(conversation: Conversation) {
            this.conversations.push(conversation)
            this.persist()
        },

        removeConversation(conversationId: number) {
            this.conversations = this.conversations.filter(
                (c) => c.conversationId !== conversationId
            )
            this.persist()
        },

        updateConversation(conversation: Conversation) {
            const index = this.conversations.findIndex(
                (c) => c.conversationId === conversation.conversationId
            )
            if (index !== -1) {
                this.conversations[index] = conversation
                this.persist()
            }
        },

        clearConversations() {
            this.conversations = []
            this.persist()
        },

        persist() {
            localStorage.setItem(CONVERSATION_KEY, JSON.stringify(this.conversations))
        },
    },
})
