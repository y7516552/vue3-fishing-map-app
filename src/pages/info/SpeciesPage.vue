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
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ref, onMounted , computed, watch} from 'vue'
import {Info} from 'lucide-vue-next';
import MessageDialog from '@/components/MessageDialog.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useSpecies } from '@/composable/species'
import { useReport } from '@/composable/report'
import { useUserStore }from'@/stores/user'
import { storeToRefs } from 'pinia'



  
const { species, loading,  getSpecies } = useSpecies()

const tagList = [
  { 
    name: '全部', 
    color: 'bg-gray-500' 
  },
  {
    name:'淡水',
    color:'bg-blue-500'
  },
  {
    name:'海水',
    value:'data',
    color:'bg-blue-500'
  },
  {
    name:'台灣特有',
    color:'bg-lime-500'
  },
  {
    name:'外來入侵',
    color:'bg-rose-500'
  }
]
const tag = ref("全部")

const tagData = (tag) => {
  return tagList.find(e=>e.name == tag)
}


onMounted(async()=>{
  await getSpecies()
})

const pageSize = 10 // 每頁顯示幾筆
const currentPage = ref(1)

const filteredSpecies = computed(() => {
  if (tag.value === "全部") {
    return species.value
  }
  return species.value.filter(item => item.tags.includes(tag.value))
})

const pagedSpecies = computed(() => {
  if(!filteredSpecies.value.length ) {
    return []
  }
  const start = (currentPage.value - 1) * pageSize
  return filteredSpecies.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  if(!filteredSpecies.value.length) {
    return 0
  }
  return Math.ceil(filteredSpecies.value.length / pageSize)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(tag, () => {
  currentPage.value = 1
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


</script>

<template>
  <div>
    <div class="flex gap-4 flex-wrap p-4">
      <Button v-for="item in tagList" :key="item.name" @click="tag=item.name"  :variant="tag===item.name ? 'outline' : ''"> {{item.name}}</Button>
    </div>
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
        <Card v-for="item in pagedSpecies" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
          <CardHeader>
            <CardTitle class="mb-3">{{item.CommonName}}</CardTitle>
            <CardDescription>學名:  {{item.ScientificName}}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="mb-3">
              <Badge v-for="tag in item.tags" :key="tag" class="mr-2" :class="tagData(tag).color">{{ tag }}</Badge>
            </div>
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
        <div v-if="!pagedSpecies.length" class="col-span-full text-center">
          <p>沒有符合的資料</p>
        </div>
      </div>

      
    </div>
    <div class="my-4" v-if="pagedSpecies.length !==0">
      <PaginationBar :items-per-page="pageSize" :total="filteredSpecies.length" :default-page="currentPage"  @update:page="goToPage"/>
    </div>

    <div class="text-center p-4">
      <p>資料取自: <a class="text-blue-600" target="_blank" rel="noopener noreferrer" href="https://fishdb.sinica.edu.tw"> 台灣魚類資料庫 </a></p>
    </div>

    <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></MessageDialog>
    <ReportDialog class="z-1000"  :open="openReport" @close="()=> {openReport=false}" @sendReport="sendReport"></ReportDialog>
  </div>
</template>


