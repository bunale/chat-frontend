<template>
    <div class="chat-container vh-container">
        <div class="chat-body">
            <!-- 顶部标题栏 -->
            <div class="chat-header">
                <van-nav-bar :title="currentChat.name" left-arrow @click-left="goBack" />
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
                    <van-button
                        size="mini"
                        type="primary"
                        :disabled="!inputMessage.trim()"
                        class="send-btn"
                        @click="sendMessage"
                        >发送</van-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, nextTick } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const chatContent = ref<HTMLElement | null>(null)
    const inputMessage = ref('')

    // 当前聊天对象信息
    const currentChat = ref({
        name: '张三',
        avatar: '/src/assets/cat.png',
    })

    // 聊天记录
    const messageHistory = ref([
        {
            content: '你好啊！',
            isSelf: false,
            avatar: '/src/assets/cat.png',
            time: '14:30',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '最近在忙什么呢？',
            isSelf: true,
            avatar: '/src/assets/robot.png',
            time: '14:31',
        },
        {
            content: '在学习Vue和TypeScript',
            isSelf: false,
            avatar: '/src/assets/cat.png',
            time: '14:32',
        },
    ])

    // 发送消息
    const sendMessage = () => {
        if (!inputMessage.value.trim()) return

        messageHistory.value.push({
            content: inputMessage.value,
            isSelf: true,
            avatar: '/src/assets/robot.png',
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
        // margin-bottom: 60px; // 为底部输入框留出空间
        // height: calc(100vh - 85px); // 减去头部和底部的高度
        // overscroll-behavior: contain; // 防止滚动传播
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

            .send-btn {
                margin-left: 8px;
                border-radius: 16px;
                padding: 0 12px;
                height: 25px;
                font-size: 12px;

                &.van-button--primary {
                    background: #1c58fd; // 修改为蓝色
                    border-color: #1c58fd;
                }

                &.van-button--disabled {
                    background: #a8c4ff; // 修改为浅蓝色
                    border-color: #a8c4ff;
                }
            }
        }
    }
</style>
