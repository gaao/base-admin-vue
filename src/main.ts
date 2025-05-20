import { createApp } from 'vue'
import Antd from 'ant-design-vue' 
import 'ant-design-vue/dist/reset.css'
import './assets/styles/base.css'
import { router } from './router';
import { pinia } from './stores';
import App from './App.vue'

const app = createApp(App)
app.use(router);
app.use(pinia);
app.use(Antd)
// 配置路由及路由守卫
app.mount('#app')
