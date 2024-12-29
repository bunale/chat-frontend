/*
    所有的消息相关的类型
*/
interface Packet<T> {
    command: number
    message: T
}

interface Offer {
    from: string
    to: string
    data: RTCSessionDescriptionInit
}

interface Answer {
    from: string
    to: string
    data: RTCSessionDescriptionInit
}

interface Candidate {
    from: string
    to: string
    data: RTCIceCandidate
}

interface UserMessage {
    conversationId: number
    content: string
}

interface MessageHandler<T> {
    handle(data: Packet<T>): void
}

export type { Packet, Offer, Answer, Candidate, UserMessage, MessageHandler }
