<template>
    <div class="user-search-container">
        <div class="fixed-wrapper">
            <van-nav-bar left-text="返回" left-arrow @click-left="goBack" />
            <van-search
                v-model="searchText"
                placeholder="请输入用户名"
                @update:model-value="handleSearch"
            />
        </div>

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
                            style="margin-right: 10px"
                        />
                    </template>
                </van-cell>
            </van-list>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { showToast } from 'vant'
    import { getUserPage } from '@/api/userApi'
    import type { BaseUser } from '@/types/user'
    import { onMounted } from 'vue'

    const router = useRouter()
    const searchText = ref('')
    const loading = ref(false)
    const finished = ref(false)
    const userList = ref<BaseUser[]>([])
    const pageNum = ref(1)
    const pageSize = ref(10)
    const immediateCheck = ref(false)

    // 页面加载时查询第一页数据
    onMounted(() => {
        onLoad()
    })

    const goBack = () => {
        router.back()
    }

    const handleSearch = () => {
        console.log('handleSearch')
        pageNum.value = 1
        userList.value = []
        finished.value = false
        onLoad()
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
    .user-search-container {
        padding-top: 0;
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
