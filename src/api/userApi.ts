import { CurrentUser } from '@/types/user'
import { apiService } from '@/utils/api'

export function login(username: string, password: string): Promise<CurrentUser> {
    return apiService.post('/user/operation/login', {
        username,
        password,
    })
}

export function register(
    email: string,
    password: string,
    verificationCode: string
): Promise<CurrentUser> {
    return apiService.post('/user/operation/register', {
        email,
        password,
        verificationCode,
    })
}
