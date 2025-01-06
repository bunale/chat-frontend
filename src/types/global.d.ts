// 注意这里的全局类型不要使用 export 导出
interface PageParam {
    pageNum: number
    pageSize: number
}

interface PageResult<T> {
    records: T[]
    pageNum: number
    pageSize: number
    totalPage: number
    totalRow: number
}

// 命名空间版本，在其他组件中使用类型时，需要使用 GlobalTypes.PageParam 的方式来使用
// declare namespace GlobalTypes {
//     interface PageParam {
//         pageNum: number
//         pageSize: number
//     }

//     interface PageResult<T> {
//         records: T[]
//         pageNum: number
//         pageSize: number
//         totalPage: number
//         totalRow: number
//     }
// }
