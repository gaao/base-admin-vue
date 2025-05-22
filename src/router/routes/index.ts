import type { RouteRecordRaw } from 'vue-router';

import { coreRoutes, errPageRoutes } from './base';

const externalRoutes: RouteRecordRaw[] = [];

/** 路由列表，由基本路由、外部路由和404兜底路由组成
 *  无需走权限验证（会一直显示在菜单中） */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...externalRoutes,
  ...errPageRoutes,
];

export { routes };
