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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

const props = defineProps(['open'])
const emit = defineEmits(['close','sendReport'])

const isOpen = ref(false)

const handleFileUpload = async(e) => {
  console.log("selected file",e.target.files[0])
  //Upload to server
}

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
        emit('close')
    }
}

const formSchema = toTypedSchema(z.object({
  type:z.string(),
  title:z.string(),
  description:z.string(),
  // imageList: z.string(),
}))

function onSubmit(values) {
    isOpen.value = false
    toast.success('回報成功', {
        description: '謝謝您的回饋',
    })
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
            <Label for="picture">圖片</Label>
            <Input id="picture" @change="handleFileUpload" type="file" />
            <!-- <FormField  >
              <FormItem>
                <FormLabel>圖片</FormLabel>
                <FormControl>
                  <Input @change="handleFileUpload" type="file"  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
              
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