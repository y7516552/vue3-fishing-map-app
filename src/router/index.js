import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore }from'@/stores/user'
import { useFrontStore } from '@/stores/front'
import { storeToRefs } from 'pinia'


const ErrorPage = () => import('@/pages/ErrorPage.vue')
const NoAccessPage = () => import('@/pages/NoAccessPage.vue')
const HomeLayout = () => import('@/components/layout/HomeLayout.vue')
const HomeView = () => import('@/views/HomeView.vue')
const MapView = () => import('@/views/MapView.vue')
const CommunityView = () => import('@/views/CommunityView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const InfoView = () => import('@/views/InfoView.vue')
const InfoPage = () => import('@/pages/info/InfoPage.vue')
const FishingSpots = () => import('@/pages/info/FishingSpotsPage.vue')
const FishingTackleShop = () => import('@/pages/info/FishingTackleShopPage.vue')
const Species = () => import('@/pages/info/SpeciesPage.vue')
const AdminLayout = () => import('@/components/layout/AdminLayout.vue')
const DashboardPage = () => import('@/pages/dashboard/dashboardPage.vue')
const DashboardFishingSpot = () => import('@/pages/dashboard/fishingSpot/FishingSpotPage.vue')
const DashboardFishingTackleShop = () => import('@/pages/dashboard/fishingTackleShop/FishingTackleShopPage.vue')
const DashboardSpecies = () => import('@/pages/dashboard/species/SpeciesPage.vue')
const DashboardReport = () => import('@/pages/dashboard/report/ReportPage.vue')
const DashboardUser = () => import('@/pages/dashboard/user/UserPage.vue') 
  

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
          component: AboutView,
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
              component:InfoPage,
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
      ],
      async beforeEnter() {
        const userStore = useUserStore();
        await userStore.check();
        const frontStore = useFrontStore();
        await frontStore.getFishingSpotList();
        await frontStore.getFishingTackleShopList();
      },
    },
    {
      path: '/admin/dashboard',
      component: AdminLayout,
      meta:{
        title:"管理",
      },
      children:[
        {
          path: '/admin/dashboard/',
          name: 'dashboard',
          meta:{
            title:"首頁",
          },
          component: DashboardPage,
        },
        {
          path: '/admin/dashboard/fishingSpot',
          name: 'dashboard-fishingSpot',
          meta:{
            title:"釣點管理",
          },
          component: DashboardFishingSpot,
        },
        {
          path: '/admin/dashboard/fishingTackleShop',
          name: 'dashboard-fishingTackleShop',
          meta:{
            title:"釣具店管理",
          },
          component: DashboardFishingTackleShop,
        },
        {
          path: '/admin/dashboard/species',
          name: 'dashboard-species',
          meta:{
            title:"魚種管理",
          },
          component: DashboardSpecies,
        },
        {
          path: '/admin/dashboard/report',
          name: 'dashboard-report',
          meta:{
            title:"回報管理",
          },
          component: DashboardReport,
        },
        {
          path: '/admin/dashboard/user',
          name: 'dashboard-user',
          meta:{
            title:"使用者管理",
          },
          component: DashboardUser,
        },
      ],
      async beforeEnter() {
        const userStore = useUserStore();
        const { isLogin,userData } = storeToRefs(userStore)
        await userStore.check();
        await userStore.getUserdata()
        if (!isLogin.value || userData.value.role !== 'admin') {
          return { name: 'NoAccess' }
        }
      },
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
