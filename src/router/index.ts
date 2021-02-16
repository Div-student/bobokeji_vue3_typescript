import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/lunbotu',
        name: 'lunbotu',
        component: () => import(/* webpackChunkName: "about" */ '../views/lunbotu.vue')
      },
      {
        path: '/picManager',
        name: 'picManager',
        component: () => import(/* webpackChunkName: "about" */ '../views/picManager.vue')
      },
      {
        path: '/productManagement',
        name: 'productManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/productManagement.vue')
      },
      {
        path: '/config',
        name: 'config',
        component: () => import(/* webpackChunkName: "about" */ '../views/config.vue')
      },
    ]
  },
  {
    path: '/orderCheck',
    name: 'orderCheck',
    component: () => import(/* webpackChunkName: "about" */ '../views/orderCheck.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
