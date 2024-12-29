import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { useVideoCallStore } from './useVideoCallStore'
import router from '@/router'
import { MessageHandler, Offer, Packet } from '@/types/message'
import Command from '@/common/Command'

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

            console.log('websocket connecting to url: ' + import.meta.env.VITE_WEBSOCKET_BASE_URL)
            this.websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BASE_URL)
            this.websocket.onopen = () => {
                this.sendMessage({
                    command: Command.LOGIN,
                    message: {
                        userId: userStore.user?.userId,
                    },
                })
                console.log('websocket open')
            }
            this.websocket.onclose = () => {
                console.log('websocket close')
            }
            this.websocket.onerror = (event) => {
                console.log('websocket error: ' + JSON.stringify(event))
            }
            // 处理接收到的消息
            this.websocket.onmessage = (event) => {
                const packet: Packet<unknown> = JSON.parse(event.data)
                console.log('receive data: ', packet)
                this.handlers.get(packet.command)?.handle(packet)
            }

            // 订阅Offer信令消息
            this.subscribeHandler(Command.OFFER, {
                handle: async (packet: Packet<unknown>) => {
                    if (packet.command === Command.OFFER) {
                        // 将Offer存储在全局状态中
                        const videoCallStore = useVideoCallStore()
                        videoCallStore.setOfferMessage(packet as Packet<Offer>)

                        // 路由到 videoCall
                        router.push({ name: 'videoCall' })
                    }
                },
            })
        },

        // 发送消息
        sendMessage(packet: Packet<unknown>) {
            if (!this.websocket) {
                console.error('websocket not connected')
                return
            }

            this.websocket.send(JSON.stringify(packet))
        },

        // 订阅指定类型的消息
        subscribeHandler(type: number, handler: MessageHandler<unknown>) {
            this.handlers.set(type, handler)
        },

        // 取消订阅指定类型消息
        unsubscribeHandler(type: number) {
            this.handlers.delete(type)
        },
    },
})
