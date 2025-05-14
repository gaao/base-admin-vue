import { defineStore } from 'pinia'
import { ref, computed, unref } from 'vue'
import { router } from '@/router'
// import { fetchLogin } from '@/service'
import { resetRoutes } from '../router'
// import { useTabStore } from './tab'

export const useAuthStore = defineStore('auth-store', () => {
  // state
  const userInfo = ref<Api.Login.Info | null>(null)
  const token = ref<string>('')
  
  // getters
  const isLogin = computed(() => Boolean(token.value))
  
  // actions
  const clearAuthStorage = () => {
    userInfo.value = null
    token.value = ''
  }
  /* 记住账号 */
  const loginAccount = ref<string>()
  const setLoginAccount = (account: string) => {
    loginAccount.value = account
  }
  // 移除账号
  const removeLoginAccount = () => {
    loginAccount.value = ''
  }
  const logout = async () => {
    const route = unref(router.currentRoute)
    // 清除状态
    clearAuthStorage()
    // 清空路由、菜单等数据
    // const resetRoutes = useRouteStore()
    // routeStore.resetRouteStore()
    resetRoutes()
    // // 清空标签栏数据
    // const tabStore = useTabStore()
    // tabStore.clearAllTabs()
    // 重定向到登录页
    if (route.meta.requiresAuth) {
      router.push({
        name: 'login',
        query: {
          redirect: route.fullPath,
        },
      })
    }
  }

  const handleLoginInfo = async (data: Api.Login.Info) => {
    // 保存token和userInfo
    token.value = data.accessToken
    userInfo.value = data

    // // 添加路由和菜单
    // const routeStore = useRouteStore()
    // await routeStore.initAuthRoute()

    // 进行重定向跳转
    const route = unref(router.currentRoute)
    const query = route.query as { redirect: string }
    router.push({
      path: query.redirect || '/',
    })
  }

  const login = async (userName: string, password: string) => {
    try {
      // const { isSuccess, data } = await fetchLogin({ userName, password })
      // if (!isSuccess)
      //   return

      // 处理登录信息
      await handleLoginInfo(data)
    }
    catch (e) {
      console.warn('[Login Error]:', e)
    }
  }

  return {
    userInfo,
    token,
    isLogin,
    login,
    logout,
    clearAuthStorage,
    handleLoginInfo,
    loginAccount,
    setLoginAccount,
    removeLoginAccount,
  }
}, {
  persist: {
    key: 'auth-store',
    paths: ['userInfo', 'token']
  }
})
