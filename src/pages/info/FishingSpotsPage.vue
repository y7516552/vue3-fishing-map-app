<script setup>
import {Search, RotateCw, LoaderCircle, MessageCircleMore, ThumbsUp ,Info} from 'lucide-vue-next';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { useFishingSpot } from '@/composable/fishingSpot'
import { ref, onMounted } from 'vue';
import MessageDialog from '@/components/MessageDialog.vue'

const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "基隆市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]
const city = ref("全部")
const fishingSpotList = ref({})

cityList.forEach((e) => {
  fishingSpotList.value[e]=[]
})

const {loading, fishingSpots, getFishingSpots } = useFishingSpot()
onMounted(async()=>{
  await getFishingSpots()
  console.log('fishingSpots',fishingSpots.value)
  
  fishingSpotList.value["全部"] =[...fishingSpots.value]
  fishingSpots.value.forEach(item =>{
    fishingSpotList.value[item.city].push(item)
  })
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
    <div class="flex gap-4 flex-wrap p-4">
      <Button v-for="item in cityList" :key="item" @click="city=item" class="" :variant="city===item ? 'outline' : ''"> {{item}}</Button>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card v-for="item in fishingSpotList[city]" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-0 pb-4">
          <div class="w-full">
            <AspectRatio  :ratio="16 / 9">
              <img :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full bg-gray-300">
            </AspectRatio>
          </div>
          <CardHeader>
            <CardTitle>{{item.name}}</CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
            <CardAction>
              <Info/>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Badge >{{ item.city }}</Badge>
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
    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></messageDialog>
  </div>
</template>


