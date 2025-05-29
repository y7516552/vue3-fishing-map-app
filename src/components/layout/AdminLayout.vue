<script setup>
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import LoginDialog from '../LoginDialog.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbList = ref([])
const getBreadcrumbList = () => {
  breadcrumbList.value = route.matched
}
getBreadcrumbList()

const openLoginDialog= ref(false)
const openDailog = () => {
  openLoginDialog.value = true
}
const closeDialog = () => {
  openLoginDialog.value = false
}
</script>

<template>
  <main>
    <SidebarProvider>
    <DashboardSidebar @openLoginDialog="openDailog" />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(item , i) in breadcrumbList" :key="item">
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink :href="item.path">
                  <BreadcrumbPage v-if="route.path == item.path" >{{ item.meta.title }}</BreadcrumbPage>
                  <template v-else>
                    {{ item.meta.title }}
                  </template>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="i !== breadcrumbList.length-1 && route.name!=='home'" class="hidden md:block" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      
      <RouterView v-slot="{ Component }">
        <Transition>
          <component :is="Component" />
        </Transition>
      </RouterView>
      
      <LoginDialog :openLoginDialog="openLoginDialog" @closeLoginDialog="closeDialog"/>
      
    </SidebarInset>
  </SidebarProvider>
  </main>
</template>

<style>
SidebarProvider{
  z-index: 1000;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
