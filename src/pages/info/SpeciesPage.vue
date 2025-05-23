<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

const apiUrl = 'http://localhost:3000/api/v1/species'
const species = ref([])
const loading = ref(false)

const  getSpecies = async () => {
    loading.value = true
    try {
        const { data } =await axios.get(apiUrl)
        species.value = data.result
        loading.value = false
    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗', {
            description: error,
        })
        loading.value = false
    }
      
    

  }
  onMounted(async()=>{
    await getSpecies()
  })
</script>

<template>
  <div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </div>
</template>


