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
import logoGroupImg from '@/assets/vue.svg'
import logoImg from '@/assets/vue.svg'
// import { routes } from '@/router/routes'
// console.log('自定义routes',routes)
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
// 从路由中获取所有路由记录
let allRouters = router.getRoutes()
/**
 * 构建路由树结构
 * @param routes 扁平化的路由记录数组
 * @returns 包含层级关系的路由记录数组
 */
function buildRouteTree(routes: RouteRecordNormalized[]): RouteRecordNormalized[] {
  const routeMap = new Map<string, RouteRecordNormalized>();
  const childNames = new Set<string>();

  // 遍历所有路由，构建路由名称到路由对象的映射，并收集所有子路由的名称
  routes.forEach(route => {
    // 确保路由对象和名称存在
    if (route && route.name) {
      // 存储一个副本，避免修改 router.getRoutes() 返回的原始对象
      routeMap.set(route.name as string, { ...route });
      if (route.children && Array.isArray(route.children)) {
        route.children.forEach(child => {
          // 确保子路由定义和名称存在
          if (child && child.name) {
            childNames.add(child.name as string);
          }
        });
      }
    }
  });

  // 识别潜在的顶级路由：那些名称不在任何路由的 children 列表中的路由，并且排除名为 'Root' 的路由本身
  let potentialRootRoutes = routes.filter(route =>
      route.name && route.name !== 'Root' && !childNames.has(route.name as string)
  );

  // 特殊处理 'Root' 路由：如果它存在且有子路由，则将其子路由视为顶级路由
  const rootRoute = routeMap.get('Root');
  if (rootRoute && rootRoute.children && Array.isArray(rootRoute.children) && rootRoute.children.length > 0) {
      // 从 routeMap 中查找 'Root' 的子路由对应的完整路由对象，并添加到潜在顶级路由列表中
      const rootChildrenAsRoots = rootRoute.children
          .map(childDef => routeMap.get(childDef.name as string))
          .filter((route): route is RouteRecordNormalized => route !== undefined); // 过滤掉未找到的路由并断言类型
      potentialRootRoutes = [...potentialRootRoutes, ...rootChildrenAsRoots];
  }

  /**
   * 递归函数，用于构建给定路由的子树结构
   * @param route 需要构建子树的路由对象
   * @returns 构建好子树的路由对象
   */
  function buildChildren(route: RouteRecordNormalized): RouteRecordNormalized {
    // 如果路由有子路由定义且是数组
    if (route.children && Array.isArray(route.children) && route.children.length > 0) {
      // 遍历子路由定义，从 routeMap 中查找完整的子路由对象，并递归构建其子树
      route.children = route.children
        .map(childDef => {
          // 确保子路由定义和名称存在
          if (childDef && childDef.name) {
             // 从 map 中查找完整的子路由对象
            const childRoute = routeMap.get(childDef.name as string);
            if (childRoute) {
              // 递归构建其子树
              return buildChildren(childRoute);
            }
          }
          return null; // 如果子路由定义无效或未找到对应的路由对象，则返回 null
        })
        .filter((child): child is RouteRecordNormalized => child !== null); // 过滤掉 null 值并断言类型
    } else {
      // 如果没有有效的子路由，确保 children 属性是一个空数组
      route.children = [];
    }
    return route;
  }

  // 从识别出的顶级路由开始，构建完整的路由树结构
  const finalRouteTree = potentialRootRoutes
      .map(rootRoute => routeMap.get(rootRoute.name as string)) // 从 map 中获取完整的顶级路由对象
      .filter((route): route is RouteRecordNormalized => route !== undefined) // 过滤掉未找到的路由
      .map(rootRoute => buildChildren(rootRoute)); // 对每个顶级路由递归构建子树

  return finalRouteTree;
}

const routeTree = buildRouteTree(allRouters);

/**
 * 递归生成 Ant Design Vue 菜单项
 * @param routes 路由记录数组（通常是路由树的某个层级）
 * @returns Ant Design Vue 菜单项数组
 */
const generateMenuItems = (routes: RouteRecordNormalized[]): ItemType[] => {
  // 过滤出需要在菜单中显示的路由，并按 order 属性排序
  const filteredAndSortedRoutes = routes
    .filter((item) => item.meta?.show) // 使用可选链检查 meta.show 是否为 true
    .sort((a, b) => {
      // 使用可选链和空值合并运算符安全地获取 order 属性，默认为 Infinity
      const orderA = (a.meta?.order as number) ?? Infinity;
      const orderB = (b.meta?.order as number) ?? Infinity;
      return orderA - orderB;
    });

  return filteredAndSortedRoutes.map((item) => {
    // 只有有 name 的路由才生成菜单项
    if (item.name) {
      const menuItem: ItemType = {
        disabled: item.meta?.disabled, // 使用可选链
        label: item.meta?.title || item.name, // 使用可选链
        key: item.name as string, // 确保 key 是字符串类型
        // 检查 icon 是否存在且是有效的 VNode 或 RendererElement 类型，然后创建渲染函数
        icon: item.meta?.icon && (item.meta.icon as VNode<RendererNode> | RendererElement).type ?
              () => h(item.meta.icon as VNode<RendererNode> | RendererElement) : undefined,
      };

      // 如果路由有子路由且是数组
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        // 递归生成子菜单项
        const childrenMenuItems = generateMenuItems(item.children);
         // 只有当子菜单项不为空时才添加 children 属性
        if (childrenMenuItems.length > 0) {
           menuItem.children = childrenMenuItems;
        }
      }
      return menuItem;
    }
    return undefined; // 对于没有 name 的路由返回 undefined
  }).filter(item => item !== undefined) as ItemType[]; // 过滤掉 undefined 项并断言类型
};

// 使用递归函数从构建好的路由树生成菜单项
menuItems.value = generateMenuItems(routeTree);

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
