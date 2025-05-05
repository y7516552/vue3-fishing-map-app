<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
const props = defineProps({
    avatarUrl:String,
    name:String,
    createdAt:String
})
const formateDate = (string) => {
    return string.split('T')[0]
}
</script>

<template>
    <div class="mb-2 flex content-center ">
        <Avatar class="">
          <AvatarImage :src="props.avatarUrl" :alt="props.name" />
          <AvatarFallback>{{ props.name?.[0] }}</AvatarFallback>
        </Avatar>
        <p class="ml-3 content-center mr-auto">{{ props.name }}</p>
        <p class="text-gray-500 content-center justify-self-end-safe">{{  formateDate(props.createdAt)  }}</p>
    </div>
</template>