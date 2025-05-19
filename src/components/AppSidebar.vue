<script setup>
import NavMain from '@/components/NavMain.vue';
// import NavProjects from '@/components/NavProjects.vue';
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
  BookOpen,
  FishSymbol,
  Map,
  BadgeInfo,
  // Settings2,
  // SquareTerminal,
} from 'lucide-vue-next';
import { useUserStore }from'../stores/user'
import { storeToRefs } from 'pinia'
import {   watch } from 'vue';

const store = useUserStore()
const { check ,logout} = store
const { isLogin, userData } = storeToRefs(store)
check()

watch(isLogin,()=>{

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
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: '台灣釣魚地圖',
      logo: FishSymbol,
      plan: 'Taiwan fishing map',
    },
    
  ],
  navMain: [
    {
      title: '首頁',
      url: '/',
      icon: FishSymbol,
    },
    {
      title: '地圖',
      url: '/map',
      icon: Map,
    },
    {
      title: '相關資訊',
      url: '/info',
      icon: BadgeInfo,
      items: [
        {
          title: '資訊一覽',
          url: '/info',
        },
        {
          title: '釣點',
          url: '/info/fishingSpot',
        },
        {
          title: '釣具店',
          url: '/info/fishingTackleShop',
        },
        {
          title: '魚種',
          url: '/info/species',
        },
      ],
    },
    {
      title: '關於網站',
      url: '/about',
      icon: BookOpen,
    },
    // {
    //   title: '社群',
    //   url: '/community',
    //   icon: SquareTerminal,
    // },
    // {
      // title: '設定',
      // url: '#',
      // icon: Settings2,
      // items: [
      //   {
      //     title: 'General',
      //     url: '#',
      //   },
      //   {
      //     title: 'Team',
      //     url: '#',
      //   },
      //   {
      //     title: 'Billing',
      //     url: '#',
      //   },
      //   {
      //     title: 'Limits',
      //     url: '#',
      //   },
      // ],
    // },
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

