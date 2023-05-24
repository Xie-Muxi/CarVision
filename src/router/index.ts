import { createRouter, createWebHistory } from 'vue-router'

import Index from '../views/Index.vue'
import Frame from '../views/frame.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/frame',
      name: 'three',
      component: Frame
    },
    // {
    //   path: '/Index',
    //   name: 'Index',
    //   component: Index
    // },
  ]
})

export default router
