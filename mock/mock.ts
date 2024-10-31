
export default [
    {
        url: '/api/user/login',
        method: 'post',
        response: () => {
            return {
                code: 333,
                message: '登录成功',
            }
        },
    },
]
