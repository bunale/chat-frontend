// src/types/api.d.ts

import { ApiService } from './api'

declare module 'request' {
    export const apiService: ApiService
}
