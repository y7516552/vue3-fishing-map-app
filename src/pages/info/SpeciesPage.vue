<script setup>
import axios from 'axios';
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import {Info} from 'lucide-vue-next';
import MessageDialog from '@/components/MessageDialog.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import { useUserStore }from'../../stores/user'
import { storeToRefs } from 'pinia'

const apiUrl = 'http://localhost:3000/api/v1/species'
const species = ref([])
const loading = ref(false)

const  getSpecies = async () => {
    loading.value = true
    try {
        const { data } =await axios.get(apiUrl)
        species.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }
      
    

  }
  onMounted(async()=>{
    await getSpecies()
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
    <div class="p-4">
      <Button variant="outline" @click="openReportDialog">
        <Info/>
        問題回報
      </Button>
    </div>
    
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card v-for="item in species" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
          <CardHeader>
            <CardTitle class="mb-3">{{item.CommonName}}</CardTitle>
            <CardDescription>學名:  {{item.ScientificName}}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="w-full">
            <AspectRatio  :ratio="16 / 9">
              <img :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full bg-gray-300">
            </AspectRatio>
          </div>
          </CardContent>
          <CardFooter >
            <p>魚類資料庫連結:</p>
            <a 
              :href="item.fishDBUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="mx-4 text-blue-600"
              >
              點我
            </a>
          </CardFooter>
        </Card>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" ></div>
    </div>

    <div class="text-center p-4">
      <p>資料取自: <a class="text-blue-600" href="https://fishdb.sinica.edu.tw"> 台灣魚類資料庫 </a></p>
    </div>

    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
    <ReportDialog class="z-1000"  :open="openReport" @close="()=> {openReport=false}" @sendReport="sendReport"></ReportDialog>
  </div>
</template>


