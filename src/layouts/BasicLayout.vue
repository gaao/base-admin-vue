<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >

    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template #menuHeaderRender>
      <div>
        <img src="@/assets/vue.svg" />
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template #headerContentRender>
      <div>
        <a-tooltip title="刷新页面">
          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="() => { $message.info('只是一个DEMO') }" />
        </a-tooltip>
      </div>
    </template>

    <!-- <setting-drawer v-if="isDev" :settings="settings" @change="handleSettingChange">
      <div style="margin: 12px 0;">
        This is SettingDrawer custom footer content.
      </div>
    </setting-drawer> -->
    <template #rightContentRender>
      <!-- <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" /> -->
    </template>
    <!-- custom footer / 自定义Footer -->
    <template #footerRender>
      <!-- <global-footer /> -->
    </template>
    <router-view />
  </pro-layout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
// import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
// import { i18nRender } from '@/locales'
// import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
// import RightContent from '@/components/GlobalHeader/RightContent'
// import GlobalFooter from '@/components/GlobalFooter'
// import Ads from '@/components/Other/CarbonAds'

// const store = useStore()
const router = useRouter()

// data
const isProPreviewSite = false
const isDev = false
// const isProPreviewSite = process.env.VITE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development'
// const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_APP_PREVIEW === 'true'

// base
const menus = ref([])
// 侧栏收起状态
const collapsed = ref(false)
const title = defaultSettings.title
const settings = reactive({
  // 布局类型
  layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
  // CONTENT_WIDTH_TYPE
  // contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
  // 主题 'dark' | 'light'
  theme: defaultSettings.navTheme,
  // 主色调
  primaryColor: defaultSettings.primaryColor,
  fixedHeader: defaultSettings.fixedHeader,
  fixSiderbar: defaultSettings.fixSiderbar,
  colorWeak: defaultSettings.colorWeak,

  hideHintAlert: false,
  hideCopyButton: false
})

// 媒体查询
const query = ref({})
// 是否手机模式
const isMobile = ref(false)

// computed
// const mainMenu = computed(() => store.state.permission.addRouters)
const mainMenu = []

// created
const routes = mainMenu.value.find(item => item.path === '/')
menus.value = (routes && routes.children) || []

// watch
// watch(() => collapsed.value, (val) => {
//   store.commit(SIDEBAR_TYPE, val)
// })

// watch(() => isMobile.value, (val) => {
//   store.commit(TOGGLE_MOBILE_TYPE, val)
// })

// mounted
onMounted(() => {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Edge') > -1) {
    collapsed.value = !collapsed.value
    setTimeout(() => {
      collapsed.value = !collapsed.value
    }, 16)
  }

  // first update color
  // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
  // if (process.env.NODE_ENV !== 'production' || process.env.VITE_APP_PREVIEW === 'true') {
  //   updateTheme(settings.primaryColor)
  // }
})

// methods
const handleMediaQuery = (val) => {
  query.value = val
  if (isMobile.value && !val['screen-xs']) {
    isMobile.value = false
    return
  }
  if (!isMobile.value && val['screen-xs']) {
    isMobile.value = true
    collapsed.value = false
    settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
    // settings.fixSiderbar = false
  }
}

const handleCollapse = (val) => {
  collapsed.value = val
}

const handleSettingChange = ({ type, value }) => {
  console.log('type', type, value)
  type && (settings[type] = value)
  switch (type) {
    case 'contentWidth':
      settings[type] = value
      break
    case 'layout':
      if (value === 'sidemenu') {
        settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
      } else {
        settings.fixSiderbar = false
        settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
      }
      break
  }
}
</script>

<!-- <style lang="less">
@import "./BasicLayout.less";
</style> -->
<style>

.ant-pro-global-header-index-right {
  margin-right: 8px;

  &.ant-pro-global-header-index-dark {
    .ant-pro-global-header-index-action {
      color: hsl(0deg 0% 100% / 85%);

      &:hover {
        background: #1890ff;
      }
    }
  }

  .ant-pro-account-avatar {
    .antd-pro-global-header-index-avatar {
      margin: ~'calc((@{layout-header-height} - 24px) / 2)' 0;
      margin-right: 8px;
      color: @primary-color;
      vertical-align: top;
      background: rgb(255 255 255 / 85%);
    }
  }

  .menu {
    .anticon {
      margin-right: 8px;
    }

    .ant-dropdown-menu-item {
      min-width: 100px;
    }
  }
}
</style>
