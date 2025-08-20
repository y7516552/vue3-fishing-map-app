<script setup >
import { toTypedSchema } from '@vee-validate/zod'
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
  Form,
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

const props = defineProps(['open'])
const emit = defineEmits(['close','sendReport'])

const isOpen = ref(false)

const selectedFile = ref()
const downloadURL = ref();
const uploadProgress = ref(null);


const formSchema = toTypedSchema(z.object({
  type:z.string(),
  title:z.string(),
  description:z.string(),
  imageUrlList: z.optional(z.array(z.string())),
}))


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
    if(props.open)isOpen.value = true
})
const updateState = (e) => {
    if(!e) {
        isOpen.value = e
        selectedFile.value = ''
        downloadURL.value=''
        emit('close')
    }
}



function onSubmit(values) {
    isOpen.value = false
    if(downloadURL.value) values.imageUrlList = [downloadURL.value]

    
    emit('sendReport',values)
}
</script>

<template>
  <Form  v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
    <Dialog v-model:open="isOpen" @update:open="updateState">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>回報問題</DialogTitle>
          <DialogDescription>
            網站有任何問題都可以在這裡回報
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <div class="mb-3">
            <FormField v-slot="{ componentField }" name="type"  class="mb-3">
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
            <FormField v-slot="{ componentField }" name="title"  class="mb-3">
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

            <FormField v-slot="{ componentField }" name="description">
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
            
            <FormField v-slot="{ componentField }" name="imageList"  >
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
                        <img loading="lazy" :src="downloadURL" alt="Image" class="rounded-md object-cover w-full h-full">
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
            

        </form>

        <DialogFooter>
          <Button type="submit" form="dialogForm">
            送出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>