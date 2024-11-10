<template>
    <div class="layout">
        <!-- 顶部搜索区域 -->
        <HeaderArea />

        <!-- 内容区域 -->
        <main>
            <router-view></router-view>
        </main>

        <!-- 底部导航栏 -->
        <footer>
            <van-tabbar v-model="active" route>
                <van-tabbar-item icon="chat-o" to="/message">消息</van-tabbar-item>
                <van-tabbar-item icon="apps-o" to="/tools">工具</van-tabbar-item>
                <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
            </van-tabbar>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import HeaderArea from '@/components/layouts/HeaderArea.vue'

    const active = ref(0)
</script>

<style lang="scss" scoped>
    .layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: $maxWidth;
        margin: 0 auto;
    }

    main {
        flex: 1;
        margin-top: 54px;
        margin-bottom: 50px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        width: 100%;
    }
</style>
