import { createRouter, createWebHistory } from "vue-router";
import type {
  Router,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";
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
router.beforeEach( ( to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext  ) => {
  // 判断是否是外链，如果是直接打开网页并拦截跳转
  if (to.meta?.href) {
    window.open(to.meta.href);
    return next(false);
  }

  const authStore = useAuthStore();
  const token: string | null = authStore.token;
  console.log("routerneitoken", token);

  // 如果访问的是登录页
  if (to.path === "/auth/login") {
    // 未登录时允许访问登录页
    return next();
  }

  // 访问其他页面时
  if (!token) {
    // 未登录重定向到登录页
    return next({ path: "/auth/login", replace: true });
  }

  // 已登录允许访问
  return next();
});

export { resetRoutes, router };
