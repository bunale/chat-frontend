import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'
// 导入相关组件
import MainLayout from '@/components/layouts/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'
// 扩展 RouteMeta 类型
declare module 'vue-router' {
    interface RouteMeta {
        open?: boolean
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'message',
                name: 'message',
                component: () => import('@/views/MessageView.vue'),
            },
            {
                path: 'tools',
                name: 'tools',
                component: () => import('@/views/ToolsView.vue'),
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/views/ProfileView.vue'),
            },
        ],
    },
    // 登录页面保持独立路由
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { open: true },
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/ChatView.vue'),
        meta: { open: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

// 路由拦截器
router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()
    console.log('beforeEach: ', to.meta.open, userStore.user)
    if (!to.meta.open && !userStore.user) {
        next({ name: 'login' })
    } else {
        next()
    }
})
export default router
