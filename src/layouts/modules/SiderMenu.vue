<template>
  <a-layout-sider class="sidermenu" v-model:collapsed="collapsed" collapsible>
    <!-- <div class="logo">
      <img :src="logoSrc" class="logoimg" alt="logo" />
    </div> -->
    <a-menu
      theme="dark"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      class="allmenus"
      :items="menuItems"
      @click="clickmenu"
      @select="selectmenu"
    />
    <!-- <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
            :collapsed="state.collapsed" :items="items" collapsible></a-menu> -->
  </a-layout-sider>
</template>
<script lang="ts" setup>
import {
  ref,
  unref,
  reactive,
  toRaw,
  computed,
  watch,
  onMounted,
  onUnmounted,
  VueElement,
  h,
  type RendererNode,
  type VNode,
  type RendererElement,
} from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import { useRoute, useRouter, type RouteRecordNormalized } from 'vue-router'
import { useAuthStore } from '@/stores'
import logoGroupImg from '@/assets/vue.svg'
import logoImg from '@/assets/vue.svg'


const route = useRoute()
const router = useRouter()
const collapsed = ref<boolean>(false)
// logo相关
const logoSrc = computed(() => (collapsed.value ? logoImg : logoGroupImg))

// 当前选中
const selectedKeys = computed({
  get: () => {
    return [router.currentRoute.value.name as string]
  },
  set: (val) => {
    // console.log(val)
  },
})
const authStores = useAuthStore()
/* 菜单 */
// const menuItems = ref<ItemType[]>()
const menuItems = computed(() => {
  return authStores.myMenu
})

// watch(
//     () => state.value.openKeys,
//     (_val, oldVal) => {
//         state.value.preOpenKeys = oldVal;
//     },
// );
const clickmenu: MenuProps['onClick'] = (e) => {
  const { item, key, keyPath } = e
    console.log('点击', e, item, key, keyPath) // 保留点击事件的日志，方便调试
}
const selectmenu: MenuProps['onSelect'] = (e) => {
  const { item, key, selectedKeys } = e
  //   console.log('选中', e, item, key, selectedKeys) // 移除选中事件的日志
  router.push({ name: key as string })
}

// 屏幕宽度
const screenWidth = ref(
  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
)
const updateScreenWidth = () => {
  screenWidth.value =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  // 在屏幕800px时，折叠菜单
  collapsed.value = screenWidth.value < 800
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})
</script>
<style scoped>
.sidermenu {
  /* overflow-y: auto; */
  position: sticky;
  height: calc(100vh - 64px);
  left: 0;
  top: 64px;
  bottom: 0;
  z-index: 1;
}
.logo {
  display: block;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 10px;
  /* background-color: inherit; */
  /* background-color: #014bb3; */
}

.logoimg {
  margin: auto;
  display: block;
  height: 44px;
}
.allmenus {
  height: calc(100vh - 110px);
  overflow-y: auto;
}
.allmenus::-webkit-scrollbar {
  display: none;
}
</style>
