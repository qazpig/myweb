import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
// import BlogAdminView from '../views/BlogAdminView.vue'
import BoardGamesView from '@/views/BoardGamesView.vue'
import TagAndFrontMatterManager from '@/views/TagAndFrontMatterManager.vue'
import NewArticleView from '@/views/NewArticleView.vue'

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
    path: '/new-article',
    name: 'NewArticle',
    component: NewArticleView
  },
  {
    path: '/movies',
    name: 'movies',
    component: BlogView
        // component: () => import('../views/MoviesView.vue')
  },
  {
    path: '/anime',
    name: 'anime',
    component: BlogView
    // component: () => import('../views/AnimeView.vue')
  },
  {
    path: '/boardgames',
    name: 'boardgames',
    // component: BlogView
    component: BoardGamesView
  },
  {
    path: '/escapegames',
    name: 'escapegames',
    component: BlogView
    // component: () => import('../views/EscapeGamesView.vue')
  },
  {
    path: '/manage',
    name: 'manage',
    component: TagAndFrontMatterManager
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
