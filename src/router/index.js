import { createRouter, createWebHistory } from 'vue-router'
import CalendarSchedule from '../views/CalendarSchedule.vue'


const routes = [
    // {
    //     path: '/ActivityShare',
    //     component: ActivityShare
    // },
    {
        path: '/',
        component: CalendarSchedule
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router