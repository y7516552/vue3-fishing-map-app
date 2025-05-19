<script setup>
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster />
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
