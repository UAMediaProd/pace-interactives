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
    path: '/role-modelling',
    name: 'Role Modelling',
    component: () => import('../views/RoleModelling.vue')
  },
  {
    path: '/walds-planes',
    name: 'Making War Planes Safer',
    component: () => import('../views/WaldsPlanes.vue')
  },
  {
    path: '/system-model',
    name: 'System Model',
    component: () => import('../views/SystemModel.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/isr-coverage',
    name: 'ISR Coverage',
    component: () => import('../views/isrCoverage.vue')
  },
  {
    path: '/verification-steps',
    name: 'Verification Steps',
    component: () => import('../views/VerificationSteps.vue')
  },
  {
    path: '/clos',
    name: 'CLOs',
    component: () => import('../views/CLOs.vue')
  },
  {
    path: '/clos-inverse',
    name: 'CLOs Inverse',
    component: () => import('../views/CLOsInverse.vue')
  },
  {
    path: '/rubric-outcome-mapping',
    name: 'Rubric Outcome Mapping Demo',
    component: () => import('../views/RubricOutcomeMapping.vue')
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
