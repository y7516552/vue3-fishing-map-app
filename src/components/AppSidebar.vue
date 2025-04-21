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
  Settings2,
  SquareTerminal,
} from 'lucide-vue-next';

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
      title: '地圖',
      url: '/map',
      icon: Map,
    },
    {
      title: '相關資訊',
      url: '/info',
      icon: BookOpen,
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
          url: '#',
        },
        {
          title: '魚種',
          url: '#',
        },
      ],
    },
    {
      title: '關於網站',
      url: '/about',
      icon: BookOpen,
    },
    {
      title: '社群',
      url: '/community',
      icon: SquareTerminal,
    },
    {
      title: '設定',
      url: '#',
      icon: Settings2,
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
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

