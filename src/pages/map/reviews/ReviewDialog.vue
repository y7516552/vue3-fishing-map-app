<script setup >
import axios from 'axios';
import { toTypedSchema } from '@vee-validate/zod'
import { ref, watch ,computed, onBeforeMount} from 'vue' 
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
import { useFilter } from "reka-ui"
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from "@/components/ui/tags-input"
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { storage } from '@/firebase/index';
import { ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { AspectRatio } from '@/components/ui/aspect-ratio'

//catchs
const speciesList= ref([])

const getSpeciesList = async () => {
  try {
    const baseApiUrl=import.meta.env.VITE_APP_API_URL
    const response = await axios.get(`${baseApiUrl}species`);
    speciesList.value = response.data.result;
  } catch (error) {
    console.error('Error fetching species list:', error);
  }
};

onBeforeMount(() => {
  getSpeciesList()
})


const modelValue = ref([])

const openTagInput = ref(false)

const searchTerm = ref("")

const { contains } = useFilter({ sensitivity: "base" })


const filteredspeciesList = computed(() => {
  const options = speciesList.value.filter(i => !modelValue.value.includes(i.CommonName))
  return searchTerm.value ? options.filter(option => contains(option.CommonName, searchTerm.value)) : options
})


const props = defineProps(['open'])
const emit = defineEmits(['close','addReview'])

const isOpen = ref(false)

const selectedFile = ref()
const downloadURL = ref();

const handleFileUpload = async(e) => {
  console.log("selected file",e.target.files[0])
  selectedFile.value = e.target.files[0];
  //Upload to server
}

const upload = () => {
  if (!selectedFile.value) {
    return;
  }
  
  const storageName = storageRef(storage, `images/${selectedFile.value.name}`);

  const uploadTask = uploadBytesResumable(storageName, selectedFile.value);

  uploadTask.on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      console.log('Upload state ', snapshot.state);
      // uploadProgress.value = parseInt(progress); // 將進度以整數寫入
    },
    error => {
      console.log('Upload error', error);
    },
    async () => {
      downloadURL.value = await getDownloadURL(uploadTask.snapshot.ref); //取得圖片url
      console.log('File available at', downloadURL.value);
      // uploadProgress.value = null; // 進度條清空
      // fileInput.value.value = ''; // 清空input
      selectedFile.value = ''; // 清空input
    }
  );
};

const removeImg = async fullPath => {
  try {
    await deleteObject(storageRef(storage, fullPath));
  } catch (error) {
    console.error('Error deleting image', error);
  }
};



watch(props,() =>{
    isOpen.value = false
    if(props.open)isOpen.value = true
})
const updateState = (e) => {
    if(!e) {
        isOpen.value = e
        emit('close')
    }
}

const formSchema = toTypedSchema(z.object({
  _id:z.optional(z.string()),
  fishingSpotId:z.string(),
  title:z.string(),
  description:z.string(),
  imageUrl:z.optional(z.string()),
  imageUrlList:z.optional(z.string()),
  catchs:z.string(),
  rating:z.string(),
  bait:z.string()
}))

function onSubmit(values) {
    isOpen.value = false
    console.log('onSubmit',values)
    emit('addReview',values)
}



</script>

<template>
  <Form  v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema" >
    <Dialog v-model:open="isOpen" @update:open="updateState" class="z-1000">
      <DialogContent class="sm:max-w-[425px] z-1000">
        <DialogHeader>
          <DialogTitle>評論</DialogTitle>
          <DialogDescription>
            請寫下對此釣點的評論
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          
    
          <div class="mb-3">
            <FormField v-slot="{ componentField }" name="title"  class="mb-3">
              <FormItem v-auto-animate>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="請輸入標題" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  例如:XX月XX日釣遊感想
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
                  請簡短描述釣遊過程或釣況
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="mb-3">
            <FormField v-slot="{ componentField }" name="bait"  class="mb-3">
              <FormItem v-auto-animate>
                <FormLabel>餌料</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="請輸入餌料" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  例如:粉餌、活餌、假餌等
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="mb-3">

            <FormField v-slot="{ componentField }" name="catchs">
              <FormItem>
                <FormLabel>漁獲種類</FormLabel>
                <FormControl>

                  <Combobox v-bind="componentField" v-model="modelValue" v-model:open="openTagInput" :ignore-filter="true">
                    <ComboboxAnchor as-child>
                      <TagsInput v-model="modelValue" class="px-2 gap-2 w-80">
                        <div class="flex gap-2 flex-wrap items-center">
                          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
                            <TagsInputItemText />
                            <TagsInputItemDelete />
                          </TagsInputItem>
                        </div>
                
                        <ComboboxInput v-model="searchTerm" as-child>
                          <TagsInputInput placeholder="漁獲種類..." class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto" @keydown.enter.prevent />
                        </ComboboxInput>
                      </TagsInput>
                
                      <ComboboxList class="w-[--reka-popper-anchor-width] z-1200">
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem
                            v-for="species in filteredspeciesList" :key="species._id" :value="species.CommonName"
                            @select.prevent="(ev) => {
                              if (typeof ev.detail.value === 'string') {
                                searchTerm = ''
                                modelValue.push(ev.detail.value)
                              }

                              if (speciesList.length === 0) {
                                openTagInput = false
                              }
                            }"
                          >
                            {{ species.CommonName }}
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxAnchor>
                  </Combobox>
                </FormControl>
                <FormDescription>
                  請輸入漁獲種類
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          

          <div class="mb-3">
            <Label for="picture">圖片</Label>
            <Input id="picture" @change="handleFileUpload" type="file" accept="image/*"/>
            <Button type="button" @click="upload">
              上傳圖片
            </Button>

            <Button  variant="destructive"  type="button" @click="removeImg(downloadURL)">
              刪除
            </Button>

            <div v-if="downloadURL" class="flex content-center">
              <div class="w-[300px] h-[200px]">
                <AspectRatio :ratio="16 / 9">
                  <img loading="lazy" :src="downloadURL" alt="Image" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
            </div>

            <p v-else >圖片顯示於此</p>
           
              
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