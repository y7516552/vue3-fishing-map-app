<script setup >
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { storage } from '@/firebase/index';
import { ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'

const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const isOpen = ref(false)
const isUpdate =ref(false)

const selectedFile = ref()
const downloadURL = ref();
const uploadProgress = ref(null);



const dataForm = {
  _id:z.optional(z.string()),
  type:z.string(),
  title:z.string(),
  description:z.string(),
  imageList: z.optional(z.array(z.string())),
  status:z.optional(z.number())
}

const formSchema = toTypedSchema(z.object(dataForm))

const  { handleSubmit ,setValues } = useForm({
  validationSchema: formSchema,
})

watch(props,() =>{
  if(props.data._id){
    isUpdate.value = false
    setValues({...props.data})
    if(props.data.imageUrlList) downloadURL.value = props.data.imageUrlList[0]
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
  
  const storageName = storageRef(storage, `images/report/${selectedFile.value.name}`);

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

const typeList = [
  {
    name:'資料勘誤',
    value:'data'
  },
  {
    name:'建議',
    value:'suggestion'
  },
  {
    name:'錯誤回報',
    value:'error'
  }
]

watch(props,() =>{
    isOpen.value = false
    if(props.openUpdateDialog){
    isOpen.value = true
  }
})
const updateState = (e) => {
    if(!e) {
        isOpen.value = e
        selectedFile.value = ''
        downloadURL.value=''
        isUpdate.value = false
        emit('close')
    }
}



const onSubmit = handleSubmit((values) =>{
    isOpen.value = false
    if(downloadURL.value) values.imageList = [downloadURL.value]

    isUpdate.value = false
    emit('updateItem',values)
})
</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateState">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>回報</DialogTitle>
        <DialogDescription>
        </DialogDescription>
      </DialogHeader>

      <form  @submit="onSubmit">
        <div class="mb-3">
          <div v-if="!isUpdate" class="">
            <p class="text-base">類型</p>
            <p class="font-bold text-lg">{{ props.data.type  }}</p>
          </div>
          <FormField v-else v-slot="{ componentField }" name="type"  class="mb-3">
            <FormItem>
              <FormLabel>類型</FormLabel>
      
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇回報類型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in typeList" :key="item.value" :value="item.value">
                        {{item.name}}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          </FormField>
        </div>
        
        <div class="mb-3">
          <div v-if="!isUpdate" class="">
            <p class="text-base">標題</p>
            <p class="font-bold text-lg">{{ props.data.title  }}</p>
          </div>
          <FormField v-else v-slot="{ componentField }" name="title"  class="mb-3">
            <FormItem v-auto-animate>
              <FormLabel>標題</FormLabel>
              <FormControl>
                <Input type="text" placeholder="請輸入標題" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                例如:回報資料錯誤-釣點
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        
        <div class="mb-3">

          <div v-if="!isUpdate" class="">
            <p class="text-base">描述</p>
            <p class="font-bold text-lg">{{ props.data.description  }}</p>
          </div>

          <FormField v-else v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="請輸入描述"
                  class="resize-none"
                  v-bind="componentField"
                ></Textarea>
              </FormControl>
              <FormDescription>
                請具體描述要回報的問題
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        

        <div class="mb-3">
          <div v-if="!isUpdate" class="">
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
        <Button v-if="isUpdate" type="submit" >
          送出
        </Button>
      </form>

      <DialogFooter>
        <Button v-if="isUpdate&&props.data._id" type="button" @click="isUpdate=false">
          取消
        </Button>
        <Button v-if="!isUpdate&&props.data._id" type="button" @click="isUpdate=true">
          修改
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
</template>