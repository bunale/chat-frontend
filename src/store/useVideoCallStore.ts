import { defineStore } from 'pinia'
import { Packet, Offer } from '@/types/message'

interface VideoCallState {
    isConnected: boolean
    isSpeakerOn: boolean
    targetUserId: string
    offerMessage: Packet<Offer> | undefined
}

export const useVideoCallStore = defineStore('videoCall', {
    state: (): VideoCallState => {
        return {
            isConnected: false,
            isSpeakerOn: false,
            targetUserId: '',
            offerMessage: undefined,
        }
    },

    actions: {
        setConnectionState(connected: boolean) {
            this.isConnected = connected
        },

        setOfferMessage(offerMessage: Packet<Offer>) {
            this.offerMessage = offerMessage
        },

        setTargetUserId(targetUserId: string) {
            this.targetUserId = targetUserId
        },
    },
})
