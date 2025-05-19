<script setup lang="ts">
import { ref, type Ref } from "vue";
import { Login, Register, ResetPwd } from "./components";

type IformType = "login" | "register" | "resetPwd";
const formType: Ref<IformType> = ref("login");
const formComponets = {
  login: Login,
  register: Register,
  resetPwd: ResetPwd,
};

const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <div class="content">
    <div>
      <!-- <DarkModeSwitch /> -->
      <!-- <LangsSwitch /> -->
      <!-- <SvgIconsLogo /> -->
      <!-- <h3>{{ appName }}</h3> -->
    </div>
    <div class="main-block">
      <transition name="fade-slide" mode="out-in">
        <component :is="formComponets[formType]" v-model="formType" />
      </transition>
    </div>
  </div>
</template>
<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 64px - 70px);
  }
  .main-block{
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ebebeb;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0px 20px 20px 0px rgb(0 0 0 / 3%);
  }
  h3 {
    text-align: center;
  }
  /* :deep(.text-center){
    text-align: center;
  } */
</style>
