import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import MapView from '@/views/MapView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeLayout,
      meta:{
        title:"首頁",
      },
      children:[
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/map',
          name: 'map',
          component: MapView,
          meta:{
            title:"地圖",
          },
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
