<script setup>
import { LoaderCircle} from 'lucide-vue-next'
import {
  Dialog,
  DialogOverlay,
  DialogScrollContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref, watch, computed} from 'vue';

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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const cityList = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]




const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const title = computed(()=>{
  let updateType ='新增'
  let typeName =''
  if(props.data._id) updateType ='修改'
  typeName ='釣具店'
  return `${updateType} ${typeName}`
})

const isOpen =ref(false)

watch(props,() =>{
  isOpen.value = false
  if(props.openUpdateDialog){
    isOpen.value = true
    isLoading.value = false
  }
})




const dataForm = z.object({
  _id:z.optional(z.string()),
  placesId:z.string(),
  address:z.string(),
  googleMapsUri:z.string().url(),
  name:z.string(),
  phone:z.optional(z.string()),
  locations:z.object({
    type: z.string().default("Point"),
    coordinates: z.array(z.number()).length(2),
  }),
  city:z.string()
})


const formSchema = toTypedSchema(dataForm)

const  { handleSubmit ,setValues,resetForm} = useForm({
  validationSchema: formSchema,
})

watch(props,() =>{
  if(props.data._id){
    setValues({...props.data})
  }
})


const isLoading =ref(false)


const onSubmit = handleSubmit((values) => {
  isLoading.value = true
  emit('updateItem',values)
  
  resetForm({
    values: {},
  });
})

const updateDialogState = (e) => {
    if(!e) {
      isOpen.value = e
      emit('close')
      resetForm({
        values: {},
      });
    }
}

const closeDialog = () => {
  isOpen.value = false
  emit('close')
  resetForm({
    values: {},
  });
}


</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogScrollContent class="z-1000 ">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ props.data }}
        </DialogDescription>
        <div :class="cn('flex flex-col gap-6 ')">
          <form @submit="onSubmit">

            <div v-if="dataType=='fishingTackleShop'" class="grid grid-cols-1 gap-6 ">

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
                <FormField v-slot="{ componentField }" name="locations.coordinates[0]">
                  <FormItem>
                    <FormLabel>經度</FormLabel>
                    <FormControl>
                      <Input type="number" step=0.0000000000000001  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入經度
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="locations.coordinates[1]">
                  <FormItem>
                    <FormLabel>緯度</FormLabel>
                    <FormControl>
                      <Input type="number" step=0.0000000000000001  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入緯度
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3 mb-3">

                <FormField v-slot="{ componentField }" name="city">
                  <FormItem>
                    <FormLabel>city</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇縣市" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent class="z-1000">
                         <SelectGroup>
                          <SelectItem v-for="item in cityList" :key="item" :value="item" >{{ item }}</SelectItem>
                         </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      請輸入城市
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              
           
            </div>

            <div class="flex justify-between">
              <Button  type="submit">送出</Button>
              <Button type="button"  variant="outline" @click="closeDialog">取消</Button>
            </div>

          </form>
          <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[isLoading ? 'flex':'hidden']">
            <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
          </div>
        </div>
      </DialogScrollContent>
    </DialogOverlay>
  </Dialog>
</template>