<script setup>
import {
  AlertDialog,
//   AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {  ref, watch } from 'vue';

const props = defineProps(['data','open'])
const emit = defineEmits(['close'])
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
    <AlertDialogContent :class="[props.status=='success'?'bg-green-200':'bg-red-200']" class="z-1000">
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.data.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.data.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Ok</AlertDialogCancel>
        <!-- <AlertDialogAction>Continue</AlertDialogAction> -->
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>