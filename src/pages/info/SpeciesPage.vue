<script setup>
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
import { ref, onMounted,watch } from 'vue'
import {Info} from 'lucide-vue-next';
import MessageDialog from '@/components/MessageDialog.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import { useSpecies } from '@/composable/species'
import { useUserStore }from'@/stores/user'
import { storeToRefs } from 'pinia'

  const { species, loading, error, getSpecies } = useSpecies()

  watch(error,()=>{
    console.log('error',error.value)
  })

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
    
    <div class="flex flex-1 flex-col gap-4 p-3">

      <div v-if="loading" class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>

      <div v-else class="grid auto-rows-min gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
        <Card v-for="item in species" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
          <CardHeader>
            <CardTitle class="mb-3">{{item.CommonName}}</CardTitle>
            <CardDescription>學名:  {{item.ScientificName}}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="w-full max-w-3/4">
              <AspectRatio  :ratio="2 / 1">
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

      
    </div>

    <div class="text-center p-4">
      <p>資料取自: <a class="text-blue-600" target="_blank" rel="noopener noreferrer" href="https://fishdb.sinica.edu.tw"> 台灣魚類資料庫 </a></p>
    </div>

    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
    <ReportDialog class="z-1000"  :open="openReport" @close="()=> {openReport=false}" @sendReport="sendReport"></ReportDialog>
  </div>
</template>


