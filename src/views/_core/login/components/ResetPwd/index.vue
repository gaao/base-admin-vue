<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits(["update:modelValue"]);
function toLogin() {
  emit("update:modelValue", "login");
}
// const { t } = useI18n()

const rules = computed(() => {
  return {
    account: {
      required: true,
      trigger: "blur",
      // message: t('login.resetPasswordRuleTip'),
    },
  };
});
const formValue = ref({
  account: "",
});
const formRef = ref();
function handleRegister() {
  formRef.value?.validate();
}
</script>

<template>
  <div>
    <h2 depth="3" class="text-center">
      <!-- {{ $t('login.resetPasswordTitle') }} -->
      重置密码
    </h2>
    <a-form
      ref="formRef"
      :rules="rules"
      :model="formValue"
      :show-label="false"
      size="large"
    >
      <!-- :placeholder="$t('login.resetPasswordPlaceholder')" -->
      <a-form-item path="account">
        <a-input
          v-model:value="formValue.account"
          clearable
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item>
        <a-button block type="primary" @click="handleRegister">
          <!-- {{ $t('login.resetPassword') }} -->
          重置密码
        </a-button>
        <div class="to-other-form">
          <div >
            <!-- <a-text>{{ $t('login.haveAccountText') }}</a-text> -->
            <!-- 已有账号？ -->
            <a-button block @click="toLogin">
              <!-- {{ $t('login.signIn') }} -->
              返回登录
            </a-button>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
