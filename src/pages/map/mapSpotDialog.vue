<script setup>
// import axios from 'axios';
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogScrollContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { CircleAlert,FishOff ,ThermometerSun,MapPinned,ThumbsUp ,LoaderCircle} from 'lucide-vue-next'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import StarRating from 'vue-star-rating'
import ReviewsAuthor from './reviews/ReviewsAuthor.vue'
import MessageDialog from '@/components/MessageDialog.vue'
import ReviewDialog from './reviews/ReviewDialog.vue'


import { inject ,ref, watch} from 'vue'
import { useUserStore }from'../../stores/user'
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { isLogin ,userData} = storeToRefs(store)

const emit = defineEmits(['likeSpot','dislikeSpot','createReview','updateReview'])

const loading = ref(true)

const spotData = inject('spotData')
const dailogOpen = inject('dailogOpen')

watch(dailogOpen,() => {
  if(dailogOpen.value){
    loading.value = true
    setTimeout(()=>{
      loading.value = false
    },1500)
  }
})

watch(spotData,() => {
  console.log('update')
})

const openMsg = ref(false)
const MsgData = ref({
    title:'',
    description:'',
    status:'success'
})

const windyUrl = ([lat,lon]) => {
  return`https://www.windy.com/${lat}/${lon}?waves,${lat},${lon},16`
  // return`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=11&level=surface&overlay=waves&product=ecmwfWaves&calendar=now&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`
}

const googleMapUrl = ([lat,lon]) => {
  return`https://maps.google.com?q=${lat},${lon}`
}

const spotRating = (rewiews) => {
  if(rewiews.length == 0) return 0
  let totalScore = 0
  rewiews.forEach(e => {
    totalScore += e.rating
  });
  return (totalScore / rewiews.length)
}

const loginYet = () => {
  if(!isLogin.value){
    openMsg.value = true
    MsgData.value = {
        title:'請先登入',
        description:'登入才能使用此功能',
        status:'danger'
    }
  }
}

const likeSpot = async (id) => {
  try{
    loading.value = true
    // let apiUrl = `http://localhost:3000/api/v1/fishingSpot/${id}/like`
    // const { data } = await axios.get(apiUrl)
    // console.log('data',data)
    console.log('userData',userData.value._id)
    emit('likeSpot',id)
    
  }catch(err) {
    console.log( err)
    loading.value = false
  }
}



const dislikeSpot = async (id) => {
  try{
    // loading.value = true
    // let apiUrl = `http://localhost:3000/api/v1/fishingSpot/${id}/dislike`
    // const { data } = await axios.get(apiUrl)
    // console.log('data',data)

    emit('dislikeSpot',id)
    
  }catch(err) {
    console.log( err)
    loading.value = false
  }
}

const reviewDailog = ref(false)
const openReviewDailog = () => {
  console.log('openReviewDailog')
  if(!isLogin.value){
    MsgData.value = {
      title:'請先登入',
      description:'登入才能使用此功能',
      status:'danger'
    }
      openMsg.value = true
  }else{

    reviewDailog.value = true
  }
}

const addReview = async(data)=>{
  try{
    console.log('addReview',data)
    // loading.value = true
    // let apiUrl = `http://localhost:3000/api/v1/fishingSpot/${id}/dislike`
    // const { data } = await axios.get(apiUrl)
    // console.log('data',data)

    
  }catch(err) {
    console.log( err)
    loading.value = false
  }
}

</script>

<template>
  <Dialog v-model:open="dailogOpen" class="z-1200">
   

    <DialogOverlay class="z-1000 ">
        <DialogScrollContent class="z-1000 p-0 lg:max-w-[825px] sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto]  gap-y-6">
          <div class="w-full">
            <AspectRatio  :ratio="16 / 9">
              <img :src="spotData.imageUrl" :alt="spotData.name" class="rounded-md object-cover w-full h-full bg-gray-300">
            </AspectRatio>
          </div>
          <DialogHeader class="mx-6 mb-6">
            <FishOff v-if="!spotData.fishingAllowed" color="red" class="mb-6 mr-6" />
            <DialogTitle>{{ spotData.name }}</DialogTitle>
            <DialogDescription class="mb-6">
              {{ spotData.description }}
            </DialogDescription>
            <div class="">
              <div class="mb-6">
                <star-rating
                  class="mb-3"
                  :show-rating="false"
                  :rating="spotRating(spotData.reviews)"
                  read-only
                  :star-size=20
                 />
              </div>
              <div v-if="!spotData.fishingAllowed" class="mb-6">
                <p class="font-bold text-red-500">
                  <CircleAlert/>
                  本區為禁釣區域，後果自行負責。
                </p>
              </div>

              <div class="flex mb-6">
  
                <a 
                  :href="windyUrl(spotData.locations.coordinates)" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="mr-4"
                >
                  <ThermometerSun size="32"/>
                </a>
                <a 
                  :href="googleMapUrl(spotData.locations.coordinates)" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="mr-4"
                >
                  <MapPinned size="32"/>
                </a>
                <!-- <template v-if="spotData.likes.includes()"></template> -->
                <ThumbsUp v-if="isLogin&&spotData.likes.includes(userData._id)" @click="dislikeSpot(spotData._id)" fill="" size="32" class="mr-4"/>
                <ThumbsUp v-if="isLogin" @click="likeSpot(spotData._id)" size="32" class="mr-4"/>
                <ThumbsUp v-else @click="loginYet()" size="32" class="mr-4" color="#5c5c5c"/>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter class="mx-6 mb-6">
            <Button v-if="isLogin" variant="outline" @click="openReviewDailog">
              新增評論
            </Button>
            <Button v-else variant="outline" disabled>
              新增評論
            </Button>
          </DialogFooter>

          <div class=" mt-6 grid gap-6 py-4 px-6 border-t-1">
            <p class="font-bold">評論({{ spotData.reviews.length }})</p>
            <div class="flex flex-col justify-between mt-6">
              <div v-for="item in spotData.reviews" :key="item._id" class="border-b-2 p-3">
                <ReviewsAuthor v-if="item.authorId" :avatarUrl="item.authorId.avatarUrl" :name="item.authorId.name" :created-at="item.createdAt"></ReviewsAuthor>
                <star-rating
                  class="mb-3"
                  :show-rating="false"
                  :rating="item.rating"
                  read-only
                  :star-size=20
                 />
                <p class="font-bold mb-3">{{ item.title }}</p>
                <p class="mb-3">
                  {{ item.description }}
                </p>
                <div class="mb-6 ">
                  <p class="mb-3">魚種:</p>
                  <div class="flex">
                    <div class="" v-for="fish in item.catchs" :key="fish._id">
                      <img class="max-w-[120px] rounded-md"  :src="fish.imageUrl" alt="">
                      <p>{{ fish.CommonName }}</p>
                    </div>
                  </div>
                </div>
                
                <Carousel v-if="item.imageUrlList && item.imageUrlList!==0">
                  <p class="mb-3">魚獲照片:</p>
                  <CarouselContent>
                    <CarouselItem v-for="(image,index) in item.imageUrlList" :key="image" class="md:basis-1/2 lg:basis-1/3" >
                      <img class="rounded-md" :src="image" :alt="item.title+index">
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
          <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[loading ? 'flex':'hidden']">
            <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
          </div>
          <MessageDialog class="z-1000" :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></messageDialog>
          <ReviewDialog :open="reviewDailog" @close="()=> {reviewDailog=false}" @addReview="addReview"></ReviewDialog>
        </DialogScrollContent>
    </DialogOverlay>
  </Dialog>
</template>