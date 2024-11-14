interface Message<T> {
    scene: string
    data: MessageData<T>
}

interface MessageData<T> {
    sign: string
    from: number
    to: number
    data: T
}

interface MessageHandler<T> {
    handle(data: Message<T>): void
}

export type { Message, MessageData, MessageHandler }
