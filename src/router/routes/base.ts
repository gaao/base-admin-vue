import type { RouteRecordRaw } from "vue-router";

import { DEFAULT_HOME_PATH, LOGIN_PATH } from "@/config";

// import { $t } from '#/locales';
// import {BasicLayout} from "@/layouts";
import BasicLayout from "@/layouts/BasicLayout.vue";
// const BasicLayout = () => import("@/layouts/basic.vue");
// const AuthPageLayout = () => import("@/layouts/auth.vue");
const AuthPageLayout = () => import("@/layouts/UserLayout.vue");
/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import("@/views/_core/fallback/not-found.vue"),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: "404",
  },
  name: "FallbackNotFound",
  path: "/:path(.*)*",
};

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  // {
  //   component: BasicLayout,
  //   meta: {
  //     hideInBreadcrumb: true,
  //     title: "Root",
  //   },
  //   name: "Root",
  //   path: "/",
  //   redirect: DEFAULT_HOME_PATH,
  //   children: [],
  // },
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: "Root",
    },
    name: "Root",
    path: "/",
    redirect: DEFAULT_HOME_PATH,
    children: [
      {
        name: "Home",
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          // title: $t('page.home'),
          title: "首页",
        },
      }
    ],
  },
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: "Authentication",
    },
    name: "Authentication",
    path: "/auth",
    redirect: LOGIN_PATH,
    children: [
      {
        name: "Login",
        path: "login",
        component: () => import("@/views/_core/login/index.vue"),
        meta: {
          // title: $t('page.auth.login'),
          title: "登录",
        },
      },
      // {
      //   name: "CodeLogin",
      //   path: "code-login",
      //   component: () => import("@/views/_core/authentication/code-login.vue"),
      //   meta: {
      //     // title: $t('page.auth.codeLogin'),
      //     title: "扫码登录",
      //   },
      // },
      // {
      //   name: "QrCodeLogin",
      //   path: "qrcode-login",
      //   component: () =>
      //     import("@/views/_core/authentication/qrcode-login.vue"),
      //   meta: {
      //     // title: $t('page.auth.qrcodeLogin'),
      //     title: "二维码登录",
      //   },
      // },
      // {
      //   name: "ForgetPassword",
      //   path: "forget-password",
      //   component: () =>
      //     import("@/views/_core/authentication/forget-password.vue"),
      //   meta: {
      //     // title: $t('page.auth.forgetPassword'),
      //     title: "忘记密码",
      //   },
      // },
      // {
      //   name: "Register",
      //   path: "register",
      //   component: () => import("@/views/_core/authentication/register.vue"),
      //   meta: {
      //     // title: $t('page.auth.register'),
      //     title: "注册",
      //   },
      // },
    ],
  },
];

export { coreRoutes, fallbackNotFoundRoute };
