export interface UserInfo {
    userId: string
    name: string
    email: string
    avatar: string
    status: number
    createUser_id: string | null
    createTime: string | null
    lastUpdateUserId: string | null
    lastUpdateTime: string | null
}

export interface CurrentUser extends UserInfo {
    token: string
    refreshToken: string
    roles: string[]
    username: string
}
