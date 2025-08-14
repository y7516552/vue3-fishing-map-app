<script setup>
import { ref, onMounted } from 'vue'
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
// import MessageDialog from '@/components/MessageDialog.vue'
import{ useFishingTackleShop}  from '@/composable/fishingTackleShop'
import { useUserStore }from'@/stores/user'
import { storeToRefs } from 'pinia'

const { loading, fishingTackleShops, getFishingTackleShops } = useFishingTackleShop()

const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]
const city = ref("全部")
const filteredData = ref({})





  onMounted(async()=>{
    await getFishingTackleShops()

    cityList.forEach((e) => {
      filteredData.value[e]=[]
    })

        filteredData.value["全部"] = fishingTackleShops.value

        fishingTackleShops.value.forEach(item =>{
         filteredData.value[item.city].push(item)
        })
  })


  const store = useUserStore()
  const { isLogin, userData} = storeToRefs(store)
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

  const sendReport = (data) => {
    openReport.value = false
    console.log(data,userData)
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
      <div class="grid auto-rows-min gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 ">
        <Card v-for="item in filteredData[city]" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
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
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
        <div class="aspect-video rounded-xl bg-muted/50" ></div>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" ></div>
    </div>
    <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[loading ? 'flex':'hidden']">
      <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
    </div>
    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
  </div>
</template>
