import { fetchGetMyMenu } from "@/service";
import { formatRoutes } from "./formatedRoutes";
import type { Router, RouteRecordRaw } from "vue-router";

// 定义菜单项接口
interface MenuItem {
  id: number;
  parentId: number;
  name: string;
  key?: string;
  path: string;
  component: string;
  meta?: {
    title: string;
    icon?: string;
    [key: string]: any;
  };
  children?: MenuItem[];
  [key: string]: any;
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter: RouteRecordRaw = {
  path: "*",
  redirect: "/404",
  meta: { hidden: true },
};

// 根级菜单
const rootRouter: MenuItem = {
  key: "",
  name: "index",
  path: "",
  component: "BasicLayout",
  redirect: "/dashboard",
  meta: {
    title: "首页",
  },
  children: [],
};

// 路由缓存，避免重复生成
let cachedRoutes: RouteRecordRaw[] | null = null;
let lastCacheTime = 0;
const CACHE_EXPIRY = 5 * 60 * 1000; // 缓存有效期：5分钟

/**
 * 动态生成菜单
 * @param router Vue Router实例
 * @param forceRefresh 是否强制刷新缓存
 * @returns {Promise<RouteRecordRaw[]>} 路由配置数组
 */
export const generatorDynamicRouter = async (
  router: Router,
  forceRefresh = false
): Promise<RouteRecordRaw[]> => {
  // 检查缓存是否有效
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedRoutes &&
    lastCacheTime > 0 &&
    now - lastCacheTime < CACHE_EXPIRY
  ) {
    console.log("Using cached routes");
    return cachedRoutes;
  }

  try {
    const res = await fetchGetMyMenu(); // 获取菜单
    const childrenNav: MenuItem[] = [];

    if (res.code === 0) {
      listToTree(res.data, childrenNav, 0);
      console.log("Menu tree generated:", childrenNav);
    } else {
      console.error("Failed to fetch menu data:", res);
      return [];
    }

    const routerList = await formatRoutes(childrenNav);
    
    if (routerList && routerList.length > 0) {
      // 添加路由前先清除之前可能存在的动态路由
      try {
        routerList.forEach((route) => {
          router.addRoute('Root', route);
        });
        
        // 更新缓存
        cachedRoutes = routerList;
        lastCacheTime = now;
        
        console.log("Routes added successfully:", router.getRoutes());
      } catch (error) {
        console.error("Error adding routes:", error);
      }
    }
    
    return routerList || [];
  } catch (error) {
    console.error("Error generating dynamic router:", error);
    return [];
  }
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list: MenuItem[], tree: MenuItem[], parentId: number): void => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child: MenuItem = {
        ...item,
        key: item.key || item.name,
        children: [],
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children!, item.id);
      // 删掉不存在 children 值的属性
      if (child.children!.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
};

/**
 * 清除路由缓存
 */
export const clearRouteCache = (): void => {
  cachedRoutes = null;
  lastCacheTime = 0;
};