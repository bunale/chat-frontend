import { defineStore } from 'pinia'
import { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: null as UserInfo | null,
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
        },
        clearUser() {
            this.user = null
        },
    },
})
