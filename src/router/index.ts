import { createRouter, createWebHistory } from "vue-router";
import type { Router, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { routes } from "./routes";
import { useAuthStore } from "@/stores";


const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

// 定义一个resetRouter 方法，在退出登录后或token过期后 需要重新登录时，调用即可
const resetRoutes = (): void => {
  // 在Vue Router 4中，我们需要先移除所有路由
  const routes = router.getRoutes();
  routes.forEach((route) => {
    const { name } = route;
    if (name) {
      router.removeRoute(name);
    }
  });
  // 然后重新添加初始路由
  routes.forEach((route) => {
    router.addRoute(route);
  });
};

// 添加全局前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  const token: string | null = authStore.token; // 从用户状态管理中获取token
  console.log("routerneitoken", token);
  if (to.path === '/' || to.path === '/dashboard') {
    if (token) {
      next()
    } else {
      next('/auth/login');
    }
    return;
  }
  
  next();
});

export { resetRoutes, router };
