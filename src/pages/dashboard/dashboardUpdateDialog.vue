<script setup>
import { LoaderCircle} from 'lucide-vue-next'
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref } from 'vue';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const props = defineProps(['openUpdateDialog','dataType','data'])

const dataForm = {
  fishingTackleShop:{
    placesId:"",
    address:"",
    googleMapsUri:"",
    name:"",
    phone:"",
    locations:{
      type: "Point",
      coordinates: [0,0],
    },
    city:""
  },
  fishingSpot:{},
  species:{},
  report:{}
}


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
    // await login(values)
    
    emit('loginSubmitted',values)
    isLoading.value = false
  }catch(error){
    emit('loginFail',error)
    isLoading.value = false
  }
})



</script>

<template>
  <Dialog v-model:open="openDialog" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogContent class="z-1000">
        <DialogTitle>登入</DialogTitle>
        <DialogDescription></DialogDescription>
        <div :class="cn('flex flex-col gap-6')">
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
                <Button variant="outline" class="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
          <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[isLoading ? 'flex':'hidden']">
            <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  </Dialog>
</template>