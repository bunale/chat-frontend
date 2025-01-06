<template>
    <div class="contact-list-container">
        <div class="fixed-wrapper">
            <van-search
                v-model="searchText"
                placeholder="搜索"
                @update:model-value="handleSearch"
            />
        </div>

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
                    <template #right-icon>
                        <van-button
                            v-if="!user.friendFlag"
                            size="small"
                            @click="handleAddFriend(user)"
                            style="margin-right: 20px"
                            >添加好友</van-button
                        >
                    </template>
                </van-cell>
            </van-list>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import { showToast } from 'vant'
    import { getUserPage } from '@/api/userApi'
    import { addFriend } from '@/api/friendshipApi'
    import type { UserPageVO } from '@/types/user'

    const searchText = ref('')
    const loading = ref(false)
    const finished = ref(false)
    const userList = ref<UserPageVO[]>([])
    const pageNum = ref(1)
    const pageSize = ref(10)
    const immediateCheck = ref(false)

    // 页面加载时查询第一页数据
    onMounted(() => {
        onLoad()
    })

    const handleSearch = () => {
        console.log('handleSearch')
        pageNum.value = 1
        userList.value = []
        finished.value = false
        onLoad()
    }

    const handleAddFriend = (user: UserPageVO) => {
        console.log('handleAddFriend', user)
        addFriend({ receiver: user.userId, remark: 'hahaha' })
            .then(() => {
                showToast('添加好友成功')
            })
            .catch(() => {
                showToast('添加好友失败')
            })
    }

    const onLoad = async () => {
        console.log('onLoad')
        if (finished.value) return

        loading.value = true
        try {
            getUserPage({
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                username: searchText.value,
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
            margin: 10px;
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
            padding-left: 20px;
        }
    }
</style>
