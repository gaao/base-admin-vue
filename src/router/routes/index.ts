import type { RouteRecordRaw } from "vue-router";

import { coreRoutes, errPageRoutes } from "./base";

const externalRoutes: RouteRecordRaw[] = [
  {
    component: () => import("/src/views/_core/my/index.vue"),
    meta: {
      title: "外链1",
      show: true,
      icon: "HomeOutlined",
      order: 50,
      href: "//baidu.com",
    },
    name: "href",
    path: "href",
  },
];

coreRoutes[0].children!.push(...externalRoutes);

console.log("mainRoutes", coreRoutes);
/** 路由列表，由基本路由、外部路由和404兜底路由组成
 *  无需走权限验证（会一直显示在菜单中） */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...errPageRoutes
];

export { routes };
