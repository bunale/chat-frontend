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
                redirect: '/conversation',
            },
            {
                path: 'conversation',
                name: 'conversation',
                component: () => import('@/views/ConversationView.vue'),
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
                path: '/contactList',
                name: 'contactList',
                component: () => import('@/views/ContactList.vue'),
            },
            {
                path: '/user-search',
                name: 'userSearch',
                component: () => import('@/views/UserSearchView.vue'),
            },
        ],
    },
    {
        path: '/chat/:conversationId',
        name: 'chat',
        component: () => import('@/views/ChatView.vue'),
        meta: { open: true },
    },
    {
        path: '/video-call',
        name: 'videoCall',
        component: VideoCallView,
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
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401.vue'),
        meta: { open: true },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: { open: true },
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
