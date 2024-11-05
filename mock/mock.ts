import type { User, UserInfo } from '../src/types/user'

const users: UserInfo[] = [
    { username: 'admin', password: '123', roleKeys: ['admin'] },
    { username: 'user', password: '123', roleKeys: ['user'] },
]
export default [
    {
        url: '/api/user/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body as User
            const user = users.find(
                (user) => user.username === username && user.password === password
            )
            if (user) {
                return {
                    code: 200,
                    message: '登录成功',
                    data: user,
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
