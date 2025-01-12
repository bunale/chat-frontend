<template>
    <div class="message-list">
        <div
            class="message-item"
            @click="goChat(item)"
            v-for="(item, index) in conversationList"
            :key="index"
        >
            <div class="avatar">
                <van-image :src="getAvatar(item)" round width="50" height="50" />
            </div>
            <div class="content">
                <div class="name">{{ getTitle(item) }}</div>
                <div class="message">{{ item.lastMessageContent }}</div>
            </div>
            <div class="right">
                <div class="time">{{ formatRelativeTime(item.lastMessageTime) }}</div>
                <!-- <div class="badge" v-if="item.unread">{{ item.unread }}</div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { Conversation } from '@/types/conversation'
    import { getConversationPage } from '@/api/conversationApi'
    import { ContactList } from 'vant'
    import { useUserStore } from '@/store/userStore'
    import { formatRelativeTime } from '@/utils/date'
    import { useConversationStore } from '@/store/conversationStore'

    const conversationStore = useConversationStore()
    const userStore = useUserStore()
    const router = useRouter()

    const pageNum = ref(1)
    const pageSize = ref(10)
    const loading = ref(false)
    const finished = ref(false)

    const conversationList = ref<Conversation[]>([])

    const getConversationData = () => {
        loading.value = true
        getConversationPage({
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            conversationType: null,
        }).then((res) => {
            conversationList.value = [...conversationList.value, ...res.records]
            loading.value = false

            conversationStore.setConversations(conversationList.value)
            if (ContactList.length >= res.totalRow) {
                finished.value = true
            }
        })
    }

    const goChat = (conversation: Conversation) => {
        console.log('goChat: ' + conversation.conversationId)
        router.push({
            name: 'chat',
            params: { conversationId: conversation.conversationId },
        })
    }

    const getTitle = (conversation: Conversation) => {
        if (conversation.title) {
            return conversation.title
        }

        return conversation.users.filter(
            (user) => user.userId !== userStore.getLoginedUser.userId
        )[0].username
    }
    const getAvatar = (conversation: Conversation) => {
        return conversation.users.filter(
            (user) => user.userId !== userStore.getLoginedUser.userId
        )[0].avatar
    }

    onMounted(() => {
        getConversationData()
    })
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
