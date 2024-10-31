import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/HomeView.vue')
    },
    // 可以添加更多路由...
  ]
})

export default router