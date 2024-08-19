import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import TagAndFrontMatterManager from '@/views/TagAndFrontMatterManager.vue'
import { articleCategories } from '@/data/articleCategories.js'
import NewArticle from '@/views/NewArticle.vue'
import CategoryView from '@/views/CategoryView.vue'
import TagManager from '@/views/TagManager.vue'
// import ArticleArea from '@/components/ArticleArea.vue'
// import BlogAdminView from '../views/BlogAdminView.vue'
// import BoardGamesView from '@/views/BoardGamesView.vue'

console.log(articleCategories);


const routes = [
  // {
  //   path: '/:category',
  //   name: 'Category',
  //   component:()=>import('@/views/BoardGamesView.vue'),
  //   props: true,
  //   children:[
  //     {
  //       path: ':id',
  //       name: 'Article',
  //       component: ()=> import('@/views/BoardGamesView.vue'),
  //       props: true 
  //     }
  //   ]
  // },
  ...articleCategories.map(category =>({
    path: `/${category.id}`,
    name: category.name,
    component: CategoryView,
    props: () => ({category: category.id}),
    children: [
      {
        path: ':id',
        name: `${category.id}Article`,
        component: CategoryView,
        props: route => ({category: category.id, articleID: route.params.id}),
      }
    ]
  })),
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
    path: '/newarticle',
    name: 'Newarticle',
    component: NewArticle
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
    path: '/escapegames',
    name: 'escapegames',
    component: BlogView
    // component: () => import('../views/EscapeGamesView.vue')
  },
  {
    path: '/manage',
    name: 'manage',
    component: TagAndFrontMatterManager
  },
  {
    path: '/tagmanager',
    name: 'tagmanager',
    component: TagManager
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
