<template>
    <div class="chat-container vh-container">
        <div class="chat-body">
            <!-- 顶部标题栏 -->
            <div class="chat-header">
                <van-nav-bar :title="targetName" left-arrow @click-left="goBack" />
            </div>

            <!-- 聊天记录区域 -->
            <div class="chat-content" @touchmove.stop ref="chatContent">
                <div
                    v-for="(msg, index) in messageHistory"
                    :key="index"
                    :class="['message-item', msg.isSelf ? 'self' : 'other']"
                >
                    <div class="avatar">
                        <van-image :src="msg.avatar" round width="40" height="40" />
                    </div>
                    <div class="message-bubble">{{ msg.content }}</div>
                </div>
            </div>

            <!-- 底部输入区域 -->
            <div class="chat-footer fixed-bottom">
                <div class="input-wrapper">
                    <div class="tools">
                        <van-icon name="volume-o" size="24" color="#666" />
                    </div>
                    <van-field
                        v-model="inputMessage"
                        type="textarea"
                        placeholder="请输入消息"
                        :border="false"
                        :rows="1"
                        :autosize="{ maxHeight: 120, minHeight: 20 }"
                        class="message-input"
                    />
                    <van-icon name="smile-o" class="smile-icon" />
                    <!-- 使用 v-if/v-else 切换显示 -->
                    <van-button
                        v-if="inputMessage.trim()"
                        size="mini"
                        type="primary"
                        class="send-btn"
                        @click="sendMessage"
                        >发送</van-button
                    >
                    <van-button v-else size="mini" class="plus-btn" @click="showActionSheet">
                        <van-icon name="plus" size="20" />
                    </van-button>
                </div>
            </div>
        </div>
    </div>

    <!-- 自定义底部操作菜单 -->
    <van-action-sheet v-model:show="showActions" class="custom-action-sheet">
        <div class="action-grid">
            <van-swipe :show-indicators="true">
                <van-swipe-item v-for="(page, pageIndex) in actionPages" :key="pageIndex">
                    <div class="grid-container">
                        <div
                            v-for="(action, index) in page"
                            :key="index"
                            class="grid-item"
                            @click="onSelectAction(action)"
                        >
                            <van-icon :name="action.icon" />
                            <span class="action-name">{{ action.name }}</span>
                        </div>
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div>
    </van-action-sheet>
</template>

<script lang="ts" setup>
    import { ref, onMounted, nextTick, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useVideoCallStore } from '@/store/useVideoCallStore'
    import cat from '@/assets/cat.png'
    import robot from '@/assets/robot.png'

    const videoCallStore = useVideoCallStore()
    const router = useRouter()
    const route = useRoute()
    const chatContent = ref<HTMLElement | null>(null)
    const inputMessage = ref('')
    const targetUserId = ref(0)
    const avatar = ref('')
    const targetName = ref('')
    // 操作菜单相关
    const showActions = ref(false)
    const actions = [
        { name: '选择文件', icon: 'photo-o' },
        { name: '拍摄', icon: 'camera-o' },
        { name: '发送位置', icon: 'location-o' },
        { name: '语音输入', icon: 'volume-o' },
        { name: '视频通话', icon: 'video-o' },
        { name: '发送表情', icon: 'smile-o' },
        { name: '发送名片', icon: 'contact' },
        { name: '收藏', icon: 'star-o' },
        { name: '文件', icon: 'description' },
        { name: '红包', icon: 'cash-o' },
    ]

    // 将操作选项分页
    const actionPages = computed(() => {
        const itemsPerPage = 8 // 每页8个选项
        const pages = []
        for (let i = 0; i < actions.length; i += itemsPerPage) {
            pages.push(actions.slice(i, i + itemsPerPage))
        }
        return pages
    })

    // 处理菜单选项点击
    const onSelectAction = (action: { name: string }) => {
        switch (action.name) {
            case '选择文件':
                handleSelectFile()
                break
            case '发送位置':
                handleLocation()
                break
            case '语音输入':
                handleVoiceInput()
                break
            case '视频通话':
                handleVideoCall()
                break
        }
    }

    // 具体功能处理方法
    const handleSelectFile = () => {
        console.log('选择文件')
        // 实现文件选择逻辑
    }

    const handleLocation = () => {
        console.log('发送位置')
        // 实现位置发送逻辑
    }

    const handleVoiceInput = () => {
        console.log('语音输入')
        // 实现语音输入逻辑
    }

    const handleVideoCall = () => {
        showActions.value = false // 关闭action sheet
        videoCallStore.setTargetUserId(targetUserId.value)
        router.push({
            name: 'videoCall',
        })
    }

    // 显示操作菜单
    const showActionSheet = () => {
        showActions.value = true
    }

    // 聊天记录
    const messageHistory = ref([
        {
            content: '你好啊！',
            isSelf: false,
            avatar: cat,
            time: '14:30',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: robot,
            time: '14:31',
        },
        {
            content: '在学习Vue和TypeScript',
            isSelf: false,
            avatar: cat,
            time: '14:32',
        },
    ])

    // 发送消息
    const sendMessage = () => {
        if (!inputMessage.value.trim()) return

        messageHistory.value.push({
            content: inputMessage.value,
            isSelf: true,
            avatar: robot,
            time: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        })

        inputMessage.value = ''
        scrollToBottom()
    }

    // 滚动到底部
    const scrollToBottom = async () => {
        await nextTick()
        if (chatContent.value) {
            chatContent.value.scrollTop = chatContent.value.scrollHeight
        }
    }

    // 返回上一页
    const goBack = () => {
        router.back()
    }

    onMounted(() => {
        console.log('router.currentRoute.value.params: ' + JSON.stringify(route.params))
        targetUserId.value = Number(route.params.userId as string)
        avatar.value = route.params.avatar as string
        targetName.value = route.params.targetName as string
        scrollToBottom()
    })
</script>

<style lang="scss" scoped>
    $headerHeight: 40px;
    $footerHeight: 60px;

    .chat-container {
        display: flex;
        flex-direction: column;
        width: $maxWidth;
        height: 100vh;
        background-color: #f7f7f7;
    }

    .chat-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden; // 重要：防止内容溢出
    }

    .chat-header {
        position: fixed;
        top: 0;
        flex-shrink: 0;
        width: $maxWidth;
        height: $headerHeight;
        background-color: #fff;
        z-index: 1000;

        .van-nav-bar {
            height: $headerHeight;
            vertical-align: middle;
        }
    }

    .chat-content {
        flex: 1;
        width: $maxWidth;
        overflow-y: auto;
        padding: calc($headerHeight + 16px) 16px calc($footerHeight) 16px;
    }

    .message-item {
        display: flex;
        margin-bottom: 16px;

        .avatar {
            flex-shrink: 0;
        }

        .message-bubble {
            max-width: 70%;
            padding: 10px 10px;
            border-radius: 4px;
            word-break: break-all;
            margin: 0 10px;
        }

        &.other {
            .message-bubble {
                background-color: #fff;
            }
        }

        &.self {
            flex-direction: row-reverse;

            .message-bubble {
                background-color: #1989fa; // 修改为蓝色
                color: #fff; // 添加白色文字
            }
        }
    }

    .chat-footer {
        flex-shrink: 0;
        padding: 3px;
        background-color: #fff;
        border-top: 1px solid #eee;
        width: $maxWidth;
        min-height: $headerHeight;

        .input-wrapper {
            display: flex;
            align-items: center;
            background-color: #f7f7f7;
            border-radius: 4px;
            padding: 4px 8px;
            min-height: $headerHeight;

            .tools {
                padding: 0 8px;
                display: flex;
                align-items: center;
            }

            .message-input {
                flex: 1;
                padding: 5px;
                background-color: white;
                border-radius: 3px;
            }

            .smile-icon {
                margin-left: 8px;
                font-size: 24px;
            }

            .send-btn,
            .plus-btn {
                margin-left: 8px;
                border-radius: 16px;
                padding: 0 12px;
                height: 32px;
                min-width: 32px; // 确保加号按钮为正圆形

                // 发送按钮样式
                &.send-btn {
                    background: #1c58fd;
                    border-color: #1c58fd;
                    font-size: 14px;
                }

                // 加号按钮样式
                &.plus-btn {
                    padding: 0;
                    background: #f5f5f5;
                    border: none;

                    :deep(.van-icon) {
                        color: #666;
                        line-height: 32px;
                    }

                    &:active {
                        background: #e8e8e8;
                    }
                }
            }
        }

        // 自定义 ActionSheet 样式
        :deep(.van-action-sheet) {
            .van-action-sheet__item {
                display: flex;
                align-items: center;
                padding: 14px 16px;

                .van-icon {
                    margin-right: 8px;
                    font-size: 20px;
                }
            }
        }
    }

    .custom-action-sheet {
        :deep(.van-action-sheet__content) {
            padding: 16px 0;
        }

        .action-grid {
            .van-swipe {
                height: 200px; // 调整高度以适应两行内容

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    gap: 12px;
                    padding: 0 16px;
                }

                .grid-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 12px 0;

                    .van-icon {
                        font-size: 28px;
                        margin-bottom: 8px;
                        color: #666;
                    }

                    .action-name {
                        font-size: 12px;
                        color: #333;
                    }

                    &:active {
                        background-color: #f5f5f5;
                        border-radius: 8px;
                    }
                }
            }
        }

        // 自定义指示器样式
        :deep(.van-swipe__indicators) {
            bottom: -8px;

            .van-swipe__indicator {
                width: 6px;
                height: 6px;
                background-color: #ddd;
                opacity: 0.8;
                border-radius: 50%;

                &--active {
                    background-color: #1989fa;
                }
            }
        }
    }
</style>
