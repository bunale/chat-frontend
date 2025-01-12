export function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return '最近'
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `${diffInHours}小时前`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return `${diffInDays}天前`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
        return `${diffInWeeks}周前`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
        return `${diffInMonths}月前`
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears}年前`
}
