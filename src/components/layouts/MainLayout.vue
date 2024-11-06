<template>
    <div class="layout">
        <!-- 顶部搜索区域 -->
        <div class="header">
            <van-search v-model="searchValue" placeholder="请输入搜索关键词" shape="round" />
        </div>

        <!-- 内容区域 -->
        <div class="content">
            <router-view></router-view>
        </div>

        <!-- 底部导航栏 -->
        <van-tabbar v-model="active" route>
            <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
            <van-tabbar-item icon="chat-o" to="/message">消息</van-tabbar-item>
            <van-tabbar-item icon="apps-o" to="/tools">工具</van-tabbar-item>
            <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'

    const active = ref(0)
    const searchValue = ref('')
</script>

<style lang="scss" scoped>
    .layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
    }

    .content {
        flex: 1;
        margin-top: 54px;
        margin-bottom: 50px;
        overflow-y: auto;
    }
</style>
