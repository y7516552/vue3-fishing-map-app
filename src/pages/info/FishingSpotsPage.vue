<script setup>
import {Search, RotateCw, LoaderCircle, MessageCircleMore, ThumbsUp } from 'lucide-vue-next';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useFishingSpot } from '@/composable/fishingSpot'
import { onMounted } from 'vue';

const {loading, fishingSpots, getFishingSpots } = useFishingSpot()
onMounted(async()=>{
  await getFishingSpots()
  console.log('fishingSpots',fishingSpots.value)
})

</script>


<template>
  <div>
    <div class="flex justify-between px-4 pt-4">
      <div class="relative w-full max-w-sm items-center">
        <Input id="search" type="text" placeholder="Search..." class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
      <Button @click="getFishingSpots">
        <RotateCw />
      </Button>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card v-for="item in fishingSpots" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-0 pb-4">
          <div class="w-full">
            <AspectRatio  :ratio="16 / 9">
              <img :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full bg-gray-300">
            </AspectRatio>
          </div>
          <CardHeader>
            <CardTitle>{{item.name}}</CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter class="justify-center">
            <div class=" w-100 flex gap-6 justify-around">
              <div class="">
                <MessageCircleMore/>
                <p>({{ item.reviews.length }})</p>
              </div>
              <div class="">
                <ThumbsUp/>
                <p>({{ item.likes.length }})</p>
              </div>
            </div>
          </CardFooter>
        </Card>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" ></div>
    </div>
    <div class="loading transition-all transition-discrete bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[loading ? 'flex':'hidden']">
      <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
    </div>
  </div>
</template>


