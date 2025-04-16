<script>
export const iframeHeight = '100vw'
export const description
  = 'A simple sidebar with navigation grouped by section.'
</script>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
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


</script>

<template>
  <main>
    <SidebarProvider>
    <AppSidebar />
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

      <RouterView />
      
    </SidebarInset>
  </SidebarProvider>
  </main>
</template>
