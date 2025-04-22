<template>
  <div class="dashboard-analytics">
    <!-- 默认页面内容 -->
    <div class="welcome-section">
      <h1>欢迎来到仪表盘</h1>
      <p>这是您的分析数据概览页面</p>
    </div>

    <!-- 数据卡片区域 -->
    <div class="data-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in dataCards" :key="index">
          <el-card shadow="hover">
            <div class="card-content">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 数据卡片信息
const dataCards = ref([
  { title: '总访问量', value: '8,846' },
  { title: '日活用户', value: '1,234' },
  { title: '订单总数', value: '3,456' },
  { title: '销售额', value: '￥23,456' }
])
</script>

<style lang="scss" scoped>
.dashboard-analytics {
  padding: 20px;

  .welcome-section {
    margin-bottom: 30px;
    text-align: center;

    h1 {
      font-size: 24px;
      color: #303133;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #606266;
    }
  }

  .data-cards {
    .el-card {
      margin-bottom: 20px;
    }

    .card-content {
      text-align: center;
      padding: 20px 0;

      .card-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .card-value {
        font-size: 24px;
        color: #303133;
        font-weight: bold;
      }
    }
  }
}
</style>
