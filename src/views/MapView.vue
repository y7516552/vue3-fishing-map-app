<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";

const mapContainer = ref(null);

onMounted(() => {
  const map = L.map(mapContainer.value, {
    center: [23.611, 120.768],
    zoom: 8,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // L.marker
  const marker = L.marker([23.465766, 120.448608], {
    draggable: true,
  }).addTo(map);
  // 1. 直接在圖標上使用bindPopup()設定要顯示的內容
  marker.bindPopup("<b>Hello world!</b><br>I am a marker.").openPopup();

  // 2. 除了在圖標上顯示訊息，也可以在自己設定的經緯度顯示訊息
  L.popup().setLatLng([23.800424, 121.1187742]).setContent("I am a standalone popup.").openOn(map);

  // 地圖監聽事件
  const popup = L.popup();
  map.on("click", (e) => {
    console.log(e.latlng);
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
  });
});
</script>

<template>
    <div class="mapContainer" ref="mapContainer">

    </div>
</template>

<style>
.mapContainer{
    height: 90vh;
}
</style>


