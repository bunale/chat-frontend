<template>
    <div class="user-search-container">
        <van-nav-bar title="搜索用户" left-text="返回" left-arrow @click-left="goBack" />

        <van-search
            v-model="searchText"
            placeholder="请输入用户名"
            @update:model-value="handleSearch"
        />

        <van-list
            v-model:loading="loading"
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
                        style="margin-right: 10px"
                    />
                </template>
            </van-cell>
        </van-list>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { showToast } from 'vant'
    import { getUserList } from '@/api/userApi'
    import type { UserInfo } from '@/types/user'

    const router = useRouter()
    const searchText = ref('')
    const loading = ref(false)
    const finished = ref(false)
    const userList = ref<UserInfo[]>([])
    const pageNum = ref(1)
    const pageSize = ref(10)

    const goBack = () => {
        router.back()
    }

    const handleSearch = () => {
        pageNum.value = 1
        userList.value = []
        finished.value = false
        onLoad()
    }

    const onLoad = async () => {
        if (finished.value) return

        loading.value = true
        try {
            const res = await getUserList({
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                username: searchText.value,
            })

            if (res.code === '00000') {
                userList.value = [...userList.value, ...res.data.records]
                pageNum.value++
                if (res.data.records.length < pageSize.value) {
                    finished.value = true
                }
            } else {
                showToast(res.message)
                finished.value = true
            }
        } catch {
            showToast('请求失败')
            finished.value = true
        } finally {
            loading.value = false
        }
    }
</script>

<style lang="scss" scoped>
    .user-search-container {
        padding-top: 46px;
        min-height: 100vh;
        background-color: #f7f8fa;
    }
</style>
