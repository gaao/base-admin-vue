<template>
  <a-layout-footer style="text-align: center; min-height: 30px">
    <div>
      <a-typography-text type="secondary" style="margin-left: 20px">Powered by </a-typography-text>
      <a-typography-text type="secondary">{{ appname }}</a-typography-text>
      <a-typography-text type="secondary" style="margin-left: 20px">版本号：{{ config.version }}</a-typography-text>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import config from '../../../package.json'
const appname = import.meta.env.VITE_APP_NAME

</script>

<style scoped></style>
