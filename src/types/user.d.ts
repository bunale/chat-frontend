import { PageParam } from './global'

export interface BaseUser {
    userId: string
    name: string
    email: string
    avatar: string
    roles: string[]
    status: number
    createTime: Date
}

export interface LoginedUser extends BaseUser {
    token: string
}

export interface GetUserPageParam extends PageParam {
    username: string
}
