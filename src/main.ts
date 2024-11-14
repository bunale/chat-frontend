import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@/styles/global.scss'
import '@/styles/viewport.scss'
import 'normalize.css'
import { initViewportHeight } from './utils/viewport'

import { useWebScoketStore } from './store/useWebsocketStore'

// 初始化视口高度
initViewportHeight()
// pinia
import { createPinia } from 'pinia'
// 引入 Vant
import Vant from 'vant'
// 引入 Vant 样式
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()

// 注意顺序：先使用 pinia，再使用 router
app.use(pinia)
app.use(router)
app.use(Vant)
app.mount('#app')

// 连接websocket
const webScoketStore = useWebScoketStore()
webScoketStore.connect()
