import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'PACE Interactives',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/feedback-techniques',
    name: 'Feedback Techniques',
    component: () => import('../views/FeedbackTechniques.vue')
  },
  {
    path: '/smart-goals',
    name: 'SMART Goals',
    component: () => import('../views/SmartGoals.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})

export default router
