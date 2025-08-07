<script setup>
import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import dashboardSearchbar from '../dashboardSearchbar.vue';
import FishingSpotUpdateDialog from './FishingSpotUpdateDialog.vue';
import DashboardMessageDialog from '../dashboardMessageDialog.vue';
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

const router = useRouter()

const selectField = ref({
    query:true,
    city:true
});

const tableHead =[
  "name",
  "city",
  "type",
  "imageUrl",
  "status",
  "action"
]

const dataType = ref('fishingSpot')

const dataForm = {
  name:"",
  description:"",
  imageUrl:"",
  imageUrlList:"",
  type:"",
  fishingAllowed: true,
  locations:{
    type: "Point",
    coordinates: [null,null],
  },
  city:""
}

const pageData = ref([])
const pageFillterdData = ref([])
const loading = ref(false)

const baseApiUrl=import.meta.env.VITE_APP_API_URL+"admin/"

const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const fishingSpotAPI = axios.create({
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
        const { data } = await fishingSpotAPI.get(apiUrl)
        
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
    if(type=='create')updateData.value = {...dataForm}
    if(type=='edit') updateData.value = data
    openUpdate.value = true
  }


  const updateItem = async(item)=> {
    let apiUrl = baseApiUrl+dataType.value
    loading.value = true
    try {
      if(item._id) {
        await fishingSpotAPI.put(apiUrl+`/${item._id}`,item)
      }else{
        await fishingSpotAPI.post(apiUrl,item)
      }
      
      openUpdate.value = false
      fetchData(dataType.value)
      loading.value = false
      toast.success('資料更新成功')
    } catch (error) {
      console.log(error)
      if(error.status === 403) {
        // router.push({name: 'NoAccess'})
        console.log('403')
      }else{
        toast.warning('資料更新失敗')
        loading.value = false
      }
    }
  }


  const openMsg = ref(false)
  const MsgData = ref({
    item:{name:''},
    status:'success'
  })

  const openDeleteDialog = (item)=> {
    openMsg.value = true
    MsgData.value.item = item
  }

  const deleteItem = async(id)=> {
    let apiUrl =baseApiUrl+dataType.value+'/'+id
    loading.value = true
    try {
        const { data } = await fishingSpotAPI.delete(apiUrl)
        if(data.result)
        loading.value = false
        toast.success('項目刪除成功')
        fetchData(dataType.value)
    } catch (error) {
        console.log(error)
        if(error.status === 403) {
            router.push({name: 'NoAccess'})
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
      <Button @click="openUpdateDialog('create')" class="ml-auto mr-0"> 
        <CirclePlus/>
        新增 
      </Button>
    </div>
    <div class="p-4">
      <Table>
        <TableCaption>A list of {{ dataType }}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead v-for="item in tableHead" :key="item" class="font-medium">{{ item }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          <TableRow v-for="item in pageFillterdData" :key="item._id">
            <TableCell class="font-medium">
              {{ item.name }}
            </TableCell>
            <TableCell>{{ item.city }}</TableCell>
            <TableCell>{{ item.type }}</TableCell>
            <TableCell  class="flex justify-center">
              <div class="w-[200px]">
                <AspectRatio :ratio="16 / 9">
                  <img :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
            </TableCell>
            <TableCell  class="text-center">
              <p v-if="item.status==1" class="text-green-500">啟用</p>
              <p v-if="item.status==0" class="text-red-500">隱藏</p>
            </TableCell>
            <TableCell class="text-center">
              <Button class="mx-2" @click="openUpdateDialog('edit',item)" variant="outline">
                <SquarePen/>
              </Button>
              <Button @click="openDeleteDialog(item)" variant="destructive">
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <FishingSpotUpdateDialog :openUpdateDialog="openUpdate" :dataType="dataType" :data="updateData" @close="()=> {openUpdate=false}" @updateItem="updateItem"></FishingSpotUpdateDialog>
    <DashboardMessageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}" @deleteItem="deleteItem"></DashboardMessageDialog>
  </div>
</template>
