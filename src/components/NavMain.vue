<script setup>
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-vue-next';


defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>選單</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton v-if="!item.items" :tooltip="item.title" :href="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <a :href="item.url">
                <span>{{ item.title }}</span>
              </a>
            </SidebarMenuButton>
            
            <SidebarMenuButton v-else :tooltip="item.title" :href="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub v-if="item.items">
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <SidebarMenuSubButton as-child>
                  <a :href="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>

