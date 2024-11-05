import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@/style/global.scss'
import 'normalize.css'

// pinia
import { createPinia } from 'pinia'

// 引入 Vant
import Vant from 'vant'
// 引入 Vant 样式
import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.use(Vant)
app.use(createPinia())
app.mount('#app')
