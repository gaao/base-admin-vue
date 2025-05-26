import { defineStore } from "pinia";
import { ref, computed, unref } from "vue";
import { router } from "@/router";
import { fetchLogin } from "@/service";
import { resetRoutes } from "../router";
import { generatorDynamicRouter } from "@/router/generator-routers";
import { coreRoutes, errPageRoutes } from "@/router/routes/base";
import { routerToMenu } from "@/router/routerToMenu";
// import { useTabStore } from './tab'

export const useAuthStore = defineStore(
  "auth-store",
  () => {
    // state
    const userInfo = ref<API.UserInfo | null>(null);
    const token = ref<string>("");
    const tokenExpiresTime = ref<number>(0);
    const myMenu = ref<API.Menu[]>([]);
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
      clearAllStates();
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

    const clearAllStates = () => {
      // 清空本地存储
      localStorage.clear();
      // 清空会话存储
      sessionStorage.clear();
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

    // 修改login方法部分
    const login = async (account: string, password: string) => {
      try {
        const { code, data } = await fetchLogin({ account, password });
        if (code !== 0) return;
        
        // 先处理登录信息，确保token已设置
        await handleLoginInfo(data);
        
        // 生成动态路由
        const asyncRouterList = await generatorDynamicRouter(router, true); // 强制刷新路由缓存
        
        if (asyncRouterList && asyncRouterList.length > 0) {
          // 构建完整路由列表
          const currentRouterList = [...coreRoutes];
          
          // 确保children存在
          if (!currentRouterList[0].children) {
            currentRouterList[0].children = [];
          }
          
          // 添加动态路由
          currentRouterList[0].children.push(...asyncRouterList);
          
          
          // 构建完整路由配置
          const myRouter = [
            ...currentRouterList,
            ...errPageRoutes
          ];
          console.log("完整路由列表:", currentRouterList,myRouter);
          
          // 生成菜单并强制刷新缓存
          myMenu.value = routerToMenu(myRouter, [], true);
          console.log("完整菜单列表:", myMenu.value)
          // 导航到首页
          router.push({ name: "Root" });
        } else {
          console.warn("未能生成动态路由");
          // 导航到默认页面
          router.push({ name: "Root" });
        }
      } catch (e) {
        console.error("[Login Error]:", e);
        // 显示错误通知
        // 可以添加UI通知组件调用
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
      myMenu,
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
