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
      :items="items"
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
import { useRoute, useRouter } from 'vue-router'
import logoGroupImg from '@/assets/images/logo_group.png'
import logoImg from '@/assets/images/logo.png'

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

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}

const items = ref(
  [] as (
    | {
        label: {}
        key: string | symbol
        icon: (() => VNode<RendererNode, RendererElement, { [key: string]: any }>) | undefined
      }
    | undefined
  )[]
)

// watch(
//     () => state.value.openKeys,
//     (_val, oldVal) => {
//         state.value.preOpenKeys = oldVal;
//     },
// );
const clickmenu: MenuProps['onClick'] = (e) => {
  const { item, key, keyPath } = e
  //   console.log('点击', e, item, key, keyPath)
}
const selectmenu: MenuProps['onSelect'] = (e) => {
  const { item, key, selectedKeys } = e
  //   console.log('选中', e, item, key, selectedKeys)
  router.push({ name: key as string })
}
let sortRouters = router.getRoutes()
// 筛选 item.meta.siderShow 并排序
sortRouters = sortRouters
  .filter((item) => item.meta && item.meta.siderShow)
  .sort((a, b) => {
    const orderA = a.meta && (a.meta.order as number) ? (a.meta.order as number) : Infinity
    const orderB = b.meta && (b.meta.order as number) ? (b.meta.order as number) : Infinity
    return orderA - orderB
  })
items.value = sortRouters.map((item) => {
  // console.log('🚀 ~ items.value=sortRouters.map ~ item:', item.meta)
  if (item.meta.cnName && item.name) {
    return {
      label: item.meta.cnName,
      key: item.name,
      icon: item.meta.icon ? () => h(item.meta.icon as VNode<RendererNode>) : undefined,
    }
  }
})
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
