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


import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'





const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const title = computed(()=>{
  let updateType ='新增'
  let typeName =''
  if(props.data._id) updateType ='修改'
  typeName ='物種'
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




const dataForm = {
  _id:z.optional(z.string()),
  CommonName:z.string(),
  ScientificName:z.string(),
  imageUrl:z.string().url(),
  fishDBUrl:z.string().url(),
  tags: z.array(z.string()).max(10),
}


const formSchema = toTypedSchema(z.object(dataForm))

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
      <DialogContent class="z-1000">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription></DialogDescription>
        <div :class="cn('flex flex-col gap-6')">
          <form @submit="onSubmit">

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