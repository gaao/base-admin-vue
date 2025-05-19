<template>
  <a-layout>
    <!-- 顶部栏 -->
    <Header />
    <a-layout class="main">
      <!-- 侧边栏 -->
      <SiderMenu />
      <a-layout class="content">
        <!-- <Breadcrumb /> -->
        <!-- 页头 -->
        <!-- <PageHeader /> -->
        <!-- 路由视图，用于渲染 router-view -->
        <AppMain />
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref, watch, type CSSProperties } from 'vue'
import SiderMenu from './modules/SiderMenu.vue'
import Header from './modules/Header.vue'
import Footer from './modules/Footer.vue'
import AppMain from './modules/AppMain.vue'
import Breadcrumb from './modules/Breadcrumb.vue'
import PageHeader from './modules/PageHeader.vue'
</script>
<style scoped></style>
