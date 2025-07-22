<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Mail } from 'lucide-vue-next';

</script>

<template>
  <div class="flex flex-col justify-center items-center w-full h-full gap-10">
    
    <div class="mb-6 flex flex-col justify-center items-center gap-4">
      <h1 class="text-2xl font-bold mb-6">關於本站</h1>
      <p>大家好，歡迎來到台灣釣魚地圖。</p>
      <p>歡迎各位釣友來這裡互相交流、分享釣點、分享經驗。</p>
      <p>希望大家能愛護環境，垃圾帶走、小魚放生。</p>
      <p>有任何疑問或想法歡迎提出，資料如有錯誤，歡迎大家回報勘誤。</p>
      <a class="bg-black text-white font-bold rounded-full px-2 py-1" href="#">問題回報</a>
    </div>

    <div class="mb-6 flex flex-col justify-center items-center gap-4">
      <p>參考資料:   <a  target="_blank" rel="noopener noreferrer" href="https://fishdb.sinica.edu.tw/">臺灣魚類資料庫</a></p>
    </div>

    <div class="mb-6 flex flex-col justify-center items-center gap-4">
      <Avatar class="w-[64px] h-[64px] mb-6">
        <AvatarImage class="w-[64px] h-[64px]" src="" alt="" />
        <AvatarFallback class="w-[64px] h-[64px]">阿德</AvatarFallback>
      </Avatar>
      <p>我是阿德，一位愛釣魚的前端工程師</p>
      <p></p>
      <p></p>
      <div class="flex gap-4">
        <Github />
        <Mail />
      </div>
    </div>
    <div class="mb-6">

    </div>
  </div>
</template>

<style>

</style>
