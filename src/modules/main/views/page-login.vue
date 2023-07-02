<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput } from '@/components/index'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const form = ref({
  email: '',
  username: '',
  password: ''
})
const login = function(){
    localStorage.setItem('auth-token', 'asdfgasgheahs');
    router.push('/inventory-report');
}
</script>
<template>
    <div class="mx-auto max-w-xl w-full p-4 sm:px-5">
        <div class="text-center">
        <div class="mt-4">
            <h2 class="text-2xl font-semibold text-slate-600 dark:text-slate-100">
            Welcome To Pointhub
            </h2>
            <p class="text-slate-400 dark:text-slate-300">Please sign in to continue</p>
        </div>
        </div>
        <div class="card mt-5 rounded-lg p-5 lg:p-7">
        <form action="" method="post" class="space-y-5">
            <div class="space-y-2">
            <component
                :is="BaseInput"
                required
                border="full"
                v-model="form.username"
                label="Username"
                placeholder="John Doe"
            >
                <template #prefix>
                <i class="i-far-user mx-3 block"></i>
                </template>
            </component>
            <component
                :is="BaseInput"
                required
                border="full"
                v-model="form.password"
                label="Password"
                type="password"
                error="this is error message"
            >
                <template #suffix>
                <i class="i-far-eye mx-3 block"></i>
                </template>
            </component>
            </div>

            <button class="btn btn-primary btn-block">Submit</button>
            <button class="login-google" @click="login">
                Google
            </button>
        </form>
        <div class="text-xs+ mt-4 text-center">
            <p class="line-clamp-1">
            <span>Don't have an account? </span>
            <a
                class="text-blue-500 transition-colors dark:text-slate hover:text-blue-600 dark:hover:text-info"
                href="#"
            >
                Sign Up
            </a>
            </p>
        </div>
        </div>
    </div>
</template>