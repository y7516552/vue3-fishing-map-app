<script setup>
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
    <div class="p-4">
      <p>資料取自: <a class="text-blue-600" href="https://fishdb.sinica.edu.tw"> 台灣魚類資料庫 </a></p>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card v-for="item in species" :key="item._id" class="aspect-video rounded-xl bg-muted/50 pt-4 pb-4">
          <CardHeader>
            <CardTitle class="mb-3">{{item.CommonName}}</CardTitle>
            <CardDescription>學名:  {{item.ScientificName}}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="w-full">
            <AspectRatio  :ratio="16 / 9">
              <img :src="item.imageUrl" :alt="item.name" class="rounded-md object-cover w-full h-full bg-gray-300">
            </AspectRatio>
          </div>
          </CardContent>
          <CardFooter >
            <p>魚類資料庫連結:</p>
            <a 
              :href="item.fishDBUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="mx-4 text-blue-600"
              >
              點我
            </a>
          </CardFooter>
        </Card>
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" ></div>
    </div>
  </div>
</template>


