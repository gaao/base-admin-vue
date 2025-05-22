<script setup lang="ts">
// import type { FormInst } from 'naive-ui'
import { useAuthStore } from "@/stores";
// import { local } from '@/utils'
import { computed, onMounted, ref } from "vue";
import { useRouter, type RouteRecordRaw } from "vue-router";

const emit = defineEmits(["update:modelValue"]);

const authStore = useAuthStore();

function toOtherForm(type: any) {
  emit("update:modelValue", type);
}

// const { t } = useI18n()
// const rules = computed(() => {
//   return {
const rules = {
  account: [
    {
      required: true,
      trigger: "change", // message: t('login.accountRuleTip'),
      message: "请输入账号",
    },
  ],
  pwd: [
    {
      required: true,
      trigger: "change",
      message: "请输入密码",
      // message: t('login.passwordRuleTip'),
    },
  ],
};
// });
const formValue = ref({
  account: "admin",
  pwd: "123456",
});
const isRemember = ref(false);
const isLoading = ref(false);

const formRef = ref();
const router = useRouter();

const handleLogin = () => {
  formRef.value
    .validate()
    .then(async () => {
      isLoading.value = true;
      const { account, pwd } = formValue.value;

      if (isRemember.value) {
        authStore.setLoginAccount({ account, pwd });
      } else {
        authStore.removeLoginAccount();
      }

      await authStore.login(account, pwd);
      isLoading.value = false;
    })
    .catch((err: any) => {
      isLoading.value = false;
      console.log(err);
    });
};
onMounted(() => {
  checkUserAccount();
});
function checkUserAccount() {
  const loginAccount = authStore.loginAccount;
  if (!loginAccount) return;

  formValue.value = loginAccount;
  isRemember.value = true;
}
</script>

<template>
  <div>
    <h2 depth="3" class="text-center">
      <!-- {{ $t('login.signInTitle') }} -->
      登录
    </h2>
    <a-form
      ref="formRef"
      :rules="rules"
      :model="formValue"
      :show-label="false"
      size="large"
    >
      <a-form-item path="account" name="account">
        <!-- <a-input v-model:value="formValue.account" clearable :placeholder="$t('login.accountPlaceholder')" /> -->
        <a-input
          v-model:value="formValue.account"
          clearable
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item path="pwd" name="pwd">
        <!-- <a-input v-model:value="formValue.pwd" type="password" :placeholder="$t('login.passwordPlaceholder')" clearable show-password-on="click"> -->
        <a-input
          v-model:value="formValue.pwd"
          type="password"
          placeholder="请输入"
          clearable
          show-password-on="click"
        >
          <template #password-invisible-icon>
            <!-- <icon-park-outline-preview-close-one /> -->
          </template>
          <template #password-visible-icon>
            <!-- <icon-park-outline-preview-open /> -->
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <!-- <space vertical :size="20"> -->
        <div class="flex-h-center justify-between">
          <a-checkbox v-model:checked="isRemember">
            <!-- {{ $t('login.rememberMe') }} -->
            记住账号
          </a-checkbox>
          <a-button type="link" text @click="toOtherForm('resetPwd')">
            <!-- {{ $t('login.forgotPassword') }} -->
            忘记密码
          </a-button>
        </div>
        <a-button
          block
          type="primary"
          size="large"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleLogin"
        >
          <!-- {{ $t('login.signIn') }} -->
          登录
        </a-button>
        <div class="to-other-form">
          <!-- <text>{{ $t('login.noAccountText') }}</text> -->
          <a-divider>还没有账号？</a-divider>
          <a-button block text @click="toOtherForm('register')">
            <!-- {{ $t('login.signUp') }} -->
            去注册
          </a-button>
        </div>
        <!-- </space> -->
      </a-form-item>
    </a-form>
    <!-- <n-divider>
      <span op-80>{{ $t('login.or') }}</span>
    </a-divider>
    <a-space justify="center">
      <a-button circle>
        <template #icon>
          <a-icon><icon-park-outline-wechat /></a-icon>
        </template>
      </a-button>
      <a-button circle>
        <template #icon>
          <a-icon><icon-park-outline-tencent-qq /></a-icon>
        </template>
      </a-button>
      <a-button circle>
        <template #icon>
          <a-icon><icon-park-outline-github-one /></a-icon>
        </template>
      </a-button>
    </a-space> -->
  </div>
</template>
