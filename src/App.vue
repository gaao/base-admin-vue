<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useAuthStore } from "./stores";

// const tokenTheme = computed(() => {
//   const algorithm = isDark.value
//     ? [theme.darkAlgorithm]
//     : [theme.defaultAlgorithm];

//   // antd 紧凑模式算法
//   if (preferences.app.compact) {
//     algorithm.push(theme.compactAlgorithm);
//   }

//   return {
//     algorithm,
//     token: tokens,
//   };
// });
/* 水印 */
const authStore = useAuthStore();
const watermarkContent = computed(() => {
  return authStore.userInfo?.account;
});
</script>

<template>
  <a-config-provider>
    <!-- <a-config-provider :locale="antdLocale" :theme="tokenTheme"> -->
    <a-app>
      <a-watermark :content="watermarkContent">
        <div>
          <router-view />
        </div>
      </a-watermark>
    </a-app>
  </a-config-provider>
</template>
<!-- 
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->
