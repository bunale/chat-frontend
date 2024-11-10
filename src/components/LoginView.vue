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
            <van-button round block type="primary" native-type="submit"> 提交 </van-button>
        </div>
    </van-form>
</template>

<style lang="scss" scoped></style>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { apiService } from '@/util/request'

    interface Parent {
        name: string
        hello(): void
    }

    class Child implements Parent {
        name: string
        constructor(name: string) {
            this.name = name
        }
        hello(): void {
            console.log('hello' + this.name)
        }
    }

    const child = new Child('liujie')
    child.hello()

    const username = ref('')
    const password = ref('')
    const onSubmit = () => {
        console.log('submit', username.value, password.value)

        apiService
            .post('/api/user/login', {
                username: username.value,
                password: password.value,
            })
            .then((res: string) => {
                console.log(res)
            })
    }
</script>
