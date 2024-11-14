import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { useVideoCallStore } from './useVideoCallStore'
import router from '@/router'
import { MessageHandler, Message } from '@/types/message'

export const useWebScoketStore = defineStore('websocket', {
    state: () => {
        return {
            websocket: ref<WebSocket | null>(null),
            handlers: ref<Map<string, MessageHandler<unknown>>>(new Map()),
        }
    },

    actions: {
        connect() {
            const userStore = useUserStore()
            if (!userStore.user && this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                return
            }

            // 订阅视频通话offer消息
            this.subscribeHandler('videoCall', {
                handle: async (message: Message<unknown>) => {
                    const videoCallStore = useVideoCallStore()
                    if (message.data.sign === 'offer') {
                        videoCallStore.setOfferMessage(
                            message as Message<RTCSessionDescriptionInit>
                        )
                        router.push({ name: 'videoCall' })
                    }
                },
            })

            console.log('websocket url: ' + 'ws://localhost:8080/' + userStore.user?.id)
            this.websocket = new WebSocket(
                import.meta.env.VITE_WEBSOCKET_BASE_URL + userStore.user?.id
            )
            this.websocket.onopen = () => {
                console.log('websocket open')
            }
            this.websocket.onclose = () => {
                console.log('websocket close')
            }
            this.websocket.onerror = (event) => {
                console.log('websocket error: ' + event)
            }
            // 处理消息
            this.websocket.onmessage = (event) => {
                const data: Message<unknown> = JSON.parse(event.data)
                console.log('receive message: ', data)
                this.handlers.get(data.scene)?.handle(data)
            }
        },

        // 发送消息
        sendMessage(message: Message<unknown>) {
            if (!this.websocket) {
                console.error('websocket not connected')
                return
            }

            this.websocket.send(JSON.stringify(message))
        },

        // 订阅消息
        subscribeHandler(type: string, handler: MessageHandler<unknown>) {
            this.handlers.set(type, handler)
        },

        // 取消订阅消息
        unsubscribeHandler(type: string) {
            this.handlers.delete(type)
        },
    },
})
