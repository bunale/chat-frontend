<template>
    <div class="video-call-container">
        <!-- 顶部信息区域 -->
        <div class="caller-info">
            <van-image
                :src="route.params.avatar as string"
                round
                width="60"
                height="60"
                class="caller-avatar"
            />
            <div class="caller-name">{{ route.params.name }}</div>
        </div>

        <!-- 视频显示区域 -->
        <div class="video-area">
            <!-- 远程视频 -->
            <video ref="remoteVideo" autoplay playsinline muted class="remote-video"></video>
            <!-- 本地视频 -->
            <video ref="localVideo" autoplay playsinline muted class="local-video"></video>
        </div>

        <!-- 底部控制按钮 -->
        <div class="control-buttons">
            <van-button round class="control-btn speaker-btn" @click="toggleSpeaker">
                <van-icon :name="isSpeakerOn ? 'volume' : 'volume-o'" size="24" />
            </van-button>
            <van-button round class="control-btn hangup-btn" @click="hangup">
                <van-icon name="phone-circle-o" size="24" />
            </van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useWebScoketStore } from '@/store/useWebsocketStore'
    import { useUserStore } from '@/store/userStore'
    import { useVideoCallStore } from '@/store/useVideoCallStore'
    import { Packet, Offer, Answer, Candidate } from '@/types/message'
    import Command from '@/common/Command'

    const router = useRouter()
    const route = useRoute()
    const isSpeakerOn = ref(true)
    const localVideo = ref<HTMLVideoElement | null>(null)
    const remoteVideo = ref<HTMLVideoElement | null>(null)
    const peerConnection = ref<RTCPeerConnection | null>(null)
    const webScoketStore = useWebScoketStore()
    const userStore = useUserStore()
    const videoCallStore = useVideoCallStore()

    // WebRTC ICE 配置
    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    }
    // 组件挂载时初始化
    onMounted(() => {
        initWebRTC()
    })

    // 初始化 WebRTC 连接
    const initWebRTC = async () => {
        try {
            console.log('init WebRTC')
            console.log('videoCallStore: ', JSON.stringify(videoCallStore))

            // 如果有 offerMessage，说明是被呼叫方
            if (videoCallStore.offerMessage) {
                const targetUserId = videoCallStore.offerMessage.message.from
                // 创建 RTCPeerConnection
                await initPeerConnection(targetUserId)
                // 处理 offer
                await resolveOfferAndSendAnswer(videoCallStore.offerMessage)
            }

            // 如果没有 offerMessage，说明是主叫方
            else {
                // 创建WebRTC连接
                let targetUserId = videoCallStore.targetUserId
                await initPeerConnection(targetUserId)
                // 创建 offer，设置为本地会话描述
                let offer = await peerConnection.value?.createOffer()
                await peerConnection.value?.setLocalDescription(offer)
                // 发送Offer到信令服务器
                let packet: Packet<Offer> = {
                    command: Command.OFFER,
                    message: {
                        from: userStore.user?.userId,
                        to: targetUserId,
                        data: offer,
                    },
                }
                webScoketStore.sendMessage(packet)
                console.log('send offer: ', packet)

                // 订阅Answer信令
                await webScoketStore.subscribeHandler(Command.ANSWER, messageHandler)
            }

            // 不管是主叫方还是被呼叫方，都订阅ICE候选信令消息
            webScoketStore.subscribeHandler(Command.ICE_CANDIDATE, messageHandler)
        } catch (err) {
            console.error('Error initializing WebRTC:', err)
        }
    }

    /**
     * 创建并初始化 RTCPeerConnection 连接
     * @param targetUserId  目标用户 ID
     */
    async function initPeerConnection(targetUserId: string) {
        // 创建 RTCPeerConnection
        peerConnection.value = new RTCPeerConnection(configuration)

        /*
            处理本地媒体流
            1. 获取本地媒体流
            2. 将本地媒体流所有轨道添加到 peerConnection
            3. 将本地媒体流输出到 Local Video 标签
        */
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        stream.getTracks().forEach((track) => {
            peerConnection.value?.addTrack(track, stream)
        })
        if (localVideo.value) {
            localVideo.value.srcObject = stream
        }

        // 将远程媒体流输出到Remote Video标签
        peerConnection.value.ontrack = (event) => {
            console.log('remote ontrack: ', event)
            if (remoteVideo.value) {
                remoteVideo.value.srcObject = event.streams[0]
            }
        }

        // 将收集到的ICE候选发送至信令服务器
        peerConnection.value.onicecandidate = (event) => {
            console.log('ICE candidate: ', event.candidate)
            if (event.candidate) {
                webScoketStore.sendMessage({
                    command: Command.ICE_CANDIDATE,
                    message: {
                        from: userStore.user?.userId,
                        to: targetUserId,
                        data: event.candidate,
                    },
                })
            }
        }
    }

    /**
     * 信令消息处理器
     */
    const messageHandler = {
        handle: async (packet: Packet<unknown>) => {
            console.log('Processing packet: ', packet.command)
            switch (packet.command) {
                case Command.OFFER:
                    await resolveOfferAndSendAnswer(packet as Packet<Offer>)
                    break
                case Command.ANSWER:
                    await peerConnection.value?.setRemoteDescription(
                        new RTCSessionDescription((packet as Packet<Answer>).message.data)
                    )
                    break
                case Command.ICE_CANDIDATE:
                    await peerConnection.value?.addIceCandidate(
                        new RTCIceCandidate((packet as Packet<Candidate>).message.data)
                    )
                    break
                default:
                    console.log('Unknown command:', packet.command)
            }
        },
    }

    /**
     * 处理 offer 信令, 并发送 answer 信令
     *
     * @param packet Packet<Offer>
     */
    const resolveOfferAndSendAnswer = async (packet: Packet<Offer>) => {
        console.log('receive offer: ', packet)
        let targetUserId = packet.message.from
        await peerConnection.value?.setRemoteDescription(
            new RTCSessionDescription(packet.message.data)
        )

        const answer = await peerConnection.value?.createAnswer()
        await peerConnection.value?.setLocalDescription(answer)
        const data = {
            command: Command.ANSWER,
            message: {
                from: userStore.user?.userId,
                to: targetUserId,
                data: answer,
            },
        }
        webScoketStore.sendMessage(data)
        console.log('send answer: ', data)
    }

    // 组件卸载时清理
    onBeforeUnmount(() => {
        // Close video stream with type assertion
        ;((localVideo.value?.srcObject as MediaStream)?.getTracks() || []).forEach((track) =>
            track.stop()
        )
        // Close connection
        peerConnection.value?.close()
    })

    const toggleSpeaker = () => {
        isSpeakerOn.value = !isSpeakerOn.value
    }

    const hangup = () => {
        router.back()
    }
</script>

<style lang="scss" scoped>
    .video-call-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2000;
    }

    .caller-info {
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .caller-avatar {
            margin-bottom: 12px;
        }

        .caller-name {
            color: #fff;
            font-size: 18px;
        }
    }

    .control-buttons {
        position: absolute;
        bottom: 40px;
        display: flex;
        gap: 20px;

        .control-btn {
            width: 50px;
            height: 50px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            &.speaker-btn {
                background-color: rgba(255, 255, 255, 0.2);
                border: none;

                .van-icon {
                    color: #fff;
                }
            }

            &.hangup-btn {
                background-color: #ff4444;
                border: none;

                .van-icon {
                    color: #fff;
                    transform: rotate(135deg);
                }
            }
        }
    }

    .video-area {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 50vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .remote-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
        }

        .local-video {
            width: 120px;
            height: 160px;
            object-fit: cover;
            position: absolute;
            right: 20px;
            bottom: 20px;
            border-radius: 8px;
            z-index: 1;
        }
    }
</style>
