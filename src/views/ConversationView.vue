<template>
    <div class="message-list">
        <div
            class="message-item"
            @click="goChat(item.userId, item.avatar, item.name)"
            v-for="(item, index) in messageList"
            :key="index"
        >
            <div class="avatar">
                <van-image :src="item.avatar" round width="50" height="50" />
            </div>
            <div class="content">
                <div class="name">{{ item.name }}</div>
                <div class="message">{{ item.lastMessage }}</div>
            </div>
            <div class="right">
                <div class="time">{{ item.time }}</div>
                <div class="badge" v-if="item.unread">{{ item.unread }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import cat from '@/assets/cat.png'
    import dog from '@/assets/dog.png'
    const router = useRouter()

    const messageList = ref([
        {
            id: 2,
            userId: '222',
            name: 'User',
            avatar: cat,
            lastMessage: '你好，最近怎么样？',
            time: '14:30',
            unread: 2,
        },
        {
            id: 4,
            userId: '222',
            name: '李四',
            avatar: dog,
            lastMessage: '周末要一起出去玩吗？',
            time: '昨天',
            unread: 0,
        },
        // 可以添加更多消息项...
    ])

    const goChat = (userId: string, avatar: string, name: string) => {
        console.log('goChat: ' + userId + ', ' + avatar + ', ' + name)
        router.push({
            name: 'chat',
            params: { userId: userId, avatar: avatar, targetName: name },
        })
    }
</script>

<style lang="scss" scoped>
    .message-list {
        display: flex;
        flex-direction: column;
    }

    .message-item {
        width: 100%;
        height: 70px;
        background-color: white;
        // border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        margin-top: 3px;

        .avatar {
            margin-right: 12px;
        }

        .content {
            flex: 1;
            overflow: hidden;
            text-align: left;

            .name {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 4px;
            }

            .message {
                font-size: 14px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .right {
            text-align: right;

            .time {
                font-size: 12px;
                color: #999;
                margin-bottom: 4px;
            }

            .badge {
                display: inline-block;
                min-width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                background-color: #ff4d4f;
                border-radius: 8px;
                padding: 0 4px;
                color: white;
                font-size: 12px;
            }
        }
    }
</style>
