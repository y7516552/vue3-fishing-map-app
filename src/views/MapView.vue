<script setup>
import axios from 'axios';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";


const mapContainer = ref(null);

const fishingSpotList = ref([]);

const getfishSpot = async() => {
  try{
    let apiUrl = 'http://localhost:3000/api/v1/fishingSpot'
    const { data } = await axios.get(apiUrl)
    
    fishingSpotList.value = data.result
  
    console.log('getfishSpot',fishingSpotList.value)
  }catch(err) {
    console.log( err)
  }
    
  
}
// const shrimpingSpotList = ref([]);
// const fishingTackleShopList =ref([])
// getfishSpot()


onMounted( async() => {
  await getfishSpot()
  const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })

  const map = L.map(mapContainer.value, {
    center: [23.611, 120.768],
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


  var baseMaps = {
    "OpenStreetMap": OpenStreetMap,
    "Esri_WorldImagery": Esri_WorldImagery
  };

  // function initSpot(e) {
  //   if (e.length === 0 ) return
  //   let spotList = []
  //   e.forEach(item => {
  //     spotList.push( L.marker(item.latlng).bindPopup(item.title))
  //   })

  // }
  // var crownHill = L.marker([24.17859, 120.629218]).bindPopup('這是釣點1'),
  //   rubyHill = L.marker([24.175598, 120.626729]).bindPopup('這是釣點2');

  let SpotList = []

  console.log('fishingSpotList.value',fishingSpotList.value)

  fishingSpotList.value.forEach(item => {
      console.log('item',item)
      let spotMarker = L.marker(item.locations.coordinates.reverse()).bindPopup(item.name)
      SpotList.push(spotMarker)
    });
    
  var fishingSpot = L.layerGroup(SpotList);

  console.log('fishingSpot',fishingSpot)


  var overlayMaps = {
    "釣點": fishingSpot,
    // "釣具店":[],
    // "釣蝦場":[],
    // "釣魚池":[]
  };

  L.control.layers(baseMaps,overlayMaps).addTo(map);

  // L.marker
  // const marker = L.marker([23.465766, 120.448608], {
  //   draggable: true,
  // }).addTo(map);
  // 1. 直接在圖標上使用bindPopup()設定要顯示的內容
  // marker.bindPopup("<b>Hello world!</b><br>I am a marker.").openPopup();

  // 2. 除了在圖標上顯示訊息，也可以在自己設定的經緯度顯示訊息
  // L.popup().setLatLng([23.800424, 121.1187742]).setContent("I am a standalone popup.").openOn(map);

  // 地圖監聽事件
  const popup = L.popup();
  map.on("click", (e) => {
    // console.log(e.latlng);

    let lat = e.latlng.lat; // 緯度
    let lng = e.latlng.lng; // 經度

    popup
      .setLatLng(e.latlng)
      .setContent(`緯度：${lat}<br/>經度：${lng}<br/>[ ${lng},${lat} ]`)
      .openOn(map);
  });

  map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});

  function onLocationFound(e) {
    // console.log(e)
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);
});
</script>

<template>
    <div class="mapContainer" ref="mapContainer">

    </div>
</template>

<style>
.mapContainer{
    height: 90vh;
    width: 100%;
}
</style>


