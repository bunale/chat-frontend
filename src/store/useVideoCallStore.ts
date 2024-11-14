import { defineStore } from 'pinia'
import { Message } from '@/types/message'
interface VideoCallState {
    isConnected: boolean
    isSpeakerOn: boolean
    targetUserId: number
    offerMessage: Message<RTCSessionDescriptionInit> | undefined
}

export const useVideoCallStore = defineStore('videoCall', {
    state: (): VideoCallState => {
        return {
            isConnected: false,
            isSpeakerOn: false,
            targetUserId: 0,
            offerMessage: undefined as Message<RTCSessionDescriptionInit> | undefined,
        }
    },

    actions: {
        setConnectionState(connected: boolean) {
            this.isConnected = connected
        },

        setOfferMessage(offerMessage: Message<RTCSessionDescriptionInit>) {
            this.offerMessage = offerMessage
        },

        setTargetUserId(targetUserId: number) {
            this.targetUserId = targetUserId
        },
    },
})
