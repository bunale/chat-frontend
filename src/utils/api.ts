// src/utils/api.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()

// 不需要登录即可访问的 URL
const excludUrls = ['/user/operation/register', '/user/operation/login']

class ApiService {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量中获取基础 URL
            timeout: 10000, // 设置请求超时时间
        })

        // 请求拦截器
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log('request url: ', config.url)
                if (excludUrls.includes(config.url as string)) {
                    return config
                }

                // 在请求发送之前做一些处理，比如添加 token
                const userStore = useUserStore()
                const loginedUser = userStore.getLoginedUser
                if (!loginedUser) {
                    // 不存在登录的用户信息，则跳转到登录页面
                    router.push('/login')
                }

                const token = loginedUser.token
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`
                    config.headers['Cache-Control'] = 'no-cache'
                    config.headers['Pragma'] = 'no-cache'
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // 响应拦截器
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 处理响应数据
                if (response.data.code === '00000') {
                    return response.data.data
                } else {
                    return Promise.reject(response.data)
                }
            },
            (error) => {
                // 处理错误
                console.log('error ', error)
                const message = error.response?.data?.message || '网络错误'
                return Promise.reject(message)
            }
        )
    }

    // GET 请求
    public get<T>(url: string, params?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
        return this.axiosInstance.get<T, T>(url, { params, ...config })
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

export const apiService = new ApiService()
