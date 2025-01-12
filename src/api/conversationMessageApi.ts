import {
    ConversationMessage,
    GetConversationMessageParam,
    SendMessageParam,
} from '@/types/conversationMessage'
import { apiService } from '@/utils/api'

export function sendMessage(param: SendMessageParam): Promise<void> {
    return apiService.post('/message/send', param)
}

export function getConversationMessagePage(
    param: GetConversationMessageParam
): Promise<PageResult<ConversationMessage>> {
    return apiService.get('/message/page', param)
}
