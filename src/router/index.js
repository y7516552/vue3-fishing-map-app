import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeLayout from '@/components/layout/HomeLayout.vue'
import MapView from '@/views/MapView.vue'
import CommunityView from '@/views/CommunityView.vue'
import InfoView from '@/views/InfoView.vue'
import InfoPage from '@/pages/info/InfoPage.vue'
import FishingSpots from '@/pages/info/FishingSpotsPage.vue'
import FishingTackleShop from '@/pages/info/FishingTackleShopPage.vue'
import Species from '@/pages/info/SpeciesPage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DashboardPage from '@/pages/dashboard/dashboardPage.vue'
import NoAccessPage from '@/pages/NoAccessPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErrorPage },
    { path: '/NoAccess', name: 'NoAccess', component: NoAccessPage },
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
        },
        {
          path: '/community',
          name: 'community',
          component: CommunityView,
          meta:{
            title:"社群",
          },
        },
        {
          path: '/about',
          name: 'about',
          meta:{
            title:"關於網站",
          },
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/info',
          name: 'info',
          meta:{
            title:"相關資訊",
          },
          component: InfoView,
          children:[
            {
              path: '/info',
              name: 'info-page',
              meta:{
                title:"資訊一覽",
              },
              component: InfoPage,
            },
            {
              path: '/info/fishingSpot',
              name: 'fishingSpot',
              meta:{
                title:"釣點資訊",
              },
              component: FishingSpots,
            },
            {
              path: '/info/fishingTackleShop',
              name: 'fishingTackleShop',
              meta:{
                title:"釣具店",
              },
              component: FishingTackleShop,
            },
            {
              path: '/info/species',
              name: 'species',
              meta:{
                title:"魚種",
              },
              component: Species,
            }
          ]
        },
      ]
    },
    {
      path: '/admin/dashboard',
      component: AdminLayout,
      meta:{
        title:"管理",
      },
      children:[
        {
          path: '/admin/dashboard/:type',
          name: 'dashboard',
          meta:{
            title:"首頁",
          },
          component: DashboardPage,
        },
      ]
    }
  ],
})

export default router
