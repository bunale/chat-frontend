<template>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
                v-model="username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"> 登录 </van-button>
        </div>
    </van-form>
</template>

<style lang="scss" scoped></style>
<script lang="ts" setup>
    import { ref } from 'vue'
    import * as userApi from '@/api/userApi'
    import { UserInfo } from '@/types/user'
    import { useUserStore } from '@/store/userStore'
    import { useRouter, useRoute } from 'vue-router'
    import { showToast } from 'vant'

    const username = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const router = useRouter()
    const route = useRoute()

    const onSubmit = () => {
        userApi
            .login(username.value, password.value)
            .then((res: UserInfo) => {
                userStore.setUser(res)

                // 获取重定向地址（如果有）
                const redirect = route.query.redirect as string
                // 登录成功后重定向到来源页面或首页
                router.push(redirect || '/')
                console.log(
                    `login success for ${userStore.getUsername}, redirect to ${redirect || '/'}`
                )
            })
            .catch((error) => {
                showToast({
                    message: error.message,
                    type: 'fail',
                    duration: 2000,
                })
            })
    }
</script>
