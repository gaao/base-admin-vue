<template>
  <div>
    <a-page-header :title="title" :key="title" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.cnName)
// console.log('🚀 ~ title:', title)
</script>

<style scoped></style>
