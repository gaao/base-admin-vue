import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

interface HistoryTab {
  name: string
  path: string
  title: string
  params?: Record<string, any>
  query?: Record<string, any>
}

export const useHistoryTabsStore = defineStore('historyTabs', () => {
  // 状态
  const tabs = ref<HistoryTab[]>([])
  const activeTab = ref('')

  // 方法
  const addTab = (route: RouteLocationNormalized) => {
    const tab: HistoryTab = {
      name: route.name as string,
      path: route.path,
      title: route.meta?.title as string || '未命名页面',
      params: route.params,
      query: route.query
    }

    const existTab = tabs.value.find(item => item.path === tab.path)
    if (!existTab) {
      tabs.value.push(tab)
    }
    activeTab.value = tab.path
  }

  const closeTab = (path: string) => {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      // 如果关闭的是当前激活的tab，则激活前一个tab
      if (path === activeTab.value && tabs.value.length) {
        activeTab.value = tabs.value[Math.max(0, index - 1)].path
      }
    }
  }

  const closeOtherTabs = (path: string) => {
    const currentTab = tabs.value.find(tab => tab.path === path)
    if (currentTab) {
      tabs.value = [currentTab]
      activeTab.value = path
    }
  }

  const closeAllTabs = () => {
    tabs.value = []
    activeTab.value = ''
  }

  const setActiveTab = (path: string) => {
    activeTab.value = path
  }

  return {
    // 状态
    tabs,
    activeTab,
    // 方法
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    setActiveTab
  }
}, {
  persist: true
})
