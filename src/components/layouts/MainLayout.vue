<template>
    <div class="layout">
        <!-- 顶部搜索区域 -->
        <header>
            <van-row style="width: 100%">
                <van-col span="8" class="userInfo">
                    <van-image round width="35px" height="35px" src="/src/assets/robot.png" />
                    <p class="userName">张三</p>
                </van-col>
                <van-col span="8" class="title">
                    <p class="title">Chat</p>
                </van-col>
                <van-col span="8" class="search-icon">
                    <van-icon name="search" class="search-icon" />
                </van-col>
            </van-row>
        </header>

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

    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        display: flex;
        // 水平居中
        justify-content: space-between;
        // 垂直居中
        align-items: bottom;
        width: $maxWidth;
        height: $headerHeight;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        overflow: hidden; // 超出隐藏
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1); // header 下阴影

        .userInfo {
            display: flex;
            align-items: center;
            padding-left: 20px;
            .userName {
                font-size: 14px;
                padding-top: 10px;
                margin-left: 8px;
            }
        }
        .title {
            line-height: $headerHeight;
            font-size: 18px;
            font-weight: bold;
            position: relative;
            top: 2px;
        }
        .search-icon {
            font-size: 24px;
            font-weight: bold;
            text-align: right;
            line-height: $headerHeight;
            padding-right: 20px;
        }
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
