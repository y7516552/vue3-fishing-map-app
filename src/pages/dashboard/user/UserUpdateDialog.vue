<script setup>
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { ref, watch, computed} from 'vue';






const props = defineProps(['openUpdateDialog','dataType','data'])
const emit = defineEmits(['close','updateItem'])

const title = computed(()=>{
  let updateType ='新增'
  let typeName ='使用者'
  if(props.data._id) updateType ='修改'
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





const isLoading =ref(false)




const updateDialogState = (e) => {
    if(!e) {
      isOpen.value = e
      emit('close')
      
    }
}



</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="updateDialogState" >
    <DialogOverlay  class="z-1000">
      <DialogContent class="z-1000">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>使用者資料</DialogDescription>
        <div class="flex flex-col gap-6">
          <div class="grid gap-3">
            {{props.data.name}}
          </div>
          <div class="grid gap-3">
            {{props.data.phone}}
          </div>
          <div class="grid gap-3">
            {{props.data.email}}
          </div>
          <div class="grid gap-3">
            <div class="w-[200px]">
                <AspectRatio :ratio="16 / 9">
                  <img loading="lazy" :src="props.data.avatarUrl" :alt="props.data.name" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
          </div>
        </div>
        
      </DialogContent>
    </DialogOverlay>
  </Dialog>
</template>