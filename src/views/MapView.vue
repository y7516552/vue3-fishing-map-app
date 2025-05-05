<script setup>
import MapPage from'../pages/map/mapPage.vue'
import MapSpotDialog from '../pages/map/mapSpotDialog.vue'

import { ref, provide } from 'vue'

const tempSpotData = ref({
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
const dailogOpen = ref(false)

provide('spotData', tempSpotData)
provide('dailogOpen', dailogOpen)

const getSpotData = (e) => {
  tempSpotData.value = e
  dailogOpen.value = true
}

</script>

<template>
  <div >
    <MapPage @openDailog="getSpotData"></MapPage>
    <MapSpotDialog></MapSpotDialog>
  </div>
</template>

<style>

</style>


