import { defineStore } from 'pinia'
import { UserInfo } from '@/types/user'

const USER_KEY = 'user'
export const useUserStore = defineStore(USER_KEY, {
    state: () => {
        return {
            user: JSON.parse(localStorage.getItem(USER_KEY) || 'null') as UserInfo | null,
        }
    },

    getters: {
        isAdmin: (state): boolean => {
            console.log('isAdmin ' + JSON.stringify(state.user))
            return Boolean(state.user?.roleKeys.includes('admin'))
        },

        getUsername: (state): string | null => {
            return state.user?.username || null
        },
    },

    actions: {
        setUser(user: UserInfo) {
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
