<template>
  <div class="history-container">
    <a-tabs
      v-model:activeKey="activeKey"
      type="editable-card"
      :hideAdd="true"
      @edit="onEdit"
      @tabClick="handleTabClick"
    >
      <a-tab-pane
        v-for="item in historyList"
        :key="item.path"
        :tab="item.meta.title || item.name"
        :closable="item.path !== '/dashboard'"
      >
        <template #tab>
          <a-space>
            <history-outlined />
            <router-link :to="item.path">{{
              item.meta.title || item.name
            }}</router-link>
          </a-space>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HistoryOutlined } from "@ant-design/icons-vue";
import type { RouteLocationNormalized } from "vue-router";
import { useHistoryTabsStore } from "@/stores/historytabs";

const route = useRoute();
const router = useRouter();

// 历史记录列表
const historyList = ref<RouteLocationNormalized[]>([]);
const MAX_HISTORY = 10; // 最大历史记录数
const activeKey = ref<string>(""); // 当前激活的标签页

// 添加历史记录
const historyTabsStore = useHistoryTabsStore();
const addHistory = (route: RouteLocationNormalized) => {
  // 排除登录页等特殊页面
  if (!route.name) return;

  // 移除重复的记录
  historyList.value = historyList.value.filter(
    (item) => item.path !== route.path
  );

  // 添加新记录到开头
  historyList.value.unshift({ ...route });

  // 限制最大记录数
  if (historyList.value.length > MAX_HISTORY) {
    historyList.value.pop();
  }
  console.log("ahhh", historyList.value);
  // 保存到 localStorage
  historyTabsStore.tabs = historyList.value;
  // localStorage.setItem('routeHistory', JSON.stringify(historyList.value))
};

// 移除历史记录
const removeHistory = (item: RouteLocationNormalized) => {
  // 先获取要跳转的目标页面
  const currentIndex = historyList.value.findIndex(
    (record) => record.path === item.path
  );
  const nextIndex =
    currentIndex < historyList.value.length - 1
      ? currentIndex + 1
      : currentIndex - 1;
  const nextRoute = nextIndex >= 0 ? historyList.value[nextIndex] : null;

  // 先移除标签页
  historyList.value = historyList.value.filter(
    (record) => record.path !== item.path
  );
  historyTabsStore.tabs = historyList.value;

  // 如果移除的是当前标签页，则跳转到下一个标签页
  if (item.path === route.path && nextRoute) {
    router.push(nextRoute.path);
  }
};

// 添加默认首页
const addDefaultHome = () => {
  const defaultHome = {
    path: "/dashboard",
    name: "Home",
    params: {},
    query: {},
    hash: "",
    fullPath: "/dashboard",
    meta: {
      hideInBreadcrumb: true,
      title: "首页",
    },
  };
  addHistory(defaultHome as unknown as RouteLocationNormalized);
};

// 标签页编辑（关闭）处理
const onEdit = (targetKey: string, action: "add" | "remove") => {
  if (action === "remove") {
    const item = historyList.value.find((record) => record.path === targetKey);
    if (item) {
      removeHistory(item);
    }
  }
};
// 添加标签页点击处理函数
const handleTabClick = (key: string) => {
  const targetRoute = historyList.value.find((item) => item.path === key);
  if (targetRoute) {
    router.push(targetRoute.path);
  }
};
// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    addHistory(route);
    activeKey.value = newPath;
  }
);

// 组件挂载时从 localStorage 恢复历史记录
onMounted(() => {
  // const savedHistory = localStorage.getItem('routeHistory')
  const savedHistory = historyTabsStore.tabs;
  if (savedHistory) {
    try {
      historyList.value = savedHistory;
      // 如果历史记录为空，添加默认首页
      if (historyList.value.length === 0) {
        addDefaultHome();
      }
      // 设置当前路由为激活标签
      // console.log("apppaht", savedHistory, route.path);
      addHistory(route);
      activeKey.value = route.path;
    } catch (e) {
      console.error("Failed to parse route history:", e);
      addDefaultHome();
      activeKey.value = "/";
    }
  } else {
    addDefaultHome();
    activeKey.value = "/";
  }
});
// 销毁时清空历史记录
onUnmounted(() => {
  historyTabsStore.tabs = [];
});
</script>

<style scoped>
.history-container {
  background: #fff;
  position: sticky;
  top: 64px;
  z-index: 10;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

:deep(.ant-tabs-tab) {
  padding: 4px 16px !important;
}

/* :deep(.ant-tabs-tab-remove) {
  margin-left: 4px;
} */
</style>
