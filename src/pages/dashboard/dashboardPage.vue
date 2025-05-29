<script setup>
import axios from 'axios';
import dashboardSearchbar from './dashboardSearchbar.vue';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const selectField = ref({
    query:true,
    city:true
});

const dataType = route.params.type
const pageData = ref([])
const pageFillterdData = ref([])
const loading = ref(false)

const baseApiUrl=import.meta.env.VITE_APP_API_URL//+"admin/"

const fetchData = async(type) => {
    let apiUrl =baseApiUrl+type
    loading.value = true
    try {
        const { data } = await axios.get(apiUrl)
        
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
    await fetchData(dataType)
  })
</script>


<template>
  <div>
    <div class="flex p-4" >
        <dashboardSearchbar :selectField="selectField" @search-update="fillerData"/>
    </div>
    <div>
        {{  pageFillterdData }}
        <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">
          Invoice
        </TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead class="text-right">
          Amount
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">
          INV001
        </TableCell>
        <TableCell>Paid</TableCell>
        <TableCell>Credit Card</TableCell>
        <TableCell class="text-right">
          $250.00
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
    </div>
  </div>
</template>
