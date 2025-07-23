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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'





const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const title = computed(()=>{
  let updateType ='新增'
  let typeName =''
  if(props.data._id) updateType ='修改'
  if(props.dataType=='fishingSpot') typeName ='釣點'
  if(props.dataType=='fishingTackleShop') typeName ='釣具店'
  if(props.dataType=='species') typeName ='物種'
  if(props.dataType=='report') typeName ='報告'
  return `${updateType} ${typeName}`
})

const isOpen =ref(false)

watch(props,() =>{
  isOpen.value = false
  if(props.openUpdateDialog)isOpen.value = true
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
    tags: z.array(z.string()).max(10),
  },
  report:{
    type:z.string(),
    title:z.string(),
    description:z.string(),
    imageUrlList:z.array(z.string().url()),
  }
}


const formSchema = toTypedSchema(z.object(dataForm[props.dataType]))

const  { handleSubmit ,setValues} = useForm({
  validationSchema: formSchema,
})

watch(props,() =>{
  if(props.data._id){
    setValues({...props.data})
  }
})

const cityList = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]

const isLoading =ref(false)


const onSubmit = handleSubmit((values) => {
  // isLoading.value = true
  emit('updateItem',values)
  // closeDialog()
})

const updateDialogState = (e) => {
    if(!e) {
      isOpen.value = e
      emit('close')
    }
}

const closeDialog = () => {
  isOpen.value = false
  emit('close')
}


</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogContent class="z-1000">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription></DialogDescription>
        <div :class="cn('flex flex-col gap-6')">
          <form @submit="onSubmit">

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


            <div v-if="dataType=='species'" class="grid grid-cols-1 gap-6 ">
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="CommonName">
                  <FormItem>
                    <FormLabel>俗名</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入物種俗名
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="ScientificName">
                  <FormItem>
                    <FormLabel>學名</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入物種學名
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="imageUrl">
                  <FormItem>
                    <FormLabel>圖片</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入圖片 Url
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              
              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="fishDBUrl">
                  <FormItem>
                    <FormLabel>資料連結</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入資料連結 Url
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="tags">
                  <FormItem>
                    <FormLabel>屬性</FormLabel>
                    <FormControl>
                      <TagsInput
                        :model-value="componentField.modelValue"
                        @update:model-value="componentField['onUpdate:modelValue']"
                      >
                        <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item">
                          <TagsInputItemText />
                          <TagsInputItemDelete />
                        </TagsInputItem>
            
                        <TagsInputInput placeholder="屬性..." />
                      </TagsInput>
                    </FormControl>
                    <FormDescription>
                      屬性
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
      </DialogContent>
    </DialogOverlay>
  </Dialog>
</template>