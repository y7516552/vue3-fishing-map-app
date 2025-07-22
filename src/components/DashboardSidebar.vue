<script setup>
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import TeamSwitcher from '@/components/TeamSwitcher.vue';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import {
  FishSymbol,
  PanelsTopLeft,
  Gauge,
  Waves,
  ShoppingCart,
  MessageCircleWarning,
  Users,
} from 'lucide-vue-next';
import { useUserStore }from'../stores/user'
import { storeToRefs } from 'pinia'
import {   watch } from 'vue';



const store = useUserStore()
const { check ,logout} = store
const { isLogin, userData } = storeToRefs(store)
check()

watch(isLogin,()=>{
  if(!isLogin.value) console.log('未登入...')
})

const emit = defineEmits(['openLoginDialog'])
const openLoginDialog = () => {
  emit('openLoginDialog',true);
}



const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: 'icon' },
  class: { type: null, required: false },
});

// This is sample data.
const data = {
  teams: [
    {
      name: '台灣釣魚地圖-後台',
      logo: FishSymbol,
      plan: 'Taiwan fishing map-dashboard',
    },
    
  ],
  navMain: [
    {
      title: '前台首頁',
      url: '/',
      route:'home',
      icon: PanelsTopLeft,
    },
    {
      title: '後台首頁',
      url: '/admin/dashboard',
      route:'dashboard',
      icon: Gauge,
    },
    {
      title: '釣點管理',
      url: '/admin/dashboard/fishingSpot',
      route:'dashboard-fishingSpot',
      icon: Waves,
    },
    {
      title: '釣具店管理',
      url: '/admin/dashboard/fishingTackleShop',
      route:'dashboard-fishingTackleShop',
      icon: ShoppingCart,
    },
    {
      title: '魚種管理',
      url: '/admin/dashboard/species',
      route:'dashboard-species',
      icon: FishSymbol,
    },
    {
      title: '回報管理',
      url: '/admin/dashboard/report',
      route:'dashboard-report',
      icon: MessageCircleWarning,
    },
    {
      title: '使用者管理',
      url: '/admin/dashboard/user',
      route:'dashboard-user',
      icon: Users,
    },
  ],
};
</script>

<template>
  <Sidebar class="z-1000"  v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <SidebarFooter>
      <NavUser v-if="isLogin" :user="userData"  @logout="logout"/>
      <button v-if="!isLogin" type="button" @click="openLoginDialog">登入</button>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

