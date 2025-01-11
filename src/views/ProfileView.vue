<template>
    <div class="profile">
        <van-cell-group inset>
            <van-cell center title="头像">
                <template #right-icon>
                    <van-image round :src="userStore.user?.avatar" />
                </template>
            </van-cell>

            <van-cell title="用户ID" :value="userStore.user?.userId" />
            <van-cell title="用户名" :value="userStore.user?.name" />
            <van-cell title="邮箱" :value="userStore.user?.email" />
            <van-cell title="角色" :value="userStore.user?.roles?.join(', ')" />
            <van-cell
                title="注册时间"
                :value="new Date(userStore.user?.createTime).toLocaleString()"
            />
        </van-cell-group>

        <div class="logout-btn">
            <van-button type="danger" round block @click="logout">退出登录</van-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useUserStore } from '@/store/userStore'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const router = useRouter()

    const logout = () => {
        userStore.clearUser()
        router.push('/login')
    }
</script>

<style scoped>
    .profile {
        padding: 16px;

        :deep(.van-cell__title) {
            flex: none;
            width: 80px;
            text-align: left;
        }

        .van-cell__value {
            text-align: right;
        }

        :deep(.van-cell.van-cell--center) {
            display: flex;
            justify-content: space-between;
            :deep(.van-image) {
                height: 60px;
            }
        }
    }

    .logout-btn {
        margin: 32px 16px 0;
    }
</style>
