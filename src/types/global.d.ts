export interface PageParam {
    pageNum: number
    pageSize: number
}

export interface PageResult<T> {
    records: T[]
    pageNum: number
    pageSize: number
    totalPage: number
    totalRow: number
}
