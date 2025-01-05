import { defineStore } from 'pinia'
import { LoginedUser } from '@/types/user'

const USER_KEY = 'user'
export const useUserStore = defineStore(USER_KEY, {
    state: () => {
        return {
            user: JSON.parse(localStorage.getItem(USER_KEY) as string) as LoginedUser | null,
        }
    },

    getters: {
        isAdmin: (state): boolean => {
            console.log('isAdmin ' + JSON.stringify(state.user))
            return Boolean(state.user?.roles.includes('admin'))
        },

        getUsername: (state): string | null => {
            return state.user?.name || null
        },

        getLoginedUser: (state): LoginedUser | null => {
            return state.user || null
        },
    },

    actions: {
        setUser(user: LoginedUser) {
            this.user = user
            localStorage.setItem(USER_KEY, JSON.stringify(user))
        },

        clearUser() {
            console.log('clear user', this.user)
            this.user = null
            localStorage.removeItem(USER_KEY)
            console.log('clear user', this.user)
        },
    },
})
