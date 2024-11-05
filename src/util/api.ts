// src/utils/api.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export class ApiService {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量中获取基础 URL
            timeout: 10000, // 设置请求超时时间
        })

        // 请求拦截器
        // this.axiosInstance.interceptors.request.use(
        //     (config: InternalAxiosRequestConfig) => {
        //         // 在请求发送之前做一些处理，比如添加 token
        //         const token = localStorage.getItem('token') // 假设 token 存储在 localStorage
        //         if (token) {
        //             config.headers['Authorization'] = `Bearer ${token}`
        //         }
        //         return config
        //     },
        //     (error) => {
        //         return Promise.reject(error)
        //     },
        // )

        // 响应拦截器
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 处理响应数据
                return response.data
            },
            (error) => {
                // 处理错误
                console.log('error ', error)
                const message = error.response?.data?.message || '网络错误'
                console.error('API Error:', message)
                return Promise.reject(message)
            }
        )
    }

    // GET 请求
    public get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
        return this.axiosInstance.get<T, T>(url, config)
    }

    // POST 请求
    public post<T, D = unknown>(
        url: string,
        data?: D,
        config?: InternalAxiosRequestConfig
    ): Promise<T> {
        return this.axiosInstance.post<T, T>(url, data, config)
    }

    // PUT 请求
    public put<T, D = unknown>(
        url: string,
        data?: D,
        config?: InternalAxiosRequestConfig
    ): Promise<T> {
        return this.axiosInstance.put<T, T>(url, data, config)
    }

    // DELETE 请求
    public delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
        return this.axiosInstance.delete<T, T>(url, config)
    }
}
