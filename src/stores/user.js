import axios from 'axios';
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import { toast } from 'vue-sonner'


export const useUserStore = defineStore('user', () => {

  const cookies = useCookies(['fishingMap'])
  const token = cookies.getAll().fishingMap
  const baseURL = "http://localhost:3000/api/v1/user"

  const userAPI = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      Authorization:`${token}`
    },
  });

  const isLogin = ref(false)
  const userData = ref({
    name:'',
    email:'',
    avatarUrl:'',
  })


  async function check() {
    try{
      if(!token) return
      await userAPI.get("/check")
      await getUserdata()
      isLogin.value = true
    }catch {
      isLogin.value = false
      cookies.remove('fishingMap')
    }
  }

  async function login(e) {
    try{
      const response = await axios.post(baseURL+"/login",e)


      cookies.set('fishingMap',response.data.token)
      userData.value = response.data.result
      isLogin.value = true
      toast.success('登入成功', {
        description: '歡迎回來',
      })

    }catch(error) {
      isLogin.value = false
      throw error
    }
  }

  async function signup(e) {
    try{
      const { data } = await axios.post("/signup",e)
      console.log('signup',data)
      // cookies.set('fishingMap',data)
    }catch(err) {
      console.log( err)
      isLogin.value = false
    }
  }

  function logout() {
    isLogin.value = false
    cookies.remove('fishingMap')
    toast.success('登出成功')
  }

  async function getUserdata() {
    try{
      const { data } = await userAPI.get("/me")
      userData.value = data.result
    }catch(err) {
      console.log( err)
    }
  }

  return {isLogin, userData, check, login, signup,logout,getUserdata}
})
