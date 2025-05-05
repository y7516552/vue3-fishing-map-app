<script setup>
import axios from 'axios';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";
// import hookIcon  from "../assets/fishing.svg"
import fishFillIcon  from "../../assets/fish-fill-food.svg"

const mapContainer = ref(null);

const fishingSpotList = ref([]);

const fishingSpotDetiles = ref({});

const emit = defineEmits(['openDailog'])

const getfishSpot = async() => {
  try{
    let apiUrl = 'http://localhost:3000/api/v1/fishingSpot'
    const { data } = await axios.get(apiUrl)
    
    fishingSpotList.value = data.result
  
  }catch(err) {
    console.log( err)
  }
    
  
}
// const shrimpingSpotList = ref([]);
// const fishingTackleShopList =ref([])



onMounted( async() => {
  await getfishSpot()

  const fishingIcon = L.icon({
    iconUrl: fishFillIcon,
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
    // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })

  const Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});


  var baseMaps = {
    "OpenStreetMap": OpenStreetMap,
    "Esri_WorldImagery": Esri_WorldImagery,
    "Stadia_OSMBright":Stadia_OSMBright
  };

  let SpotList = []

  console.log('fishingSpotList.value',fishingSpotList.value)

//   const popupTemplate = (item) => {
//     return`
//             <div class="p-0 mb-2">
//               <img class="w-full" src="${item.imageUrl}" alt="${item.name}">
//             </div>
//             <div class="flex flex-col gap-y-1.5 p-1">
//               <h3 class="text-2xl font-semibold leading-none tracking-tight">${item.name}</h3>
//               <p class="text-sm text-muted-foreground">${item.description}</p>
//             </div>
//             <div class="items-center p-6 pt-0 flex justify-between px-6 pb-6">
//               <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"> 
//                 釣點詳細 
//               </button>
//               <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Deploy</button>
//             </div>
//             `
//   }

  fishingSpotList.value.forEach(item => {
      let spotMarker = L.marker(item.locations.coordinates.reverse(),{icon:fishingIcon})
    //   .bindPopup(popupTemplate(item),{minWidth:400,maxWidth:600,maxHeight:160,offset:[100,200]})
      .on('click', function() {
        fishingSpotDetiles.value = item
        emit('openDailog', item)
    });
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

  const map = L.map(mapContainer.value, {
    center: [23.611, 120.768],
    zoom: 15,
    layers:[OpenStreetMap,fishingSpot],
    zoomControl: false
  });

  L.control.zoom({
    position: 'bottomright',
    zoomInText: '+',
    zoomInTitle: '放大',
    zoomOutText: '-',
    zoomOutTitle: '縮小'
  }).addTo(map);

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
    console.log(e)
    // var radius = e.accuracy;

    // L.marker(e.latlng).addTo(map)
        // .bindPopup("You are within " + radius + " meters from this point").openPopup();

    // L.circle(e.latlng, radius).addTo(map);
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
.fishing-spot-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>


