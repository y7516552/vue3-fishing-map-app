<script setup>
import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import dashboardSearchbar from './dashboardSearchbar.vue';
import DashboardUpdateDialog from './dashboardUpdateDialog.vue';
import DashboardMessageDialog from './dashboardMessageDialog.vue';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {CirclePlus, SquarePen, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { ref, onMounted } from 'vue';
import {  useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'


const router = useRouter()

const selectField = ref({
    query:true,
    city:false
});

const tableHead =[
  "Common Name",
  "Scientific Name",
  "Image",
  "tags",
  "Link",
  "Action"
]

const dataType = ref('species')

const dataForm = {
  CommonName:"",
  ScientificName:"",
  imageUrl:"",
  fishDBUrl:"",
  tags:[]
}

const pageData = ref([])
const pageFillterdData = ref([])
const loading = ref(false)

const baseApiUrl=import.meta.env.VITE_APP_API_URL+"admin/"
const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const speciesAPI = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    Authorization:`${token}`
  },
});

const fetchData = async(type) => {
  let apiUrl =baseApiUrl+type
  loading.value = true
  try {
    const { data } = await speciesAPI.get(apiUrl)
        
    pageData.value = data.result
    pageFillterdData.value = data.result
    loading.value = false
  } catch (error) {
    console.log(error)
    if(error.status === 403) {
      router.push({name: 'NoAccess'})
    }else{
      toast.warning('資料取得失敗')
      loading.value = false
    }
  }
}

const fillerData = (search={query:"",city:""}) => {
    if(search.query=="" && (search.city =="" || search.city =='全部'))  pageFillterdData.value = pageData.value
    let fillerData = [...pageData.value]
    if(search.city!=="" && search.city !=='全部'){
        fillerData = fillerData.filter(e=>e.city === search.city)
    }
    if(search.query!==""){
        const result = fillerData.filter(item => {
            const objString =JSON.stringify(item)
            const exist = objString.includes(search.query);
            if(exist)  return item
        })
        fillerData = result
    }
    pageFillterdData.value = fillerData
}


  onMounted(async()=>{
    await fetchData(dataType.value)
  })

  const openUpdate = ref(false)
  const updateData = ref({})
  const openUpdateDialog = (type = 'create', data ) => {
    updateData.value = dataForm
    if(type=='edit') updateData.value = data
    openUpdate.value = true
  }


  const openMsg = ref(false)
  const MsgData = ref({
    dataType:'',
    item:{name:''},
    status:'success'
  })

  const updateItem = async(item)=> {
    console.log('updateItem',item)
    let apiUrl =baseApiUrl+dataType.value
    loading.value = true
    try {
      const { data } = await speciesAPI.post(apiUrl,item)
      
      console.log('data',data)
      openUpdate.value = false
      fetchData(dataType.value)
      loading.value = false
    } catch (error) {
      console.log(error)
      if(error.status === 403) {
        // router.push({name: 'NoAccess'})
        console.log('403')
      }else{
        toast.warning('資料取得失敗')
        loading.value = false
      }
    }
  }

  const openDeleteDialog = (item)=> {
    openMsg.value = true
    MsgData.value.dataType = dataType.value
    MsgData.value.item = item
  }

  const deleteItem = async(id)=> {
    let apiUrl =baseApiUrl+dataType.value+'/'+id
    loading.value = true
    try {
      const { data } = await speciesAPI.delete(apiUrl)
      if(data.result)
      loading.value = false
      toast.success('項目刪除成功')
      fetchData(dataType.value)
    } catch (error) {
      console.log(error)
      if(error.status === 403) {
        // router.push({name: 'NoAccess'})
        console.log('403')
      }else{
        toast.warning('項目刪除失敗')
        loading.value = false
      }
    }
  }
</script>


<template>
  <div>
    <div class="flex p-4" >
      <dashboardSearchbar :selectField="selectField" @search-update="fillerData"/>
      <Button @click="openUpdateDialog" class="ml-auto mr-0"> 
        <CirclePlus/>
        新增 
      </Button>
    </div>
    <div class="p-4">
      <Table>
        <TableCaption>A list of {{ dataType }}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead v-for="item in tableHead" :key="item"  class="text-center">{{ item }}</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody v-if="pageFillterdData.length!==0">
          
          <TableRow v-for="item in pageFillterdData" :key="item._id">
            <TableCell class="font-medium text-center">
              {{ item.CommonName }}
            </TableCell>
            <TableCell class="text-center">{{ item.ScientificName }}</TableCell>
            <TableCell  class="flex justify-center">
              <div class="w-[200px]">
                <AspectRatio :ratio="16 / 9">
                  <img :src="item.imageUrl" :alt="item.ScientificName" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
            </TableCell>
            <TableCell class="text-center">
              <Badge v-for=" tag in item.tags" :key="tag" class="bg-sky-600 mr-1">{{ tag }}</Badge>
            </TableCell>
            <TableCell  class="text-center">
              <a :href="item.fishDBUrl" target="_blank" rel="noopener noreferrer">連結</a>
            </TableCell>
            <TableCell class="text-center">
              <Button @click="openUpdateDialog('edit',item)" variant="outline">
                <SquarePen/>
              </Button>
              <Button @click="openDeleteDialog(item)" variant="destructive">
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody v-else class="">
          <TableRow>
            <TableCell>
              查無資料...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <DashboardUpdateDialog :openUpdateDialog="openUpdate" :dataType="dataType" :data="updateData" @close="()=> {openUpdate=false}" @updateItem="updateItem"></DashboardUpdateDialog>
    <DashboardMessageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"  @deleteItem="deleteItem"></DashboardMessageDialog>
  </div>
</template>
