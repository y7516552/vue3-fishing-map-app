<script setup >
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast
} from '@/components/ui/pagination'

defineProps(['itemsPerPage', 'total', 'defaultPage'])
defineEmits(['update:page'])


</script>

<template>
  <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="total" :default-page="defaultPage">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst @click="$emit('update:page', 1)" />
      <PaginationPrevious @click="$emit('update:page', page )" />
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
         @click="$emit('update:page', item.value)"
        >
          {{ item.value }}
        </PaginationItem>
      </template>
      <PaginationEllipsis v-if="Math.ceil(total / itemsPerPage) === 1 || defaultPage <= Math.ceil(total / itemsPerPage) - 3" :index="4" />
      <PaginationNext  @click="$emit('update:page', page )" />
      <PaginationLast @click="$emit('update:page', (Math.ceil(total / itemsPerPage)))" />
    </PaginationContent>
  </Pagination>
</template>