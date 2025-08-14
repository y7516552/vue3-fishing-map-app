import axios from 'axios';
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const apiUrl = import.meta.env.VITE_APP_API_URL+'fishingSpot'


export function useFishingSpot() {
    const fishingSpots = ref(null)
    const loading = ref(false)


  const  getFishingSpots = async () => {
    loading.value = true
    try {
        const { data } =await axios.get(apiUrl)
        fishingSpots.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }
      
    

  }
  

  return { loading, fishingSpots, getFishingSpots}
}