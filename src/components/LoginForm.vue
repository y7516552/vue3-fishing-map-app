<script setup>
import axios from 'axios'
import { LoaderCircle} from 'lucide-vue-next'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useUserStore }from'../stores/user'
import {  ref,onMounted } from 'vue';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const CLIENT_URL = import.meta.env.VITE_GOOGLE_CLIENT_URL
const API_URL = import.meta.env.VITE_APP_API_URL + "user/google/verify-token"

const isLoading = ref(false)

const store = useUserStore()
const { login, googleLogin } = store

const emit = defineEmits(['loginSubmitted','loginFail'])
const props = defineProps({
  class: { type: null, required: false },
});

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password:z.string().min(8).max(12)
}))

const form = useForm({
  validationSchema: formSchema,
})



const onSubmit = form.handleSubmit( async (values) => {
  isLoading.value = true
  try{
    await login(values)
    
    emit('loginSubmitted',values)
    isLoading.value = false
  }catch(error){
    emit('loginFail',error)
    isLoading.value = false
  }
})

const onLogin = async (res) => {
  isLoading.value = true
  const axiosOptions = {
    headers: { "Access-Control-Allow-Origin": CLIENT_URL },
  };
  try {
    const response = await axios.post(API_URL, res, axiosOptions);
    await googleLogin(response.data)
    emit('loginSubmitted')
  } catch (error) {
    emit('loginFail',error)
  }finally {
    isLoading.value = false
  }
};

  

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID, // required
    callback: onLogin, // invoke while user login in the popup
    cancel_on_tap_outside: true, // optional
    context: "signin", // optional
  });
  window.google.accounts.id.renderButton(
    document.getElementById("googleButton"),
    { theme: "outline", size: "large" } // customization attributes
  );
  // window.google.accounts.id.prompt(); // show one-tap popup
  
})
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <form @submit.stop="onSubmit">
      <div class="flex flex-col gap-6">
        <div class="grid gap-3">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="m@example.com" v-bind="componentField" required/>
              </FormControl>
              <FormDescription>
                請輸入Email
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid gap-3">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password"  v-bind="componentField" required/>
              </FormControl>
              <FormDescription>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
            </FormField>
        </div>
        <div class="flex flex-col gap-3">
          <Button type="submit" class="w-full"> Login </Button>
          <!-- <Button id="googleButton"  type="button" variant="outline" class="w-full">
            Login with Google
          </Button> -->
          <button id="googleButton" type="button">google</button>
        </div>
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a href="#" class="underline underline-offset-4"> Sign up </a>
      </div>
    </form>
    <!-- <button id="googleButton" type="button">google</button> -->
    <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[isLoading ? 'flex':'hidden']">
      <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
    </div>
  </div>
</template>
