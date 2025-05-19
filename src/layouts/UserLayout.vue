<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="user-layout-content">
        <!-- 顶部栏 -->
        <Header />
        <!-- 路由视图，用于渲染 router-view -->
        <router-view />
        <!-- 底部栏 -->
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Header from "./modules/Header.vue";
import Footer from "./modules/Footer.vue";
// import { useDeviceMixin } from '@/store/device-mixin'
// import SelectLang from '@/components/SelectLang'

// 使用设备混入
// const { isMobile } = useDeviceMixin()
const isMobile = false;

// 生命周期钩子
onMounted(() => {
  document.body.classList.add("userLayout");
});

onBeforeUnmount(() => {
  document.body.classList.remove("userLayout");
});
</script>

<style scoped>
#userLayout.user-layout-wrapper {
  /* height: 100%; */

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    background: #f0f2f5;
  }
}
</style>
