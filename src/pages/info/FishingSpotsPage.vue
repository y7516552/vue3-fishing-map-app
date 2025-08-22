<script setup>
import {Search, RotateCw, LoaderCircle, MessageCircleMore, ThumbsUp ,Info} from 'lucide-vue-next';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
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
import StarRating from 'vue-star-rating'
import { useFishingSpot } from '@/composable/fishingSpot'
import { ref, onMounted, computed, watch } from 'vue';
import MessageDialog from '@/components/MessageDialog.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useUserStore }from'@/stores/user'

import { useReport } from '@/composable/report'
import { storeToRefs } from 'pinia'


const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "基隆市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]
const city = ref("全部")
const fishingSpotList = ref({})

cityList.forEach((e) => {
  fishingSpotList.value[e]=[]
})

const {loading, fishingSpots, getFishingSpots } = useFishingSpot()
onMounted(async()=>{
  await getFishingSpots()
  
  // fishingSpotList.value["全部"] =[...fishingSpots.value]
  // fishingSpots.value.forEach(item =>{
  //   fishingSpotList.value[item.city].push(item)
  // })
})

const store = useUserStore()
const { isLogin} = storeToRefs(store)
const openMsg = ref(false)
const MsgData =ref({
  title:'',
  description:'',
  status:''
})

const openReport = ref(false)

  const openReportDialog = () =>{
    if(!isLogin.value){
      MsgData.value = {
        title:'請先登入',
        description:'登入才能使用此功能',
        status:'danger'
      }
      openMsg.value = true
    }else{

      openReport.value = true
    }
  }

  const { addReport } = useReport()

  const sendReport = async (data) => {
    openReport.value = false
    await addReport(data)
  }

  const spotRating = (rewiews) => {
  if(rewiews.length == 0) return 0
  let totalScore = 0
  rewiews.forEach(e => {
    totalScore += e.rating
  });
  return (totalScore / rewiews.length)
}

const pageSize = 10 // 每頁顯示幾筆
const currentPage = ref(1)

const filteredSpot = computed(() => {
  if (city.value === "全部") {
    return fishingSpotList.value
  }
  return fishingSpotList.value.filter(item => item.city === city.value)
})

const pagedSpot = computed(() => {
  if(!filteredSpot.value.length ) {
    return []
  }
  const start = (currentPage.value - 1) * pageSize
  return filteredSpot.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  if(!filteredSpot.value.length) {
    return 0
  }
  return Math.ceil(filteredSpot.value.length / pageSize)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(city, () => {
  currentPage.value = 1
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
    <div class="p-4">
      <Button variant="outline" @click="openReportDialog">
        <Info/>
        問題回報
      </Button>
    </div>
    <ScrollArea class="h-140 w-full rounded-md ">
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div v-if="loading" class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" ></div>
          <div class="aspect-video rounded-xl bg-muted/50" ></div>
          <div class="aspect-video rounded-xl bg-muted/50" ></div>
        </div>
        <div v-else class="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card v-for="item in fishingSpotList[city]" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-0 pb-4">
            <div class="w-full">
              <AspectRatio  :ratio="16 / 9">
                <img loading="lazy" :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full bg-gray-300">
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
              <div class="mb-6">
                <Badge >{{ item.city }}</Badge>
              </div>
              <div class="mb-6">
                <star-rating
                  class="mb-3"
                  :show-rating="false"
                  :rating="spotRating(item.reviews)"
                  read-only
                  :star-size=20
                />
              </div>
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
          <div v-if="!fishingSpotList[city].length" >
            <p>沒有符合的資料</p>
          </div>
        </div>
      </div>

       <div class="my-4" v-if="pagedSpecies.length !==0">
        <PaginationBar :items-per-page="pageSize" :total="filteredSpot.length" :default-page="currentPage"  @update:page="goToPage"/>
      </div>
    </ScrollArea>
    <div class="loading transition-all transition-discrete bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[loading ? 'flex':'hidden']">
      <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
    </div>
    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
    <ReportDialog class="z-1000"  :open="openReport" @close="()=> {openReport=false}" @sendReport="sendReport"></ReportDialog>
  </div>
</template>


