import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'

// 扩展 RouteMeta 类型
declare module 'vue-router' {
    interface RouteMeta {
        open?: boolean
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../components/HomeView.vue'),
            meta: { open: false },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/components/LoginView.vue'),
            meta: { open: true },
        },
        // 可以添加更多路由...
    ],
})

// 路由拦截器
router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()
    if (!to.meta.open && !userStore.user) {
        console.log('no user, redirect to login', to.meta.open, userStore.user)
        next({ name: 'login' })
    } else {
        next()
    }
})
export default router
