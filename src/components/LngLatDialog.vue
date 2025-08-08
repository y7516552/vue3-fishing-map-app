<script setup>
import L from "leaflet";
import { cn } from '@/lib/utils';
import { ref, watch, onMounted} from 'vue';

const props = defineProps(['data'])
const emit = defineEmits(['updateLngLat'])

const LngLat = ref([null,null])

watch(props,() =>{
  if(props.data[0]&&props.data[1]){
    LngLat.value = props.data
  }
})

const clickMap = (lng,lat) =>{
    LngLat.value=[lng,lat]
    emit('updateLngLat',LngLat.value)
}

const mapContainer = ref(null);

onMounted(() => {

    const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    const popup = L.popup();
    const marker1 = L.marker();
    const marker2 = L.marker();
    let center = [23.611, 120.768]
    if(props.data[0]&&props.data[1]) {
    center = [props.data[1],props.data[0]]
  }


  const map = L.map(mapContainer.value, {
    center: center,
    zoom: 15,
    layers:[OpenStreetMap],
    zoomControl: false
  });

  L.control.zoom({
    position: 'bottomright',
    zoomInText: '+',
    zoomInTitle: '放大',
    zoomOutText: '-',
    zoomOutTitle: '縮小'
  }).addTo(map);

  if(props.data[0]&&props.data[1]) {
    marker2.setLatLng([props.data[1],props.data[0]]).addTo(map);
  }
  

  map.on("click", (e) => {
    marker2.remove()
    let lat = e.latlng.lat; // 緯度
    let lng = e.latlng.lng; // 經度

    clickMap(lng,lat)

    popup
      .setLatLng(e.latlng)
      .setContent(`緯度：${lat}<br/>經度：${lng}<br/>`)
      .openOn(map);

    marker1.setLatLng(e.latlng).addTo(map)
  });

})





</script>

<template>
    <div :class="cn('flex flex-col gap-6')">
        <div class="">
            <div class="dialog-map-container" ref="mapContainer"></div>
        </div>
    </div>
  
</template>



<style>
.dialog-map-container{
    height: 90vh;
    width: 100%;
}

</style>