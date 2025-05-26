import { ref, h, type RendererElement, type RendererNode, type VNode } from "vue";
import type { MenuProps, ItemType } from "ant-design-vue";
import { useRoute, useRouter, type RouteRecordNormalized, type RouteRecordRaw } from "vue-router";
import { router } from "@/router";
import { routes }from "@/router/routes";

// 菜单缓存
interface MenuCache {
  items: ItemType[];
  timestamp: number;
  routeHash: string; // 用于检测路由变化
}

let menuCache: MenuCache | null = null;
const CACHE_EXPIRY = 2 * 60 * 1000; // 缓存有效期：2分钟

/**
 * 生成路由的哈希值，用于检测路由变化
 */
function generateRouteHash(routes: RouteRecordNormalized[]): string {
  return routes
    .map(route => `${route.name}:${route.path}:${route.meta?.order || 0}`)
    .sort()
    .join('|');
}

/**
 * 构建路由树结构
 * @param routes 扁平化的路由记录数组
 * @returns 包含层级关系的路由记录数组
 */
function buildRouteTree(
  routes: RouteRecordNormalized[]
): RouteRecordNormalized[] {
  const routeMap = new Map<string, RouteRecordNormalized>();
  const childNames = new Set<string>();

  // 遍历所有路由，构建路由名称到路由对象的映射，并收集所有子路由的名称
  routes.forEach((route) => {
    // 确保路由对象和名称存在
    if (route && route.name) {
      // 存储一个副本，避免修改 router.getRoutes() 返回的原始对象
      routeMap.set(route.name as string, { ...route });
      if (route.children && Array.isArray(route.children)) {
        route.children.forEach((child) => {
          // 确保子路由定义和名称存在
          if (child && child.name) {
            childNames.add(child.name as string);
          }
        });
      }
    }
  });
console.log("childNames", childNames);
  // 遍历所有路由，构建路由树结构
  // 遍历所有路由，构建路由树结构
  // 遍历所有路由，构建路由树结构
  // 识别潜在的顶级路由：那些名称不在任何路由的 children 列表中的路由，并且排除名为 'Root' 的路由本身
  let potentialRootRoutes = routes.filter(
    (route) =>
      route.name &&
      route.name !== "Root" &&
      !childNames.has(route.name as string)
  );
console.log("Potential root routes:", potentialRootRoutes);
  // 处理 'Root' 路由的特殊情况：如果 'Root' 路由存在且有子路由，则将其子路由视为顶级路由
  // 特殊处理 'Root' 路由：如果它存在且有子路由，则将其子路由视为顶级路由
  const rootRoute = routeMap.get("Root");
let finalRouteTree: RouteRecordNormalized[] = [];
  if (
    rootRoute &&
    rootRoute.children &&
    Array.isArray(rootRoute.children) &&
    rootRoute.children.length > 0
  ) {
    console.log("Root route has children:", rootRoute.children);
    const rootChildrenAsRoots = rootRoute.children;
    // 使用 Set 去重，根据路由名称
    const uniqueRoutes = new Set([...potentialRootRoutes, ...rootChildrenAsRoots]
      .map(route => route.name));
    
    finalRouteTree = [...potentialRootRoutes, ...rootChildrenAsRoots]
      .filter(route => {
        if (uniqueRoutes.has(route.name)) {
          uniqueRoutes.delete(route.name);
          return true;
        }
        return false;
      });
  }

  // 确保返回值为数组类型
  return finalRouteTree;
}

/**
 * 递归函数，用于构建给定路由的子树结构
 * @param route 需要构建子树的路由对象
 * @returns 构建好子树的路由对象
 */
function buildChildren(
  route: RouteRecordNormalized,
  routeMap: Map<string, RouteRecordNormalized>
): RouteRecordNormalized {
  // 如果路由有子路由定义且是数组
  if (
    route.children &&
    Array.isArray(route.children) &&
    route.children.length > 0
  ) {
    // 遍历子路由定义，从 routeMap 中查找完整的子路由对象，并递归构建其子树
    route.children = route.children
      .map((childDef) => {
        // 确保子路由定义和名称存在
        if (childDef && childDef.name) {
          // 从 map 中查找完整的子路由对象
          const childRoute = routeMap.get(childDef.name as string);
          if (childRoute) {
            // 递归构建其子树
            return buildChildren(childRoute, routeMap);
          }
        }
        return null; // 如果子路由定义无效或未找到对应的路由对象，则返回 null
      })
      .filter((child): child is RouteRecordNormalized => child !== null); // 过滤掉 null 值并断言类型
  } else {
    // 如果没有有效的子路由，确保 children 属性是一个空数组
    route.children = [];
  }
  return route;
}

/**
 * 递归生成 Ant Design Vue 菜单项
 * @param routes 路由记录数组（通常是路由树的某个层级）
 * @returns Ant Design Vue 菜单项数组
 */
function generateMenuItems(routes: RouteRecordNormalized[]): ItemType[] {
  // 过滤出需要在菜单中显示的路由，并按 order 属性排序
  const filteredAndSortedRoutes = routes
    .filter((item) => item.meta?.show) // 使用可选链检查 meta.show 是否为 true
    .sort((a, b) => {
      // 使用可选链和空值合并运算符安全地获取 order 属性，默认为 Infinity
      const orderA = (a.meta?.order as number) ?? Infinity;
      const orderB = (b.meta?.order as number) ?? Infinity;
      return orderA - orderB;
    });

  return filteredAndSortedRoutes
    .map((item) => {
      // 只有有 name 的路由才生成菜单项
      if (item.name) {
        const menuItem: ItemType = {
          disabled: item.meta?.disabled, // 使用可选链
          label: item.meta?.title || item.name, // 使用可选链
          key: item.name as string, // 确保 key 是字符串类型
          // 检查 icon 是否存在且是有效的 VNode 或 RendererElement 类型，然后创建渲染函数
          icon:
            item.meta?.icon &&
            (item.meta.icon as VNode<RendererNode> | RendererElement).type
              ? () =>
                  h(item.meta.icon as VNode<RendererNode> | RendererElement)
              : undefined,
        };

        // 如果路由有子路由且是数组
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          // 递归生成子菜单项
          const childrenMenuItems = generateMenuItems(item.children);
          // 只有当子菜单项不为空时才添加 children 属性
          if (childrenMenuItems.length > 0) {
            menuItem.children = childrenMenuItems;
          }
        }

        return menuItem;
      }
      return null; // 如果路由没有 name，则返回 null
    })
    .filter((item): item is ItemType => item !== null); // 过滤掉 null 值并断言类型
}

/* 菜单生成主函数 */
export const routerToMenu = (allRouters: RouteRecordNormalized[], menus: API.Menu[] = [], forceRefresh = false): ItemType[] => {
  try {
    // 防止路由实例未初始化
    if (!router) {
      console.warn('路由实例未初始化');
      return [];
    }
    
    // 检查缓存是否有效
    const now = Date.now();
    const routeHash = generateRouteHash(allRouters);
    
    if (
      !forceRefresh &&
      menuCache &&
      menuCache.timestamp > 0 &&
      now - menuCache.timestamp < CACHE_EXPIRY &&
      menuCache.routeHash === routeHash
    ) {
      console.log("Using cached menu items");
      return menuCache.items;
    }
    
    // 获取所有路由配置
    const routes = router.getRoutes();
    // 直接使用传入的路由数据
    const normalizedRoutes = allRouters.filter(route => route !== undefined);
    console.log("Normalized routes:", normalizedRoutes);
    // 构建路由树
    const routeTree = buildRouteTree(normalizedRoutes);
    console.log("Route tree:", routeTree); 
    // 生成菜单项
    const items = generateMenuItems(routeTree);
    
    // 更新缓存
    menuCache = {
      items,
      timestamp: now,
      routeHash
    };
    
    return items;
  } catch (error) {
    console.error("Error generating menu:", error);
    return [];
  }
};

/**
 * 清除菜单缓存
 */
export const clearMenuCache = (): void => {
  menuCache = null;
};
