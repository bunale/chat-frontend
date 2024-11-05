export interface User {
    username: string
    password: string
}

export interface UserInfo extends User {
    roleKeys: string[]
}
