<template>
  <a-layout-header :style="headerStyle">
    <div class="header">
      <div class="header-left">
        <div alt="logo" class="logo" />
        <h3 class="appname">{{ appname }}</h3>
      </div>
      <div class="header-right">
        <a-tooltip :title="isFullScreen ? '取消全屏' : '全屏'">
          <!-- style="color: #fff" -->
          <a-button
            type="text"
            :icon="isFullScreen ? h(FullscreenExitOutlined) : h(FullscreenOutlined)"
            @click="toggleFullScreen"
          />
        </a-tooltip>
        <span v-if="isLogin">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          欢迎：{{ username }}
          <a-tooltip placement="bottomRight">
            <template #title>登出</template>
            <!-- style="color: #fff" -->
            <a-button
              v-if="isLogin"
              type="text"
              shape="circle"
              :icon="h(LogoutOutlined)"
              @click="logout"
            />
          </a-tooltip>
        </span>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import fullScreen from '@/utils/fullscreen'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter()
const { toggleFullScreen, isFullScreen } = fullScreen()

const appname = import.meta.env.VITE_APP_NAME
const headerStyle: CSSProperties = {
  position: 'sticky',
  top: '0',
  zIndex: 10,
  color: '#333',
  backgroundColor: '#ffffff',
}
const userStore = useUserStore()

const logout = () => {
  userStore.logOut() // 登出
}
const isLogin = computed(() => userStore.isLogined)
const username = computed(() => {
  return userStore.oaUserInfo && userStore.oaUserInfo.EmpAcct
    ? userStore.oaUserInfo.EmpAcct
    : userStore.username
})
</script>

<style scoped>

.appname {
  font-weight: bolder;
  text-wrap: nowrap;
}

h3 {
  margin-bottom: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  width: 43px;
  height: 43px;
  background: url('@/assets/images/logo.png') no-repeat center center / contain;
}
.header-right {
  display: flex;
  align-items: center;
}

</style>
