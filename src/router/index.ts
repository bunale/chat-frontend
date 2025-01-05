import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import MainLayout from '@/components/layouts/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'
import VideoCallView from '../views/VideoCallView.vue'

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
            {
                path: '/user-search',
                name: 'userSearch',
                component: () => import('@/views/UserSearchView.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { open: true },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { open: true },
    },

    {
        path: '/chat/:userId/:avatar/:targetName',
        name: 'chat',
        component: () => import('@/views/ChatView.vue'),
        meta: { open: true },
    },
    {
        path: '/video-call',
        name: 'videoCall',
        component: VideoCallView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

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
