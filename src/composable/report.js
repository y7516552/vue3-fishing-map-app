import axios from 'axios';
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const apiUrl = import.meta.env.VITE_APP_API_URL+'report'
const cookies = useCookies(['fishingMap'])
const token = cookies.getAll().fishingMap

const reportAPI = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    Authorization:`${token}`
  },
});

export function useReport() {
    const reportList = ref(null)
    const loading = ref(false)


  const  getReportList = async () => {
    loading.value = true
    try {
        const { data } =await reportAPI.get(apiUrl)
        reportList.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }
    
  }

  const addReport = async(report) => {
    try {
      await reportAPI.post(apiUrl,report)
      loading.value = false
    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }
   }
  

  return { loading, reportList, getReportList, addReport}

}