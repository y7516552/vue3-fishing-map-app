import axios from 'axios';
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'


export const useUserStore = defineStore('user', () => {

  const cookies = useCookies(['fishingMap'])
  const token = cookies.token

  const userAPI = axios.create({
    baseURL: "http://localhost:3000/api/v1/user",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      Authorization:`${token}`
    },
  });

  
  const userData = ref({})


    async function check() {
      try{
        const { data } = await userAPI.get("/check")
        console.log('check',data)
      }catch(err) {
        console.log( err)
      }
    }

  return { userData,check }
})
