<template>
  <div class="my-page">
    <!-- 个人信息卡片 -->
    <a-card class="user-card">
      <div class="user-info">
        <a-avatar :size="64" :src="userInfo.avatar" />
        <div class="info-content">
          <h2>{{ userInfo.nickname || userInfo.username }}</h2>
          <p>{{ userInfo.role }}</p>
        </div>
      </div>
    </a-card>

    <!-- 统计数据 -->
    <a-row :gutter="16" class="stat-cards">
      <a-col :span="8" v-for="stat in statistics" :key="stat.title">
        <a-card :title="stat.title" :style="{ color: stat.color }">
          <div>{{ stat.value }}</div>
          <template #prefix>
            <component :is="stat.icon" />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <!-- 最近活动 -->
    <a-card title="最近活动" class="activity-card">
      <a-timeline>
        <a-timeline-item v-for="activity in activities" :key="activity.id">
          {{ activity.content }}
          <span class="activity-time">{{ activity.time }}</span>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  UserOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "MyPage",
  components: {
    UserOutlined,
    LineChartOutlined,
    ClockCircleOutlined,
  },
  setup() {
    const userInfo = ref({
      username: "管理员",
      nickname: "超级管理员",
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
      role: "系统管理员",
    });

    const statistics = ref([
      {
        title: "登录次数",
        value: 128,
        icon: "UserOutlined",
        color: "#1890ff",
      },
      {
        title: "在线时长",
        value: 256.5,
        icon: "ClockCircleOutlined",
        color: "#52c41a",
      },
      {
        title: "操作次数",
        value: 1024,
        icon: "LineChartOutlined",
        color: "#faad14",
      },
    ]);

    const activities = ref([
      {
        id: 1,
        content: "登录系统",
        time: "2024-03-20 10:00:00",
      },
      {
        id: 2,
        content: "更新个人信息",
        time: "2024-03-20 09:30:00",
      },
      {
        id: 3,
        content: "查看系统日志",
        time: "2024-03-20 09:00:00",
      },
    ]);

    return {
      userInfo,
      statistics,
      activities,
    };
  },
});
</script>

<style scoped>
.my-page {
  padding: 24px;
  background: #f0f2f5;

  .user-card {
    margin-bottom: 24px;

    .user-info {
      display: flex;
      align-items: center;

      .info-content {
        margin-left: 24px;

        h2 {
          margin-bottom: 8px;
          color: rgba(0, 0, 0, 0.85);
        }

        p {
          margin: 0;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  .stat-cards {
    margin-bottom: 24px;
  }

  .activity-card {
    .activity-time {
      float: right;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>
