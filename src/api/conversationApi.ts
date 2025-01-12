import { Conversation, GetConversationParam } from '@/types/conversation'
import { apiService } from '@/utils/api'

export function start(userIds: string[]): Promise<Conversation> {
    return apiService.post('/conversation/start', { userids: userIds })
}

export function getById(conversationId: number): Promise<Conversation> {
    return apiService.get('/conversation/getById', { conversationId: conversationId })
}

export function getConversationPage(
    param: GetConversationParam
): Promise<PageResult<Conversation>> {
    return apiService.get('/conversation/page', param)
}
