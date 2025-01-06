export interface AddFriendshipParam {
    receiver: string
    remark: string
}

export interface GetMyFriendListParam extends PageParam {
    username: string
}

export interface GetMyFriendshipRequestParam extends PageParam {
    status: number
}

export interface FriendshipRequestVO {
    id: number
    initiator: string
    initiatorUsername: string
    initiatorAvatar: string
    receiver: string
    /**
     * 关系状态 0: 待确认, 1: 已接受, 2: 已拒绝
     */
    status: number
    remark: string | null
    createdTime: Date
}

interface HandleFriendshipParam {
    friendshipId: number
    status: number
}
