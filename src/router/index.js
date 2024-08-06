import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import BlogAdminView from '../views/BlogAdminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: BlogView
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: BlogView
  },
  {
    path: '/admin',
    name: 'BlogAdmin',
    component: BlogAdminView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
