
<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface FormState {
  username: string
  password: string
  remember: boolean
}

const loading = ref(false)

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: false
})

const handleFinish = async (values: FormState) => {
  try {
    loading.value = true
    // TODO: 在此处添加登录逻辑
    console.log('登录表单数据:', values)
    message.success('登录成功')
  } catch (error) {
    message.error('登录失败')
  } finally {
    loading.value = false
  }
}

const handleFinishFailed = (errorInfo: any) => {
  console.log('表单验证失败:', errorInfo)
}
</script>

<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <h2 class="login-title">系统登录</h2>
      <a-form
        :model="formState"
        name="login"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input
            v-model:value="formState.username"
            placeholder="用户名"
            size="large"
          >
            <!-- <template #prefix>
              <UserOutlined />
            </template> -->
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="密码"
            size="large"
          >
            <!-- <template #prefix>
              <LockOutlined />
            </template> -->
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style  scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 28px;
}
</style>
