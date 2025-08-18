<script setup>
import { ref, onMounted ,computed, watch} from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPinned , LoaderCircle ,Info} from 'lucide-vue-next'
import MessageDialog from '@/components/MessageDialog.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import{ useFishingTackleShop}  from '@/composable/fishingTackleShop'
import { useReport } from '@/composable/report'
import { useUserStore }from'@/stores/user'
import { storeToRefs } from 'pinia'

const { loading, fishingTackleShops, getFishingTackleShops } = useFishingTackleShop()

const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]
const city = ref("全部")

const pageSize = 10 // 每頁顯示幾筆
const currentPage = ref(1)



onMounted(async()=>{
  await getFishingTackleShops()

})

const filteredShops = computed(() => {
  if (city.value === "全部") {
    return fishingTackleShops.value
  }
  return fishingTackleShops.value.filter(item => item.city === city.value)
})

const pagedShops = computed(() => {
  if(!filteredShops.value.length ) {
    return []
  }
  const start = (currentPage.value - 1) * pageSize
  return filteredShops.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  if(!filteredShops.value.length) {
    return 0
  }
  return Math.ceil(filteredShops.value.length / pageSize)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(city, () => {
  currentPage.value = 1
})


  const store = useUserStore()
  const { isLogin } = storeToRefs(store)

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


</script>

<template>
  <div>
    <div class="flex gap-4 flex-wrap p-4">
      <Button v-for="item in cityList" :key="item" @click="city=item" class="" :variant="city===item ? 'outline' : ''"> {{item}}</Button>
    </div>
    <div class="p-4">
      <Button variant="outline" @click="openReportDialog">
        <Info/>
        問題回報
      </Button>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div v-if="loading" class="grid auto-rows-min gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 ">
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
      </div>
      <div v-else class="grid auto-rows-min gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 ">
        <Card v-for="item in pagedShops" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
          <CardHeader>
            <CardTitle class="mb-3">{{item.name}}</CardTitle>
            <CardDescription>電話:  {{ item.phone }}</CardDescription>
            <CardDescription>地址:  {{ item.address }}</CardDescription>
            <CardAction>
              <Info/>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Badge >{{ item.city }}</Badge>
          </CardContent>
          <CardFooter >
            <a 
              :href="item.googleMapsUri" 
              target="_blank" 
              rel="noopener noreferrer"
              class="mr-4"
              >
              <MapPinned size="32"/>
            </a>
          </CardFooter>
        </Card>
      </div>
      <div class="flex flex-col justify-center items-center gap-2">
        <p v-if="!pagedShops.length" >沒有符合條件的釣具店</p>
        <p v-else >符合條件的釣具店: 總共{{ filteredShops.length }}個，顯示第{{ currentPage }}/{{ totalPages }}頁</p>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
        <PaginationBar :items-per-page="pageSize" :total="filteredShops.length" :default-page="currentPage"  @update:page="goToPage"/>
      </div>
    </div>
    <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[loading ? 'flex':'hidden']">
      <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
    </div>
    <MessageDialog class="z-1001" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
    <ReportDialog class="z-1000"  :open="openReport" @close="()=> {openReport=false}" @sendReport="sendReport"></ReportDialog>
  </div>
</template>
