<template>
  <a-layout-footer style="text-align: center; min-height: 30px">
    <div>
      <a-typography-text type="secondary">东海证券 © 2025</a-typography-text>
      <a-typography-text type="secondary" style="margin-left: 20px">Powered by 金融科技部</a-typography-text>
      <a-typography-text type="secondary" style="margin-left: 20px">版本号：{{ config.version }}</a-typography-text>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import config from '../../../package.json'
</script>

<style scoped></style>
