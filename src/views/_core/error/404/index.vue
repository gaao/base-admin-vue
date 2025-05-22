<template>
  <div class="flex-v-center" style="height: 100vh">
    <img src="@/assets/svg/error-404.svg" alt="" style="width: 40%" />
    <div class="flex-h-center" style="gap: 20px;">
      <a-button @click="router.push('/')">
        <!-- {{ $t('app.backHome') }} -->
        返回首页
      </a-button>
      <a-button @click="router.back()">返回上一页</a-button>
      <div class="text-gray-500">{{ countdown }}秒后自动返回上一页</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(10);
let timer: number;

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.back();
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
