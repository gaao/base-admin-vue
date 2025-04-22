<template>
  <a-layout class="layout-container">
    
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="layout-header">
        <menu-fold-outlined
          v-if="!collapsed"
          class="trigger"
          @click="() => (collapsed = true)"
        />
        <menu-unfold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = false)"
        />
        <div class="header-right">
          <a-dropdown>
            <a-avatar>User</a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <user-outlined />
                  个人中心
                </a-menu-item>
                <a-menu-item>
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="layout-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import {
//   UserOutlined,
//   VideoCameraOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   LogoutOutlined
// } from '@ant-design/icons-vue'

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['1'])
</script>
<style scoped>
/* .layout-container {
  min-height: 100vh;
}

.layout-container .layout-sider .logo {
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
}

.layout-container .layout-sider .logo img {
  height: 32px;
  margin-right: 8px;
}

.layout-container .layout-sider .logo h1 {
  color: white;
  margin: 0;
  font-size: 18px;
}

.layout-container .layout-header {
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-container .layout-header .trigger {
  padding: 0 24px;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.layout-container .layout-header .trigger:hover {
  color: #1890ff;
}

.layout-container .layout-header .header-right {
  padding-right: 24px;
}

.layout-container .layout-content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
} */
</style>
