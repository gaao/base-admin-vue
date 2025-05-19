<template>
  <a-layout-content>
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <!-- 设置过渡动画 -->
        <div v-if="route.meta.keepAlive">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </div>
        <div v-else>
          <component :is="Component" :key="route.fullPath" />
        </div>
      </transition>
    </router-view>
  </a-layout-content>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// console.log('route', route)
// console.log('router', router)
</script>
