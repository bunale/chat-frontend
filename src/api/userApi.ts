import { UserInfo } from '@/types/user'
import { apiService } from '@/util/api'

export function login(username: string, password: string): Promise<UserInfo> {
    return apiService.post('/api/user/login', {
        username,
        password,
    })
}
