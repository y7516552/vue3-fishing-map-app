<script setup>
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {MapPinCheck, Handshake, Fish,} from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import HeroImg1 from '@/assets/hero-1.jpg'

const heroData = {
  title: "釣魚人的天堂",
  description: "在這裡，你可以找到最棒的釣魚地點、分享你的釣魚故事，還有機會認識更多志同道合的朋友！",
  imageUrl: HeroImg1
}

const cardData = [
  {
    id:1,
    icon: MapPinCheck,
    title:"紀錄你的釣魚日常",
    context:"一鍵標記釣點、上傳魚獲，留下每一次熱血的收穫"
  },
  {
    id:2,
    icon: Handshake,
    title:"釣點分享，交流互動",
    context:"不論是技巧、心得或是故事，這裡都是你的舞台，讓釣友在地圖上分享心得、評價，交流經驗"
  },
  {
    id:3,
    icon: Fish,
    title:"魚種圖鑑，完整收藏",
    context:"每一次釣獲都能標註魚種，建立屬於自己的釣魚成就牆"
  }
]

</script>

<template>
  <div class="">

    <div class="flex-col grid auto-rows-min gap-4 p-4 grid-cols-1 md:grid-cols-2 mb-8">
      <div class="flex flex-col gap-4 justify-center items-center">
        <h1 class="text-5xl font-extrabold">🎣台灣釣魚地圖</h1>
        <h2 class="text-3xl">「釣友都在這裡！📍 魚獲、釣點、心得一起分享！」</h2>
        <h3 class="text-2xl">不只是地圖，這裡是釣魚人的專屬同樂會。」</h3>
        <p>快來加入我們的行列，分享你的釣魚故事吧！</p>
        <Button class="mt-6 border-2 rounded-full" variant="outline">立即加入</Button>
      </div>
      <div class="">
        <AspectRatio  :ratio="4 / 3">
          <img loading="lazy" :src="heroData.imageUrl" :alt="heroData.title" class="rounded-md object-cover w-full h-full bg-gray-300">
        </AspectRatio>
      </div>
    </div>

  
    <div class="mb-4 px-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card v-for="item in cardData" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-6 pb-4">

          <div class="flex justify-center items-center">
            <component :is="item.icon" size="84" color=""></component>
          </div>
         
          <CardHeader>
            <CardTitle>{{item.title}}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{{ item.context }}</CardDescription>
          </CardContent>
          
        </Card>
      </div>
    </div>

    <div class="mb-4 flex flex-col gap-4 justify-center items-center">
      <h3>🎣 加入釣魚地圖社群，馬上開啟你的釣魚旅程！</h3>
      <p>👉 [立即註冊] | [瀏覽釣點]</p>
    </div>


  </div>
</template>
