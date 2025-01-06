import {
    AddFriendshipParam,
    GetMyFriendshipRequestParam,
    FriendshipRequestVO,
    HandleFriendshipParam,
    GetMyFriendListParam,
} from '@/types/friendship'
import { BaseUser } from '@/types/user'
import { apiService } from '@/utils/api'

export function addFriend(param: AddFriendshipParam): Promise<void> {
    return apiService.post('/friendship/save', param)
}

export function getMyFriendshipRequest(
    param: GetMyFriendshipRequestParam
): Promise<PageResult<FriendshipRequestVO>> {
    return apiService.get('/friendship/myFriendshipRequest', param)
}

export function handleFriendship(param: HandleFriendshipParam): Promise<void> {
    return apiService.post('/friendship/handle', param)
}

export function getFriendList(param: GetMyFriendListParam): Promise<PageResult<BaseUser>> {
    return apiService.get('/friendship/getMyFriendList', param)
}
