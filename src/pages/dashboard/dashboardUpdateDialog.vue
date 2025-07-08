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
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref, watch} from 'vue';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useRoute } from 'vue-router'

const route = useRoute()

const dataType = route.params.type

const props = defineProps(['openUpdateDialog','data'])
const emit = defineEmits(['close','updateItem'])

const title = ref(`新增 ${dataType}`)

const isOpen =ref(false)
watch(props,() =>{
  isOpen.value = false
  if(props.openUpdateDialog)isOpen.value = true
  if(props.data._id) title.value =`修改 ${dataType}`
})



const dataForm = {
  fishingTackleShop:{
    placesId:z.string(),
    address:z.string(),
    googleMapsUri:z.string().url(),
    name:z.string(),
    phone:z.string(),
    locations:{
      type: "Point",
      coordinates: z.array(z.bigint()).length(2),
    },
    city:z.string()
  },
  fishingSpot:{
    name:z.string(),
    description:z.string(),
    imageUrl:z.string().url(),
    imageUrlList:z.array(z.string().url()),
    type:z.string(),
    fishingAllowed: z.boolean(),
    locations:{
      type: "Point",
      coordinates:  z.array(z.bigint()).length(2),
    },
    city:z.string()
  },
  species:{
    CommonName:z.string(),
    ScientificName:z.string(),
    imageUrl:z.string().url(),
    fishDBUrl:z.string().url(),
  },
  report:{
    type:z.string(),
    title:z.string(),
    description:z.string(),
    imageUrlList:z.array(z.string().url()),
  }
}


const formSchema = toTypedSchema(z.object(dataForm[dataType]))

const form = useForm({
  validationSchema: formSchema,
})

const cityList = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]

const isLoading =ref(false)

const onSubmit = form.handleSubmit( (values) => {
  isLoading.value = true
  emit('updateItem',values)
})



</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogContent class="z-1000">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ props.data }}</DialogDescription>
        <div :class="cn('flex flex-col gap-6')">
          <form @submit.stop="onSubmit">
            <div v-if="dataType=='fishingTackleShop'" class="grid grid-cols-2 gap-6 ">
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="placesId">
                  <FormItem>
                    <FormLabel>PlacesId</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入PlacesId
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="address">
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入Address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="googleMapsUri">
                  <FormItem>
                    <FormLabel>GoogleMapsUri</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入GoogleMapsUri
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="googleMapsUri">
                  <FormItem>
                    <FormLabel>GoogleMapsUri</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入GoogleMapsUri
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="name">
                  <FormItem>
                    <FormLabel>店名</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入店名
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="phone">
                  <FormItem>
                    <FormLabel>phone</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入phone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="locations">
                  <FormItem>
                    <FormLabel>locations</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入locations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="city">
                  <FormItem>
                    <FormLabel>city</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="item in cityList" :key="item" :value="item">{{ item }}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      請輸入city
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
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