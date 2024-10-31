<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { apiService } from './util/api'

let login = () => {
    apiService.post('/api/user/login', {
            username: 'admin',
            password: '123456',
        })
        .then((res) => {
            alert(res.code)
        })
}
</script>

<template>
    <div>
        <div id="parent">
            <button id="child" @click="login">login</button>
        </div>
        <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
</template>

<style lang="scss" scoped>
#parent {
    #child {
        color: $color;
    }
}
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
