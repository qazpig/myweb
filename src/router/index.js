import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
// import BlogAdminView from '../views/BlogAdminView.vue'
import TagAndFrontMatterManager from '@/views/TagAndFrontMatterManager.vue'
import NewArticleView from '@/views/NewArticleView.vue'
import ArticleArea from '@/components/ArticleArea.vue'
import { articleCategories } from '@/data/articleCategories.js'
// import BoardGamesView from '@/views/BoardGamesView.vue'

console.log(articleCategories);


const routes = [
  {
    path: '/:category',
    name: 'Category',
    component:()=>import('@/views/BoardGamesView.vue'),
    props: true,
    children:[
      {
        path: ':id',
        name: 'Article',
        component: ()=> import('@/views/BoardGamesView.vue'),
        props: true 
      }
    ]
  },

  // ...articleCategories.map(category =>({
  //   path: '/'+ category.id,
  //   name: category.name,
  //   component: views[category.view] ||null,
  //   props: true,
  //   children: [
  //     {
  //       path: ':id',
  //       name: 'Article',
  //       props: true,
  //       component: views[category.view]||null
  //     }
  //   ]
  // })),
  // // {
  //   path: '/boardgame/:id',
  //       name: 'Article',
  //       props: true,
  //       component: BoardGamesView
  // },  
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
    path: '/test/:id',
    name: 'ArticleArea',
    component: ArticleArea
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
