import { defineStore } from 'pinia'

interface VideoCallState {
    isConnected: boolean
    targetUserId: number | null
    isSpeakerOn: boolean
    offerMessage: any
}

export const useVideoCallStore = defineStore('videoCall', {
    state: (): VideoCallState => ({
        isConnected: false,
        targetUserId: null,
        isSpeakerOn: true,
        offerMessage: null
    }),
    
    actions: {
        setConnectionState(connected: boolean) {
            this.isConnected = connected
        },
        
        setOfferMessage(offerMessage: any) {
            this.offerMessage = offerMessage
        },

        setTargetUserId(targetUserId: number) {
            this.targetUserId = targetUserId
        }
    }
}) 