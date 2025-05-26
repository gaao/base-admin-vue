import type { RouteRecordRaw } from 'vue-router'
import * as Icons from '@ant-design/icons-vue'

// 组件缓存
interface ComponentCache {
  [key: string]: any;
  timestamp: number;
}

const componentCache: Record<string, ComponentCache> = {};
const CACHE_EXPIRY = 10 * 60 * 1000; // 缓存有效期：10分钟

// 处理从后端传过来的路由数据
export const formatRoutes = async (routes: any[]): Promise<RouteRecordRaw[]> => {
  const formattedRoutes: RouteRecordRaw[] = []
  const modules = import.meta.glob('@/views/RBAC-pages/**.vue') // 动态导入 RBAC 页面组件
  
  // 并行处理所有路由
  const routePromises = routes.map(async (route) => {
    try {
      const componentPath = `/src/views/RBAC-pages${route.component}`;
      let component = null;
      
      // 检查组件缓存
      const now = Date.now();
      if (
        componentCache[componentPath] &&
        now - componentCache[componentPath].timestamp < CACHE_EXPIRY
      ) {
        component = componentCache[componentPath].component;
      } else {
        // 动态导入组件
        component = modules[componentPath] || null;
        
        // 更新缓存
        if (component) {
          componentCache[componentPath] = {
            component,
            timestamp: now
          };
        }
      }
      
      // 格式化路由
      const formattedRoute: RouteRecordRaw = {
        ...route,
        component,
        meta: {
          ...route.meta,
          icon: route.meta?.icon ? Icons[route.meta.icon as keyof typeof Icons] || null : null,
        },
      }
      
      return formattedRoute;
    } catch (error) {
      console.error(`Error formatting route ${route.path}:`, error);
      return null;
    }
  });
  
  // 等待所有路由处理完成
  const results = await Promise.all(routePromises);
  
  // 过滤掉处理失败的路由
  return results.filter((route): route is RouteRecordRaw => route !== null);
}

/**
 * 清除组件缓存
 */
export const clearComponentCache = (): void => {
  Object.keys(componentCache).forEach(key => {
    delete componentCache[key];
  });
};
