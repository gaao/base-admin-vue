<template>
  <!-- <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="标题"
    :breadcrumb="{ routes }"
    sub-title="二级标题"
  >
  </a-page-header> -->
  <!-- <a-breadcrumb :routes="route.matched"> -->
  <!-- <template #itemRender="{ route, params, routes, paths }"> -->
  <!-- {{ route.meta.breadcrumbName }} -->
  <!-- <home-outlined />
      <span v-if="routes.indexOf(route) === routes.length - 1">{{ route.breadcrumbName }}</span>
      <router-link v-else :to="paths.join('/')">{{ route.breadcrumbName }}</router-link> -->
  <!-- </template> -->
  <!-- </a-breadcrumb> -->
  <a-breadcrumb>
    <template v-for="(item, index) in route.matched" :key="item.fullPath">
      <a-breadcrumb-item>
        <span v-if="index === 0">{{ item.meta.breadcrumbName }}</span>
        <span v-else>
          <span v-if="route.matched.indexOf(item) === route.matched.length - 1">{{
            item.meta.breadcrumbName
          }}</span>
          <router-link v-else :to="item.path"> {{ item.meta.breadcrumbName }}</router-link>
        </span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
  <!-- <a-breadcrumb>
    <a-breadcrumb-item href="">
      <home-outlined />
    </a-breadcrumb-item>
    <a-breadcrumb-item href="">
      <user-outlined />
      <span>Application List</span>
    </a-breadcrumb-item>
    <a-breadcrumb-item>Application</a-breadcrumb-item>
  </a-breadcrumb> -->
</template>
<script lang="ts" setup>
import { onMounted, ref, unref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationMatched } from 'vue-router'
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue'

const route = useRoute()
// const router = useRouter()
interface Route {
  path: string
  breadcrumbName: string
  children?: Array<{
    path: string
    breadcrumbName: string
  }>
}
// const routes = [
//   {
//     path: 'index',
//     breadcrumbName: 'First-level Menu'
//   },
//   {
//     path: 'first',
//     breadcrumbName: 'Second-level Menu'
//   }
// ]
let breadcrumbList = ref<RouteLocationMatched[]>([])
watch(
  route.matched,
  (newValue, oldValue) => {
    // for (let i = 0; i < route.matched.length; i++) {
    //   const item = {
    //     path: route.matched[i].path,
    //     breadcrumbName: route.matched[i].meta.breadcrumbName as string
    //   }
    //   unref(breadcrumbList).push(item)
    // }
    breadcrumbList.value = newValue
  },
  { immediate: true }
)

// console.log('🚀 ~ route;router:', route, unref(breadcrumbList))
</script>
