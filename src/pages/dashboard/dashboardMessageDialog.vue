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
import {  ref, watch, computed } from 'vue';

const props = defineProps(['data','open'])
const emit = defineEmits(['close','deleteItem'])
const isOpen =ref(false)
watch(props,() =>{
    isOpen.value = false
    if(props.open)isOpen.value = true
})

const title = computed(() => {
  let name =props.data.item.name
  if(props.data.dataType=='species') name = props.data.item.CommonName
  if(props.data.dataType=='report') name = props.data.item.title
  return `刪除 ${name} ?`
})

const description = computed(() => {
  let name = props.data.item.name
  if(props.data.dataType=='species') name = props.data.item.CommonName
  if(props.data.dataType=='report') name = props.data.item.title
  return `確定要刪除 ${name} ?`
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
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="emit('deleteItem',props.data.item._id)" class="bg-red-500">刪除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>