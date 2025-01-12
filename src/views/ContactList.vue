<template>
    <div class="contact-list-container">
        <!-- 好友请求折叠区域 -->
        <van-collapse v-model="activeCollapse" accordion>
            <van-collapse-item title="新好友请求" name="1">
                <van-list :loading="friendLoading" :finished="friendFinished">
                    <van-cell
                        v-for="request in friendRequests"
                        :key="request.id"
                        :title="request.initiatorUsername"
                        :label="request.remark"
                    >
                        <template #icon>
                            <van-image
                                round
                                width="40px"
                                height="40px"
                                :src="request.initiatorAvatar"
                                style="margin-right: 10px"
                            />
                        </template>
                        <template #right-icon>
                            <van-button size="small" @click="handleAccept(request.id)"
                                >接受</van-button
                            >
                        </template>
                    </van-cell>
                </van-list>
            </van-collapse-item>
        </van-collapse>

        <!-- 用户列表 -->
        <div class="list-wrapper">
            <van-list
                v-model:loading="loading"
                offset="100"
                :immediate-check="immediateCheck"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell
                    v-for="user in userList"
                    :key="user.userId"
                    :title="user.name"
                    :label="user.email"
                >
                    <template #icon>
                        <van-image
                            round
                            width="40px"
                            height="40px"
                            :src="user.avatar"
                            style="margin: 0 20px 0"
                        />
                    </template>
                </van-cell>
            </van-list>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import { showToast } from 'vant'
    import type { BaseUser } from '@/types/user'
    import type { FriendshipRequestVO } from '@/types/friendship'
    import { getFriendList, getMyFriendshipRequest, handleFriendship } from '@/api/friendshipApi'

    const activeCollapse = ref<string[]>([])
    const friendRequests = ref<FriendshipRequestVO[]>([])
    const friendLoading = ref(false)
    const friendFinished = ref(false)

    // 模拟获取好友请求数据
    const getFriendRequests = async () => {
        friendLoading.value = true
        try {
            getMyFriendshipRequest({
                pageNum: 1,
                pageSize: 3,
                status: 0,
            }).then((res) => {
                friendRequests.value = res.records
            })
        } finally {
            friendLoading.value = false
            friendFinished.value = true
        }
    }

    // 处理接受好友请求
    const handleAccept = (id: number) => {
        // TODO: 实现接受好友请求逻辑
        handleFriendship({ friendshipId: id, status: 1 }).then(() => {
            showToast('已接受好友请求')
            friendRequests.value = friendRequests.value.filter((request) => request.id !== id)

            finished.value = false
            onLoad()
        })
    }

    onMounted(() => {
        getFriendRequests()
        onLoad()
    })

    const loading = ref(false)
    const finished = ref(false)
    const userList = ref<BaseUser[]>([])
    const pageNum = ref(1)
    const pageSize = ref(10)
    const immediateCheck = ref(false)

    const onLoad = async () => {
        console.log('onLoad')
        if (finished.value) return

        loading.value = true
        try {
            getFriendList({
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                username: null,
            }).then((res) => {
                if (pageNum.value === 1) {
                    userList.value = res.records
                } else {
                    userList.value = [...userList.value, ...res.records]
                }

                // 判断是否还有更多数据
                if (userList.value.length >= res.totalRow) {
                    console.log('finished')
                    finished.value = true
                } else {
                    pageNum.value++
                }

                loading.value = false
            })
        } catch {
            showToast('请求失败')
            finished.value = true
        }
    }
</script>

<style lang="scss" scoped>
    .contact-list-container {
        padding-top: 0;

        .van-collapse {
            margin: 6px 0;
            border-radius: 8px;
            overflow: hidden;
        }

        .van-collapse-item__content {
            padding: 0;
        }

        min-height: 100vh;
        background-color: #f7f8fa;
        display: flex;
        flex-direction: column;

        .fixed-wrapper {
            position: sticky;
            top: 0;
            z-index: 1;
            background-color: #fff;
        }

        .list-wrapper {
            flex-grow: 1;
        }

        :deep(.van-nav-bar__text) {
            font-size: 16px;
        }

        :deep(.van-cell__title) {
            text-align: left;
        }
    }
</style>
