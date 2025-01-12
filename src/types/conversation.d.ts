export interface GetConversationParam extends PageParam {
    conversationType: number
}

export interface Conversation {
    conversationId: number
    conversationType: number
    userIdKey: string | null
    lastMessageId: number | null
    lastMessageTime: Date | null
    lastMessageContent: string | null
    title: string | null
    createdUserId: string
    createdTime: Date
    users: ConversationUser[]
}

export interface ConversationUser {
    userId: string
    username: string
    avatar: string
    creatorFlag: boolean
    adminFlag: boolean
}
