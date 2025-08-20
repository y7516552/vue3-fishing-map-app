import axios from 'axios';
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'


export const useFrontStore = defineStore('front', () => {
    const baseURL = import.meta.env.VITE_APP_API_URL

    const frontAPI = axios.create({
        baseURL,
        headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        },
    });

    const fishingSpotList = ref([])

    const getFishingSpotList = async () => {
        try {
            const { data } = await frontAPI.get(baseURL+"fishingSpot")
            fishingSpotList.value = data.result
        } catch (error) {
            console.error(error)
            toast.warning('資料取得失敗', {
                description: error,
        })
        }
    }

    const fishingTackleShopList = ref([])

    const getFishingTackleShopList = async () => {
        try {
            const { data } = await frontAPI.get(baseURL+"fishingTackleShop")
            fishingTackleShopList.value = data.result
        } catch (error) {
            console.error(error)
            toast.warning('資料取得失敗', {
                description: error,
            })
        }
    }

    const speciesList = ref([])

    const getSpeciesList = async () => {
        try {
            const { data } = await frontAPI.get(baseURL+"species")
            speciesList.value = data.result
        } catch (error) {
            console.error(error)
            toast.warning('資料取得失敗', {
                description: error,
            })
        }
    }

    return { fishingSpotList, fishingTackleShopList, speciesList, getFishingSpotList, getFishingTackleShopList, getSpeciesList }
})