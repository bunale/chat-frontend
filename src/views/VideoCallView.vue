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
    import { MessageData } from '@/types/message'

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
            console.log(
                'videoCallStore: ',
                videoCallStore.offerMessage,
                videoCallStore.targetUserId
            )
            if (videoCallStore.offerMessage) {
                const targetUserId = videoCallStore.offerMessage.data.from
                // 创建 RTCPeerConnection
                await createPeerConnection(targetUserId)

                resolveOffer(videoCallStore.offerMessage)

                // 订阅消息
                webScoketStore.subscribeHandler('videoCall', messageHandler)
            } else {
                // 发送 offer 消息
                let targetUserId = videoCallStore.targetUserId
                await createPeerConnection(targetUserId)
                let offer = await peerConnection.value?.createOffer()
                await peerConnection.value?.setLocalDescription(offer)
                let data: MessageData<any> = {
                    sign: 'offer',
                    from: userStore.user?.id as number,
                    to: targetUserId,
                    data: offer as RTCSessionDescriptionInit,
                }
                webScoketStore.sendMessage({
                    scene: 'videoCall',
                    data,
                })
                console.log('send offer: ', data)
                webScoketStore.subscribeHandler('videoCall', messageHandler)
            }
        } catch (err) {
            console.error('Error initializing WebRTC:', err)
        }
    }

    async function createPeerConnection(targetUserId: number) {
        peerConnection.value = new RTCPeerConnection(configuration)

        // 获取本地媒体流
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        // 重要：将所有轨道添加到 peer connection
        stream.getTracks().forEach((track) => {
            peerConnection.value?.addTrack(track, stream)
        })
        // 设置本地视频流
        if (localVideo.value) {
            localVideo.value.srcObject = stream
        }
        // 处理远程流
        peerConnection.value.ontrack = (event) => {
            console.log('remote ontrack: ', event)
            if (remoteVideo.value) {
                remoteVideo.value.srcObject = event.streams[0]
            }
        }
        // 处理 ICE 候选
        peerConnection.value.onicecandidate = (event) => {
            console.log('ICE candidate: ', event.candidate)
            if (event.candidate) {
                const data = {
                    sign: 'candidate',
                    from: userStore.user?.id as number,
                    to: targetUserId,
                    data: event.candidate,
                }
                // 发送 ICE candidate 到信令服务器
                webScoketStore.sendMessage({
                    scene: 'videoCall',
                    data,
                })
                console.log('send candidate: ', data)
            }
        }
    }

    const messageHandler = {
        handle: async (message) => {
            console.log('Received message:', message)
            if (message.data.sign === 'answer') {
                console.log('Processing answer')
                try {
                    await peerConnection.value?.setRemoteDescription(
                        new RTCSessionDescription(message.data.data)
                    )
                } catch (e) {
                    console.error('Error setting remote description:', e)
                }
            } else if (message.data.sign === 'offer') {
                console.log('Processing offer')
                await resolveOffer(message)
            } else if (message.data.sign === 'candidate') {
                console.log('Processing ICE candidate')
                try {
                    await peerConnection.value?.addIceCandidate(
                        new RTCIceCandidate(message.data.data)
                    )
                } catch (e) {
                    console.error('Error adding ICE candidate:', e)
                }
            }
        },
    }

    const resolveOffer = async (message: any) => {
        console.log('receive offer: ', message)
        let targetUserId = message.data.from
        await createPeerConnection(targetUserId)
        await peerConnection.value?.setRemoteDescription(
            new RTCSessionDescription(message.data.data)
        )
        const answer = await peerConnection.value?.createAnswer()
        await peerConnection.value?.setLocalDescription(answer)
        let data = {
            sign: 'answer',
            from: userStore.user?.id,
            to: targetUserId,
            data: answer,
        }
        webScoketStore.sendMessage({
            scene: 'videoCall',
            data,
        })
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
