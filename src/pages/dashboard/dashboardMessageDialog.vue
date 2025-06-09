<script setup>
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {  ref, watch } from 'vue';

const props = defineProps(['data','open'])
const emit = defineEmits(['close','deleteItem'])
const isOpen =ref(false)
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
</script>

<template>
  <AlertDialog v-model:open="isOpen" @update:open="updateState" class="z-1000">
    <AlertDialogContent class="z-1000 bg-red-200">
      <AlertDialogHeader>
        <AlertDialogTitle>刪除 {{ props.data.item.name }}?</AlertDialogTitle>
        <AlertDialogDescription>
          確定要刪除
          {{ props.data.item.name }}?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="emit('deleteItem')" class="bg-red-500">刪除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>