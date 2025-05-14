import { createApp } from 'vue'
import Antd from 'ant-design-vue' 
import 'ant-design-vue/dist/reset.css'
import "@ant-design-vue/pro-layout/dist/style.css"; 
import './assets/styles/base.css'
// @ts-ignore 忽略类型检查，因为 pro-layout 的类型声明文件存在导出兼容性问题
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout"
import { router } from './router';
import { pinia } from './store';
import App from './App.vue'

const app = createApp(App)
app.use(router);
app.use(pinia);
app.use(Antd).use(ProLayout).use(PageContainer)
// 配置路由及路由守卫
app.mount('#app')
