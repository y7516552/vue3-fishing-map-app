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
  GalleryVerticalEnd,
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
      logo: GalleryVerticalEnd,
      plan: 'Taiwan fishing map',
    },
    
  ],
  navMain: [
    {
      title: '社群',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: '地圖',
      url: '/map',
      icon: Map,
    },
    {
      title: '收費',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: '設定',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
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

