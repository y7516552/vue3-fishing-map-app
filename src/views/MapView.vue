<script setup>
import MapPage from'../pages/map/mapPage.vue'
import MapSpotDialog from '../pages/map/mapSpotDialog.vue'

import { ref, provide } from 'vue'

const tempSpotData = ref({
  _id:'',
  name:'',
  description:'',
  imageUrl:'',
  imageUrlList:[],
  type:'',
  fishingAllowed:true,
  locations:{},
  reviews:[],
  catchs:[]
})

const updateSpot = ref(false)

const dailogOpen = ref(false)

provide('spotData', tempSpotData)
provide('dailogOpen', dailogOpen)



const getSpotData = (e) => {
  updateSpot.value = false
  tempSpotData.value = e
  dailogOpen.value = true
}
const updateDailog = (e) => {
  updateSpot.value = false
  tempSpotData.value = e
}

const like = (e) => {
  updateSpot.value = true
  console.log('like',e)
}

const dislike = (e) => {
  updateSpot.value = true
  console.log('dislike',e)
}

</script>

<template>
  <div >
    <MapPage @openDailog="getSpotData" @updateDailog="updateDailog" :spotId ="tempSpotData._id" :updateSpot="updateSpot"></MapPage>
    <MapSpotDialog @likeSpot="like" @dislikeSpot="dislike" ></MapSpotDialog>
  </div>
</template>

<style>

</style>


