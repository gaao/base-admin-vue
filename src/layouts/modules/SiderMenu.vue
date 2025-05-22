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
import { useRoute, useRouter } from 'vue-router'
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
/* 菜单 */
const menuItems = ref<ItemType[]>()
// 从路由中获取菜单
let allRouters = router.getRoutes()
// console.log('🚀 ~ file: SiderMenu.vue:99 ~ allRouters:', allRouters)
// 筛选 item.meta.show需要展示的路由并排序
allRouters = allRouters
  .filter((item) => item.meta && item.meta.show)
  .sort((a, b) => {
    const orderA = a.meta && (a.meta.order as number) ? (a.meta.order as number) : Infinity
    const orderB = b.meta && (b.meta.order as number) ? (b.meta.order as number) : Infinity
    return orderA - orderB
  })

// 递归对应菜单项字段方法
const generateMenuItems = (routes: any[]): ItemType[] => {
  return routes.map((item) => {
    if (item.name) {
      const menuItem: ItemType = {
        disabled: item.meta?.disabled || false,
        label: item.meta?.title || item.name,
        key: item.name,
        icon: item.meta?.icon ? () => h(item.meta.icon as VNode<RendererNode>) : undefined,
      };
      if (item.children && item.children.length > 0) {
        menuItem.children = generateMenuItems(item.children);
      }
      return menuItem;
    }
    return undefined; // 或者根据需要处理没有name的路由
  }).filter(item => item !== undefined) as ItemType[]; // 过滤掉undefined项
};
// 使用递归函数生成菜单项
menuItems.value = generateMenuItems(allRouters);

// watch(
//     () => state.value.openKeys,
//     (_val, oldVal) => {
//         state.value.preOpenKeys = oldVal;
//     },
// );
const clickmenu: MenuProps['onClick'] = (e) => {
  const { item, key, keyPath } = e
    console.log('点击', e, item, key, keyPath)
}
const selectmenu: MenuProps['onSelect'] = (e) => {
  const { item, key, selectedKeys } = e
  //   console.log('选中', e, item, key, selectedKeys)
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
