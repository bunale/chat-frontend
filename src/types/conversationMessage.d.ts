export interface GetConversationMessageParam extends PageParam {
    conversationId: number
}

export interface SendMessageParam {
    conversationId: number
    type: number
    content: string
}

export interface ConversationMessage {
    messageId: number
    conversationId: number
    senderId: string
    senderUsername: string
    avatar: string
    content: string
    contentType: number
    createdTime: Date
}
