<template>
  <div class="flex flex-col justify-center items-center w-full h-screen gap-10">
    <FishOff size="248"/>
    <p>404</p>
    <p>找不到網頁</p>

    <Button variant="outline" as-child >
      <a href="/">
        <House />
        回到首頁
      </a>
    </Button>
    
  </div>
</template>

<script setup>
import { FishOff, House } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'

</script>
