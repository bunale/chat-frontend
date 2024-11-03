import type { User } from '../src/types/user'

const users: User[] = [
    { username: 'admin', password: '123456' },
    { username: 'user', password: '123456' },
]
export default [
    {
        url: '/api/user/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body as User
            const user = users.find((user) => user.username === username && user.password === password)
            if (user) {
                return {
                    code: 200,
                    message: '登录成功',
                }
            } else {
                return {
                    code: 403,
                    message: '用户名或密码错误',
                }
            }
        },
    },
]
