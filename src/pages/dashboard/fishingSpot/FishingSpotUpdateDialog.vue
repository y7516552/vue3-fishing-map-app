<script setup>
import { LoaderCircle, MapPin} from 'lucide-vue-next'
import {
  Dialog,
  DialogOverlay,
  DialogScrollContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
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
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"

import { storage } from '@/firebase/index';
import { ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'
import LngLatDialog from '@/components/LngLatDialog.vue';

const cityList = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]

const typeList = ["溪流","湖泊","池塘","堤防","港口","沙灘","河口","管理池","休閒池","海釣場","蚵棚"]



const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const title = computed(()=>{
  let updateType ='新增'
  let typeName =''
  if(props.data._id) updateType ='修改'
  typeName ='釣點'
  return `${updateType} ${typeName}`
})

const isOpen =ref(false)
const isUpdate =ref(false)


watch(props,() =>{
  isOpen.value = false
  if(props.openUpdateDialog){
    isOpen.value = true
    isLoading.value = false
  }
})



const selectedFile = ref()
const downloadURL = ref();
const uploadProgress = ref(null);


const dataForm = z.object({
  _id:z.optional(z.string()),
  name:z.string(),
  description:z.string(),
  type:z.optional(z.string()),
  imageUrl: z.optional(z.string()),
  locations:z.object({
    type: z.string().default("Point"),
    coordinates: z.array(z.number()).length(2),
  }),
  city:z.string(),
  fishingAllowed: z.boolean(),
    
})


const formSchema = toTypedSchema(dataForm)

const  { handleSubmit ,setValues,resetForm , setFieldValue} = useForm({
  validationSchema: formSchema,
  initialValues: {
    fishingAllowed: true,
  },
})

watch(props,() =>{
  if(props.data._id){
    setValues({...props.data})
     if(props.data.imageUrl) downloadURL.value = props.data.imageUrl
  }else{
    isUpdate.value = true
  }
})

const handleFileUpload = async(e) => {
  selectedFile.value = e.target.files[0];
}

const upload = () => {
  if (!selectedFile.value) {
    return;
  }
  
  const storageName = storageRef(storage, `images/fishingSpot/${selectedFile.value.name}`);

  const uploadTask = uploadBytesResumable(storageName, selectedFile.value);

  uploadTask.on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploadProgress.value = parseInt(progress); // 將進度以整數寫入
    },
    error => {
      console.log('Upload error', error);
    },
    async () => {
      downloadURL.value = await getDownloadURL(uploadTask.snapshot.ref); //取得圖片url
      uploadProgress.value = null; // 進度條清空
      selectedFile.value = ''; // 清空input
    }
  );
};

const removeImg = async fullPath => {
  try {
    await deleteObject(storageRef(storage, fullPath));
    selectedFile.value = ''
    downloadURL.value=''
  } catch (error) {
    console.error('Error deleting image', error);
  }
};


const isLoading =ref(false)


const onSubmit = handleSubmit((values) => {
  isLoading.value = true
  if(downloadURL.value) values.imageUrl = downloadURL.value
  isUpdate.value = false
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


const openLngLatDialog = ref(false)
const lnglat = ref([])
const updateLngLat = (data) => {
  lnglat.value = data
  setFieldValue("locations.coordinates",data)
}

</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogScrollContent class="z-1000 ">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
        </DialogDescription>
        <div :class="cn('flex flex-col gap-6 ')">
          <form @submit="onSubmit">

            <div v-if="dataType=='fishingSpot'" class="grid grid-cols-1 gap-6 ">

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="name">
                  <FormItem>
                    <FormLabel>釣點名稱</FormLabel>
                    <FormControl>
                      <Input type="text"  v-bind="componentField" required/>
                    </FormControl>
                    <FormDescription>
                      請輸入釣點名稱
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3">
                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel>釣點描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="請輸入描述"
                        class="resize-none"
                        v-bind="componentField"
                      ></Textarea>
                    </FormControl>
                    <FormDescription>
                      請輸入釣點描述
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3 mb-3">

                <FormField v-slot="{ componentField }" name="type">
                  <FormItem>
                    <FormLabel>類型</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent class="z-1000">
                         <SelectGroup>
                          <SelectItem v-for="item in typeList" :key="item" :value="item" >{{ item }}</SelectItem>
                         </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      選擇釣點類型
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid gap-3 mb-3">

                <FormField v-slot="{ componentField }" name="city">
                  <FormItem>
                    <FormLabel>縣市</FormLabel>
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

              
              <div class="mb-3">
                <div v-if="!isUpdate" >
                  <p class="text-base">圖片</p>
                  <div class="w-[300px] h-[200px]">
                    <AspectRatio v-for="item in props.data.imageUrlList" :key="item" :ratio="16 / 9">
                      <img :src="item" alt="Image" class="rounded-md object-cover w-full h-full">
                    </AspectRatio>
                  </div>
                </div>
                
                <FormField v-else  v-slot="{ componentField }" name="imageList"  >
                  <FormItem>
                    <FormLabel>圖片</FormLabel>
                    <FormControl>
                      <Input id="picture"  @change="handleFileUpload" type="file" />
                      <Button v-if="!downloadURL" type="button" @click="upload">
                        上傳圖片
                      </Button>
                
                      <div v-if="downloadURL" class="flex gap-1 items-center mt-2">
                        <div class="w-[300px] h-[200px]">
                          <AspectRatio :ratio="16 / 9">
                            <img :src="downloadURL" alt="Image" class="rounded-md object-cover w-full h-full">
                          </AspectRatio>
                        </div>
                        <Button  variant="destructive"  type="button" @click="removeImg(downloadURL)">
                          刪除
                        </Button>
                      </div>
                      <p v-else >圖片顯示於此</p>
                      <div v-if="uploadProgress !== null">
                        <Progress :model-value="uploadProgress" />
                      </div>
                      <Input class="hidden" type="text"  v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                  
              </div>
                

              <div class="">
                <Button type="button" @click="openLngLatDialog=true"> 
                  <MapPin />
                  從地圖選取
                </Button>
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

              <div class="grid gap-3">
                <FormField v-slot="{ value, handleChange }" name="fishingAllowed">
                  <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div class="space-y-0.5">
                      <FormLabel class="text-base">
                        允許釣魚?
                      </FormLabel>
                      <FormDescription>
                        如果非法定禁釣區請選"是"
                        如果為法定禁釣區請選"否"
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        :model-value="value"
                        @update:model-value="handleChange"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
           
            </div>

            <div class="flex justify-between mt-3">
              <Button  type="submit">送出</Button>
              <Button type="button"  variant="outline" @click="closeDialog">取消</Button>
            </div>

          </form>
          <div class="loading bg-gray-800 opacity-50 absolute bottom-0 left-0 w-full h-full  justify-center items-center " :class="[isLoading ? 'flex':'hidden']">
            <LoaderCircle size="128" color="white" class="mr-3 animate-spin"/>
          </div>
          <Dialog v-model:open="openLngLatDialog" >
            <DialogOverlay  class="z-1000">
              <DialogScrollContent class="z-1000 ">
                <DialogTitle>修改經緯度</DialogTitle>
                <DialogDescription>
                  <div class="flex justify-between items-center">

                    <div v-if="lnglat" >
                      <p>
                        經度：{{ lnglat[0] }}
                      </p>
                      <p>
                        緯度：{{ lnglat[1] }}
                      </p>
                    </div>
                    <DialogClose as-child>
                      <Button :disabled="!lnglat" type="button" class="bg-blue-500 text-white hover:bg-blue-600">
                        確定
                      </Button>
                    </DialogClose>
                  </div>
                </DialogDescription>

                 <LngLatDialog  :data="lnglat" @updateLngLat="updateLngLat"></LngLatDialog>
              </DialogScrollContent>
            </DialogOverlay>
          </Dialog>
        </div>
      </DialogScrollContent>
    </DialogOverlay>
  </Dialog>
</template>