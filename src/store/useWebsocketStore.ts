import { ref } from 'vue';
import { defineStore } from 'pinia'
import { useUserStore } from './userStore';
import { useVideoCallStore } from './useVideoCallStore';
import router from '@/router';

interface Message {
    scene: string;
    data: MessageData;
}
interface MessageData {
    sign: string;
    from: number;
    to: number;
    data: any;
}
interface MessageHandler {
    handle(data: Message): void;
}


export const useWebScoketStore = defineStore('websocket', {
    state: () => {
        return {
            websocket: ref<WebSocket | null>(null),
            handlers: ref<Map<string, MessageHandler>>(new Map()),
        }
    },

    actions: {
        connect() {
            const userStore = useUserStore()
            if (!userStore.user && this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                return;
            }

            // 订阅视频通话offer消息
            this.subscribeHandler('videoCall', {
                handle: async (message: any) => {
                    const videoCallStore = useVideoCallStore()
                    if (message.data.sign === 'offer') {
                        videoCallStore.setOfferMessage(message)
                        router.push({name: 'videoCall' })
                    }
                }
            })

            console.log("websocket url: " + 'ws://localhost:8080/' +  userStore.user?.id)
            this.websocket = new WebSocket('ws://localhost:8080/' + userStore.user?.id);
            this.websocket.onopen = () => {
                console.log("websocket open");
            }
            this.websocket.onclose = () => {
                console.log("websocket close");
            }
            this.websocket.onerror = (event) => {
                console.log("websocket error: " + event);
            }
            // 处理消息
            this.websocket.onmessage = (event) => {
                const data: Message = JSON.parse(event.data);
                console.log('receive message: ', data)
                this.handlers.get(data.scene)?.handle(data);  
            }
            
        },

        // 发送消息
        sendMessage(message: Message) {
            if (!this.websocket) {
                console.error("websocket not connected");
                return;
            }

            this.websocket.send(JSON.stringify(message));
        },

        // 订阅消息
        subscribeHandler(type: string, handler: MessageHandler) {
            this.handlers.set(type, handler);
        },

        // 取消订阅消息
        unsubscribeHandler(type: string) {
            this.handlers.delete(type);
        }

    }
})
