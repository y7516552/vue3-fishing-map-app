<script setup>
import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import dashboardSearchbar from '../dashboardSearchbar.vue';
import DashboardUpdateDialog from './UserUpdateDialog.vue';
// import DashboardMessageDialog from '../dashboardMessageDialog.vue';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SquarePen, /*Trash2*/ } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { ref, onMounted } from 'vue';
import { toast } from 'vue-sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'


const selectField = ref({
    query:true,
    city:false
});

const tableHead =[
  "name",
  "email",
  "phone",
  "avatar",
  "Action"
]

const dataType = ref('user')

const dataForm = {
  CommonName:"",
  ScientificName:"",
  imageUrl:"",
  fishDBUrl:"",
}

const pageData = ref([])
const pageFillterdData = ref([])
const loading = ref(false)

const baseApiUrl=import.meta.env.VITE_APP_API_URL+"admin/"
const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const userAPI = axios.create({
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
        const { data } = await userAPI.get(apiUrl)
        pageData.value = data.result
        pageFillterdData.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        if(error.status === 403) {
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
    if(type=='edit') updateData.value = data
    openUpdate.value = true
  }


  // const openMsg = ref(false)
  // const MsgData = ref({
  //   item:{name:''},
  //   status:'success'
  // })

  // const openDeleteDialog = (item)=> {
  //   console.log('open',item)
  //   openMsg.value = true
  //   MsgData.value.item = item
  // }

  // const deleteItem = async(item)=> {
  //   let apiUrl =baseApiUrl+dataType.value+item._id
  //   loading.value = true
  //   try {
  //       const { data } = await axios.delete(apiUrl)
  //       if(data.result)
  //       loading.value = false
  //       toast.success('項目刪除成功')
  //       fetchData(dataType.value)
  //   } catch (error) {
  //       console.log(error)
  //       if(error.status === 403) {
  //           router.push({name: 'NoAccess'})
  //       }else{
  //           toast.warning('項目刪除失敗')
  //           loading.value = false
  //       }
  //   }
  // }
</script>


<template>
  <div>
    <div class="flex p-4" >
      <dashboardSearchbar :selectField="selectField" @search-update="fillerData"/>
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
              {{ item.name }}
            </TableCell>
            <TableCell>{{ item.email }}</TableCell>
            <TableCell>{{ item.phone }}</TableCell>
            <TableCell  class="text-center">
              <div class="w-[200px]">
                <AspectRatio :ratio="16 / 9">
                  <img :src="item.avatarUrl" :alt="item.name" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
            </TableCell>
            <TableCell class="text-center">
              <Button @click="openUpdateDialog('edit',item)" variant="outline">
                <SquarePen/>
              </Button>
              <!-- <Button @click="openDeleteDialog(item)" variant="destructive">
                <Trash2 />
              </Button> -->
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
    <DashboardUpdateDialog :openUpdateDialog="openUpdate" :dataType="dataType" :data="updateData" @close="()=> {openUpdate=false}"></DashboardUpdateDialog>
    <!-- <DashboardMessageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}" @deleteItem="deleteItem"></DashboardMessageDialog> -->
  </div>
</template>
