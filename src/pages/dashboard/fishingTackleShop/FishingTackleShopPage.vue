<script setup>
import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import dashboardSearchbar from '../dashboardSearchbar.vue';
import FishingTackleShopUpdateDialog from './FishingTackleShopUpdateDialog.vue';
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

const router = useRouter()

const selectField = ref({
    query:true,
    city:true
});

const tableHead =[
  "name",
  "phone",
  "city",
  "status",
  "action"
]

const dataType = ref('fishingTackleShop')

const dataForm = {
  placesId:"",
  address:"",
  googleMapsUri:"",
  name:"",
  phone:"",
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

const fishingTackleShopAPI = axios.create({
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
        const { data } = await fishingTackleShopAPI.get(apiUrl)
        
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
    if(type=='edit') updateData.value = {...data}
    openUpdate.value = true
  }

  const closeUpdateDialog = () => {
    updateData.value = {}
    openUpdate.value=false
  }

  const updateItem = async(item)=> {
    let apiUrl = baseApiUrl+dataType.value
    loading.value = true
    try {
      if(item._id) {
        await fishingTackleShopAPI.put(apiUrl+`/${item._id}`,item)
      }else{
        await fishingTackleShopAPI.post(apiUrl,item)
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
    console.log('open',item)
    openMsg.value = true
    MsgData.value.item = item
  }

  const deleteItem = async(id)=> {
    let apiUrl =baseApiUrl+dataType.value+'/'+id
    loading.value = true
    try {
        const { data } = await fishingTackleShopAPI.delete(apiUrl)
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
            <TableHead v-for="item in tableHead" :key="item" >{{ item }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          <TableRow v-for="item in pageFillterdData" :key="item._id">
            <TableCell class="font-medium">
              {{ item.name }}
            </TableCell>
            <TableCell>{{ item.phone }}</TableCell>
            <TableCell>{{ item.city }}</TableCell>
            <TableCell  class="text-center">
              <p v-if="item.status==1" class="text-green-500">啟用</p>
              <p v-if="item.status==0" class="text-red-500">隱藏</p>
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
      </Table>
    </div>
    <FishingTackleShopUpdateDialog :openUpdateDialog="openUpdate" :dataType="dataType" :data="updateData" @close="closeUpdateDialog"  @updateItem="updateItem"></FishingTackleShopUpdateDialog>
    <DashboardMessageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}" @deleteItem="deleteItem"></DashboardMessageDialog>
  </div>


  <!-- <div>
    <DialogRoot>
      <DialogTrigger
        class="text-grass11 font-semibold shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
      >
        Open Dialog
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
            First Dialog
          </DialogTitle>
          <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-sm leading-normal">
            First dialog.
          </DialogDescription>

          <div class="mt-[25px] flex gap-4 justify-end">
            <DialogClose as-child>
              <button
                class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Close
              </button>
            </DialogClose>

            <DialogRoot>
              <DialogTrigger
                class="bg-green9 font-semibold shadow-blackA7 hover:bg-green10  inline-flex h-[35px] items-center justify-center rounded-[4px] text-white px-[15px] leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
              >
                Open second
              </DialogTrigger>

              <DialogPortal>
                <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
                <DialogContent
                  class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
                >
                  <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
                    Second Dialog
                  </DialogTitle>
                  <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-sm leading-normal">
                    Second dialog.
                  </DialogDescription>

                  <div class="flex justify-end">
                    <DialogClose as-child>
                      <button
                        class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                      >
                        Close
                      </button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </DialogPortal>
            </DialogRoot>
          </div>
          <DialogClose
            class="text-grass11 hover:bg-green4 focus:shadow-green7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <Icon icon="lucide:x" />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div> -->
</template>
