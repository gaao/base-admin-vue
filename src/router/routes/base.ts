import type { RouteRecordRaw } from "vue-router";
// import { $t } from '#/locales';
// import {BasicLayout} from "@/layouts";
import BasicLayout from "@/layouts/BasicLayout.vue";
const AuthPageLayout = () => import("@/layouts/UserLayout.vue");

// 设置默认首页路径
const DEFAULT_HOME_PATH = "/dashboard";
// 设置默认登录页路径
const LOGIN_PATH = "/auth/login";
/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    name: "Root",
    path: "/",
    meta: {
      show: true,
    },
    redirect: DEFAULT_HOME_PATH,
    children: [
      {
        name: "Home",
        path: "dashboard",
        component: () => import("@/views/_core/dashboard/index.vue"),
        meta: {
          // title: $t('page.home'),
          title: "首页",
          show: true,
          icon: "HomeOutlined",
          order: 1, // 排序 从小到大
          keepAlive: false,
        },
      },
      // {
      //   name: "href",
      //   path: "href",
      //   component: () => import("@/views/_core/my/index.vue"),
      //   meta: {
      //     // title: $t('page.home'),
      //     title: "外链",
      //     show: true,
      //     icon: "HomeOutlined",
      //     order: 50,
      //     href: "//baidu.com",
      //     keepAlive: false,
      //   },
      // },
      // {
      //   name: "My",
      //   path: "my",
      //   meta: {
      //     // title: $t('page.home'),
      //     title: "我的",
      //     show: true,
      //   },
      //   children: [
      //     {
      //       name: "Center",
      //       path: "center",
      //       component: () => import("@/views/_core/my/index.vue"),
      //       meta: {
      //         // title: $t('page.home'),
      //         title: "个人中心",
      //         show: true,
      //         icon: "HomeOutlined",
      //         order: 99,
      //         keepAlive: false,
      //       },
      //     },
      //   ],
      // },
    ],
  },
  {
    component: AuthPageLayout,
    name: "Authentication",
    path: "/auth",
    redirect: LOGIN_PATH,
    meta: {
      show: true,
    },
    children: [
      {
        name: "Login",
        path: "login",
        component: () => import("@/views/_core/login/index.vue"),
        meta: {
          // title: $t('page.auth.login'),
          title: "登录",
          show: true,
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

/** 全局错误相关页面 */
const errPageRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/_core/error/403/index.vue"),
    meta: {
      title: "403用户无权限",
      show: true,// *正式项目需要注释掉
    },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/_core/error/500/index.vue"),
    meta: {
      title: "500服务器错误",
      show: true,// *正式项目需要注释掉
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/_core/error/404/index.vue"),
    name: "404",
    meta: {
      title: "404找不到页面",
      show: true,// *正式项目需要注释掉
    },
  },
];

export { coreRoutes, errPageRoutes };
