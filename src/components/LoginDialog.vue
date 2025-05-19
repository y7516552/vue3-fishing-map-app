
<script setup>

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import LoginForm from '@/components/LoginForm.vue';
import messageDialog from './MessageDialog.vue';
import {  ref, watch } from 'vue';


const openDialog = ref(false)
const openMsg = ref(false)
const MsgData = ref({
    title:'',
    description:'',
    status:'success'
})

const props = defineProps(['openLoginDialog'])
const emit = defineEmits(['closeLoginDialog'])

watch(props,() =>{
    if(props.openLoginDialog) openDialog.value = true
})

const updateDialogState = (e) => {
    if(!e) {
        openDialog.value = e
        emit('closeLoginDialog')
    }
}


const loginSubmitted = () => {
    openDialog.value = false
    emit('closeLoginDialog')
}

const loginFail = () => {
    openMsg.value = true
    MsgData.value = {
        title:'登入失敗',
        description:'帳號或密碼錯誤',
        status:'danger'
    }
}

</script>

<template>
  <Dialog v-model:open="openDialog" @update:open="updateDialogState">
    <DialogContent>
      <DialogTitle>登入</DialogTitle>
      <DialogDescription></DialogDescription>
      <LoginForm @loginSubmitted="loginSubmitted" @loginFail="loginFail"/>
    </DialogContent>
    <messageDialog :data="MsgData" :open="openMsg" @close="()=> {openMsg=false}"></messageDialog>
  </Dialog>
</template>
