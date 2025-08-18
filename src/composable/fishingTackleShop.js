import axios from 'axios';
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const apiUrl = import.meta.env.VITE_APP_API_URL+'fishingTackleShop'
// const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]


export function useFishingTackleShop() {
    const fishingTackleShops = ref({})
    const loading = ref(false)



  const  getFishingTackleShops = async () => {
    loading.value = true
    try {
        const { data } =await axios.get(apiUrl)
        fishingTackleShops.value=data.result
        

    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }finally{
      loading.value = false
    }
      
    

  }
  

  return { loading, fishingTackleShops, getFishingTackleShops}
}