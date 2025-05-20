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
            :icon="
              isFullScreen ? h(FullscreenExitOutlined) : h(FullscreenOutlined)
            "
            @click="toggleFullScreen"
          />
        </a-tooltip>

        <span v-if="isLogin">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎：</span>
          <a-avatar
            :src="avatarUrl"
          ></a-avatar>
          <span>&nbsp;{{ username }}&nbsp;&nbsp;</span>
          <a-dropdown arrow>
            <DownOutlined />
            <template #overlay>
              <a-menu>
                <a-menu-item @click="goToProfile">
                  <user-outlined />
                  个人中心
                </a-menu-item>
                <a-menu-item @click="logout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { h, computed } from "vue";
import type { CSSProperties } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownOutlined,
  UpOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import fullScreen from "@/utils/fullscreen";
import { useAuthStore } from "@/stores";

const route = useRoute();
const router = useRouter();
const { toggleFullScreen, isFullScreen } = fullScreen();

const appname = import.meta.env.VITE_APP_NAME;
const headerStyle: CSSProperties = {
  position: "sticky",
  top: "0",
  zIndex: 10,
  color: "#333",
  backgroundColor: "#ffffff",
};
// 跳转到个人中心
const goToProfile = () => {
  router.push('/my');
};
// 退出登录
const userStore = useAuthStore();
const logout = () => {
  userStore.logout(); // 登出
};
const isLogin = computed(() => userStore.isLogin);
const username = computed(() => {
  return userStore.userInfo && userStore.userInfo.account
    ? userStore.userInfo.account
    : "用户名";
});
const avatarUrl = computed(() => {
  return userStore.userInfo && userStore.userInfo.avatar
   ? userStore.userInfo.avatar
    : "";
});
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
  height: 64px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  width: 43px;
  height: 43px;
  background: url("@/assets/vue.svg") no-repeat center center / contain;
}
.header-right {
  display: flex;
  align-items: center;
}
</style>
