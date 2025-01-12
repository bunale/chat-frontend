import { LoginedUser, GetUserPageParam, UserPageVO } from '@/types/user'
import { apiService } from '@/utils/api'

export function login(username: string, password: string): Promise<LoginedUser> {
    return apiService.post('/user/operation/login', {
        username,
        password,
    })
}

export function register(
    email: string,
    password: string,
    verificationCode: string
): Promise<LoginedUser> {
    return apiService.post('/user/operation/register', {
        email,
        password,
        verificationCode,
    })
}

export function getUserPage(params: GetUserPageParam): Promise<PageResult<UserPageVO>> {
    return apiService.get('/user/data/page', params)
}
