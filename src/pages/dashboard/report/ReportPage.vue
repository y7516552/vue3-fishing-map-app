<script setup>
import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import dashboardSearchbar from '../dashboardSearchbar.vue';
import ReportUpdateDialog from './ReportUpdateDialog.vue';
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
import { Badge } from '@/components/ui/badge'
import {CirclePlus, SquarePen, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { ref, onMounted} from 'vue';
import {  useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const selectField = ref({
    query:true,
    city:true
});

const tableHead =[
  "type",
  "title",
  "description",
  "status",
  "action"
]

const typeList = [
  {
    name:'資料勘誤',
    value:'data',
    color:'bg-blue-500'
  },
  {
    name:'建議',
    value:'suggestion',
    color:'bg-lime-500'
  },
  {
    name:'錯誤回報',
    value:'error',
    color:'bg-rose-500'
  }
]

const typeData = (type) => {
  return typeList.find(e=>e.value == type)
}

const statusList = [
  {
    name:'未處理',
    value:'1',
    color:'bg-yellow-500'
  },
  {
    name:'已完成',
    value:'0',
    color:'bg-green-500'
  }
]

const statusData = (status) => {
  return statusList.find(e=>e.value == status)
}

const dataType = ref('report')

const dataForm = {
  type:"",
  title:"",
  description:"",
  imageUrlList:"",
}

const pageData = ref([])
const pageFillterdData = ref([])
const loading = ref(false)

const baseApiUrl=import.meta.env.VITE_APP_API_URL+"admin/"
const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const reportAPI = axios.create({
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      Authorization:`${token}`
    },
});

const fetchData = async(type) => {
    loading.value = true
    try {
        const { data } = await reportAPI.get(baseApiUrl+type)
        
        pageData.value = data.result
        pageFillterdData.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        if(error.status === 403) {
          console.log('403')
            // router.push({name: 'NoAccess'})
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
    if(type=='edit') updateData.value = {...data}
    openUpdate.value = true
  }
  const closeUpdateDialog = () => {
    openUpdate.value=false
    updateData.value = {
      type:"",
      title:"",
      description:"",
      imageUrlList:"",
    }
  }


  const openMsg = ref(false)
  const MsgData = ref({
    dataType:'',
    item:{name:''},
    status:'success'
  })

  const openDeleteDialog = (item)=> {
    MsgData.value.dataType = dataType.value
    openMsg.value = true
    MsgData.value.item = item
  }

  const updateItem = async(item)=> {
    let apiUrl = baseApiUrl+dataType.value
    loading.value = true
    try {
      if(item._id) {
        await reportAPI.put(apiUrl+`/${item._id}`,item)
      }else{
        await reportAPI.post(apiUrl,item)
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
  

  const deleteItem = async(id)=> {
    let apiUrl =baseApiUrl+dataType.value+'/'+id
    loading.value = true
    try {
        const { data } = await reportAPI.delete(apiUrl)
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
            <TableHead v-for="item in tableHead" :key="item" >{{ item }}</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody v-if="pageFillterdData.length!==0">
          
          <TableRow v-for="item in pageFillterdData" :key="item._id">
            <TableCell class="font-medium">
              <Badge :class="typeData(item.type).color">{{ typeData(item.type).name }}</Badge>
            </TableCell>
            <TableCell>{{ item.title }}</TableCell>
            <TableCell>{{ item.description }}</TableCell>
            <TableCell  class="text-center">
              <Badge :class="statusData(item.status).color">{{ statusData(item.status).name }}</Badge>
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
    <ReportUpdateDialog :openUpdateDialog="openUpdate" :dataType="dataType" :data="updateData" @updateItem="updateItem" @close="closeUpdateDialog"></ReportUpdateDialog>
    <DashboardMessageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}" @deleteItem="deleteItem"></DashboardMessageDialog>
  </div>
</template>
