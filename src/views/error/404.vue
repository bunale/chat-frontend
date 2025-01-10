<script lang="ts">
    export default {
        name: 'NotFoundPage',
    }
</script>

<template>
    <div class="error-page not-found-page">
        <svg class="error-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M64 0a64 64 0 1 0 64 64A64 64 0 0 0 64 0zm0 121.6a57.6 57.6 0 1 1 57.6-57.6 57.6 57.6 0 0 1-57.6 57.6z"
            />
            <path
                d="M64 28.8a6.4 6.4 0 0 0-6.4 6.4v28.8a6.4 6.4 0 0 0 12.8 0V35.2a6.4 6.4 0 0 0-6.4-6.4z"
            />
            <circle cx="64" cy="89.6" r="6.4" />
        </svg>
        <h1 class="error-title">页面不存在</h1>
        <p class="error-desc">抱歉，您访问的页面已被删除或不存在</p>
        <van-button type="primary" size="large" round @click="goHome">返回首页</van-button>
    </div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const goHome = () => {
        router.push('/')
    }
</script>

<style lang="scss" scoped>
    .error-page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
        background-color: #fff;

        .error-icon {
            width: 128px;
            height: 128px;
            margin-bottom: 24px;
            fill: var(--van-primary-color);
        }

        .error-title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }

        .error-desc {
            font-size: 16px;
            color: #666;
            margin-bottom: 32px;
        }

        :deep(.van-button) {
            width: 80%;
            max-width: 300px;
        }
    }
</style>
