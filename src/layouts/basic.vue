<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="layout-sider"
    >
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
        <h1 v-show="!collapsed">Admin System</h1>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item key="1">
          <template #icon>
            <user-outlined />
          </template>
          <span>用户管理</span>
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon>
            <video-camera-outlined />
          </template>
          <span>系统设置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

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

<style scoped lang="less">
.layout-container {
  min-height: 100vh;

  .layout-sider {
    .logo {
      height: 32px;
      margin: 16px;
      display: flex;
      align-items: center;
      
      img {
        height: 32px;
        margin-right: 8px;
      }

      h1 {
        color: white;
        margin: 0;
        font-size: 18px;
      }
    }
  }

  .layout-header {
    background: #fff;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .trigger {
      padding: 0 24px;
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .header-right {
      padding-right: 24px;
    }
  }

  .layout-content {
    margin: 24px 16px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
  }
}
</style>
