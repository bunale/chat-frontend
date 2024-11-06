<template>
    <div class="profile">
        <h2>个人中心</h2>
        <van-button type="default" @click="logout">退出登录</van-button>
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
