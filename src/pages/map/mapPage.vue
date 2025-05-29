<script setup>
import axios from 'axios';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref, watch } from "vue";
// import hookIcon  from "../assets/fishing.svg"
import fishFillIcon  from "../../assets/fish-fill-food.svg"
import storeIcon from '../../assets/store.svg'
import { toast } from 'vue-sonner'

const mapContainer = ref(null);

const fishingSpotList = ref([]);
const filteredSpotList = ref([]);

const fishingSpotDetiles = ref({});

const emit = defineEmits(['openDailog','updateDailog'])

const props = defineProps(['spotId','updateSpot'])


const getfishSpot = async() => {
  try{
    let apiUrl = 'http://localhost:3000/api/v1/fishingSpot'
    const { data } = await axios.get(apiUrl)
    
    fishingSpotList.value = data.result
  
  }catch(error) {
    console.log( error)
    toast.warning('資料取得失敗', {
      description: error,
    })
  }
    
  
}

const fishingTackleShopList = ref([])

const  getFishingTackleShops = async () => {
    try {
      let apiUrl = 'http://localhost:3000/api/v1/fishingTackleShop'
      const { data } = await axios.get(apiUrl)
        

        fishingTackleShopList.value = data.result

    } catch (error) {
        console.log(error)
        toast.warning('資料取得失敗')
    }
      
    

  }





watch(() => props.updateSpot,async (newVal,oldVal) => {
  
  await getfishSpot()

  console.log('spotById update',props.spotId)
  console.log('newVal',newVal,oldVal)

  const spot = fishingSpotList.value.find(e => e._id == newVal)
  fishingSpotDetiles.value = spot
})

const coordinateDistance = (lat1, lon1, lat2, lon2) => {
  // Convert degrees to radians
  const radLat1 = lat1 * Math.PI / 180;
  const radLon1 = lon1 * Math.PI / 180;
  const radLat2 = lat2 * Math.PI / 180;
  const radLon2 = lon2 * Math.PI / 180;
  // Radius of the Earth in meters
  const R = 6_371_000; // m
  // Differences in coordinates
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2); // Return distance rounded to 2 decimal places
};

const filterSpot = (center) => {
  let newList = fishingSpotList.value.map(spot => {
    let distance = coordinateDistance(spot.locations.coordinates[0],spot.locations.coordinates[1],center.lat,center.lng)
    return {...spot,distance}
  })
  newList.sort((x,y) => x.distance - y.distance)
  if(newList.length<20){
    filteredSpotList.value = newList
  }else{
    filteredSpotList.value = newList.slice(0,21)
  }
  // console.log('filteredSpotList',filteredSpotList.value)
}


onMounted( async() => {
  await getfishSpot()
  await getFishingTackleShops()

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

  const fishingStore = L.icon({
    iconUrl: storeIcon,
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

  // console.log('fishingSpotList.value',fishingSpotList.value)

  


  fishingSpotList.value.forEach(item => {
      let spotMarker = L.marker(item.locations.coordinates.reverse(),{icon:fishingIcon})
    //   .bindPopup(popupTemplate(item),{minWidth:400,maxWidth:600,maxHeight:160,offset:[100,200]})
      .on('click', function() {
        fishingSpotDetiles.value = item
        emit('openDailog', item)
    });
      SpotList.push(spotMarker)
  });
    
  const fishingSpot = L.layerGroup(SpotList);

  let StoreList = []
  fishingTackleShopList.value.forEach(item => {
      let spotMarker = L.marker(item.locations.coordinates.reverse(),{icon:fishingStore})
      .bindPopup(
        `
        <p class="text-xl font-bold mb-4">${item.name}</P>
          <p class="my-1">電話: ${item.phone}</p>
          <p class="my-1">地址: ${item.address}</p>
          <p class="my-1">Google map: <a href="${item.googleMapsUri}" target="_blank" >連結</a></p>
        `,
        {minWidth:400,maxWidth:600,maxHeight:160,offset:[100,200]}
      )
      .on('click', function() {
        // fishingSpotDetiles.value = item 
        // emit('openDailog', item)
      });
      StoreList.push(spotMarker)
  });

  const fishingTackleShop = L.layerGroup(StoreList);

  // console.log('fishingTackleShopList.value',fishingTackleShopList.value)


  var overlayMaps = {
    "釣點": fishingSpot,
    "釣具店":fishingTackleShop,
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

  // function onLocationFound(e) {
  //   // console.log(e)
  //   // var radius = e.accuracy;

  //   // L.marker(e.latlng).addTo(map)
  //       // .bindPopup("You are within " + radius + " meters from this point").openPopup();

  //   // L.circle(e.latlng, radius).addTo(map);
  // }

    // map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);

    function onMoveend(){
      filterSpot(map.getCenter())
    }
    map.on('moveend',onMoveend)
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


