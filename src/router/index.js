import { createRouter, createWebHistory } from 'vue-router'
import ActivityShare from '../views/ActivityShare.vue'

const routes = [
    {
        path: '/ActivityShare',
        component: ActivityShare
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router