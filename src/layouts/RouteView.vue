<template>
  <router-view v-slot="{ Component }">
    <component
      :is="shouldKeepAlive ? 'keep-alive' : 'div'"
      v-bind="shouldKeepAlive ? {} : { style: { height: '100%' } }"
    >
      <component :is="Component" />
    </component>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// import { useStore } from 'vuex'

// 定义组件属性
// eslint-disable-next-line no-undef
const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: true
  }
})

// 获取路由和store
const route = useRoute()
const store = useStore()

// 计算是否应该缓存组件
const shouldKeepAlive = computed(() => {
  const { meta } = route
  const { multiTab } = store.getters

  // 当开启了 multiTab 时应当全部组件皆缓存
  // 或者路由元数据中指定了 keepAlive
  return multiTab || meta?.keepAlive
})
</script>
