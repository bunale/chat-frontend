<template>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
                v-model="email"
                name="邮箱"
                label="邮箱"
                placeholder="请输入邮箱"
                :rules="[
                    { required: true, message: '请填写邮箱' },
                    {
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: '邮箱格式不正确',
                    },
                ]"
            />

            <van-field
                v-model="verificationCode"
                name="验证码"
                label="验证码"
                placeholder="请输入验证码"
                :rules="[{ required: true, message: '请填写验证码' }]"
            >
                <template #button>
                    <van-button
                        size="small"
                        type="primary"
                        :disabled="isCounting"
                        @click="sendCode"
                    >
                        {{ codeButtonText }}
                    </van-button>
                </template>
            </van-field>

            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="请输入密码"
                :rules="[
                    { required: true, message: '请填写密码' },
                    { pattern: /^.{4,}$/, message: '密码至少4位字符' },
                ]"
            />

            <van-field
                v-model="confirmPassword"
                type="password"
                name="确认密码"
                label="确认密码"
                placeholder="请再次输入密码"
                :rules="[
                    { required: true, message: '请确认密码' },
                    { validator: validateConfirmPassword, message: '两次输入密码不一致' },
                ]"
            />
        </van-cell-group>
        <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"> 注册 </van-button>
        </div>
    </van-form>
</template>

<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import { showToast } from 'vant'
    import { useRouter } from 'vue-router'
    import { register } from '@/api/userApi'

    const router = useRouter()
    const email = ref('')
    const verificationCode = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const validateConfirmPassword = (val: string) => {
        return val === password.value
    }
    const countdown = ref(0)
    const isCounting = computed(() => countdown.value > 0)
    const codeButtonText = computed(() =>
        isCounting.value ? `${countdown.value}秒后重发` : '发送'
    )

    const sendCode = () => {
        if (!email.value) {
            showToast('请先输入邮箱')
            return
        }

        // 这里调用发送验证码的API
        countdown.value = 60
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    }

    const onSubmit = () => {
        if (password.value !== confirmPassword.value) {
            showToast('两次输入密码不一致')
            return
        }

        // 这里调用注册API
        register(email.value, password.value, verificationCode.value)
            .then(() => {
                showToast('注册成功')
                router.push('/login')
            })
            .catch((error) => {
                showToast('注册失败: ' + error.message)
            })
    }
</script>

<style lang="scss" scoped>
    .van-form {
        max-width: 300px;
        margin: 0 auto;
        padding: 18px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .van-cell-group {
        margin-bottom: 18px;
    }

    .van-field {
        text-align: left;
    }

    .van-field :deep(.van-field__label) {
        width: 60px;
        /* 设置 label 宽度 */
    }

    .van-field__button {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
    }

    .van-button {
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        border: none;
        font-weight: bold;
        letter-spacing: 1px;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
        }
    }

    body {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
</style>
