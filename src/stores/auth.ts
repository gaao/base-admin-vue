import { defineStore } from "pinia";
import { ref, computed, unref } from "vue";
import { router } from "@/router";
import { fetchLogin } from "@/service";
import { resetRoutes } from "../router";
import { useRouter, type RouteRecordRaw } from "vue-router";
// import { useTabStore } from './tab'

export const useAuthStore = defineStore(
  "auth-store",
  () => {
    // state
    const userInfo = ref<API.UserInfo | null>(null);
    const token = ref<string>("");
    const tokenExpiresTime = ref<number>(0);

    // getters
    const isLogin = computed(() => Boolean(token.value));

    // actions
    const clearAuthStorage = () => {
      userInfo.value = null;
      token.value = "";
    };
    /* 记住账号 */
    const loginAccount = ref<string>();
    const setLoginAccount = (account: any) => {
      loginAccount.value = account;
    };
    // 移除账号
    const removeLoginAccount = () => {
      loginAccount.value = "";
    };
    const logout = async () => {
      const route = unref(router.currentRoute);
      // 清除状态
      clearAuthStorage();
      // 清空路由、菜单等数据
      resetRoutes();
      // // 清空标签栏数据
      // const tabStore = useTabStore()
      // tabStore.clearAllTabs()
      // 重定向到登录页
      console.log("route", route);
      // if (route.meta.requiresAuth) {
        router.push({
          name: "Login",
          query: {
            redirect: route.fullPath,
          },
        });
      // }
    };

    const handleLoginInfo = async (data: API.LoginResponse) => {
      console.log("handleLoginInfodata", data);
      // 保存token和userInfo
      token.value = data.token;
      userInfo.value = data.userInfo;
      tokenExpiresTime.value = data.expireTime;
      // // 添加路由和菜单
      // const routeStore = useRouteStore()
      // await routeStore.initAuthRoute()
      // 进行重定向跳转
      // const route = unref(router.currentRoute)
      // const query = route.query as { redirect: string }
      // router.push({
      //   path: query.redirect || '/',
      // })
      // 重定向到首页
      // 获取当前路由信息
      // const route = unref(router.currentRoute);
      const router = useRouter();
      console.log("1router", router);
      // router.replace({ name: "Home" });

      // console.log("route", router);
      // // 获取重定向路径,默认为首页
      // router.replace("/dashboard");
      // const redirectPath = (route.query?.redirect as string) || '/'
      // try {
      //   // 使用replace模式进行跳转,避免浏览器历史堆栈
      //   await router.replace('/dashboard')
      // } catch (err) {
      //   console.error('路由跳转失败:', err)
      //   // 如果跳转失败,强制跳转到首页
      //   await router.replace('/')
      // }
    };

    const login = async (account: string, password: string) => {
      try {
        const { code, data } = await fetchLogin({ account, password });
        if (code !== 0) return;

        // 处理登录信息
        await handleLoginInfo(data);
      } catch (e) {
        console.warn("[Login Error]:", e);
      }
    };

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
    };
  },
  {
    persist: true,
    // persist: {
    //   key: 'auth-store',
    //   paths: ['userInfo', 'token']
    // }
  }
);
