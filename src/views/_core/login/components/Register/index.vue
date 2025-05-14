<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
function toLogin() {
  emit("update:modelValue", "login");
}
// const { t } = useI18n()

const rules = {
  account: [
    {
      required: true,
      trigger: "blur",
      // message: t('login.accountRuleTip'),
    },
  ],
  pwd: [
    {
      required: true,
      trigger: "blur",
      // message: t('login.passwordRuleTip'),
    },
  ],
  rePwd: [
    {
      required: true,
      trigger: "blur",
      // message: t('login.checkPasswordRuleTip'),
    },
  ],
};
const formValue = ref({
  account: "",
  pwd: "",
  rePwd: "",
});

const isRead = ref(false);

function handleRegister() {}
</script>

<template>
  <div>
    <h2 depth="3" class="text-center">
      <!-- {{ $t("login.registerTitle") }} -->
      注册
    </h2>
    <a-form :rules="rules" :model="formValue" :show-label="false" size="large">
      <a-form-item path="account">
        <!-- :placeholder="$t('login.accountPlaceholder')" -->
        <a-input
          v-model:value="formValue.account"
          clearable
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item path="pwd">
        <!-- :placeholder="$t('login.passwordPlaceholder')" -->
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
      <a-form-item path="rePwd">
        <!-- :placeholder="$t('login.checkPasswordPlaceholder')" -->
        <a-input
          v-model:value="formValue.rePwd"
          type="password"
          placeholder="请再次输入"
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
        <!-- <a-space direction="vertical" > -->
        <a-checkbox v-model:checked="isRead">
          <!-- {{ $t("login.readAndAgree") }} -->
          同意
          <a-button type="link" style="padding-left: 0">
            <!-- {{ $t("login.userAgreement") }} -->
            用户协议
          </a-button>
        </a-checkbox>
        <a-button block type="primary" @click="handleRegister">
          <!-- {{ $t("login.signUp") }} -->
          注册
        </a-button>
        <div class="to-other-form">
          <!-- <a-text>{{ $t("login.haveAccountText") }}</a-text> -->
          <a-divider>已有账号？</a-divider>
          <a-button block @click="toLogin">
            <!-- {{ $t("login.signIn") }} -->
            去登录
          </a-button>
        </div>
        <!-- </a-space> -->
      </a-form-item>
    </a-form>
  </div>
</template>
