export interface BaseUser {
    userId: string
    name: string
    email: string
    avatar: string
    roles: string[]
    status: number
    createTime: Date
}

export interface UserPageVO extends BaseUser {
    friendFlag: boolean
}

export interface LoginedUser extends BaseUser {
    token: string
    expiredTime: Date
}

export interface GetUserPageParam extends PageParam {
    username: string
}
