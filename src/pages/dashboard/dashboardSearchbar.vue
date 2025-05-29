<script setup>
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref, watch} from 'vue'
const props = defineProps(['selectField'])

const emit = defineEmits(['searchUpdate'])

const search = ref({query:"",city:""})

const cityList = ["全部","基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]

watch(search.value,() => {
  emit('searchUpdate',search.value)
})

const goSearch = () => {
  emit('searchUpdate',search.value)
}

const resetSearch = () => {
  search.value.query=""
  search.value.city=""
  emit('searchUpdate',search.value)
}

</script>

<template>
  <div class="flex w-full">
    <div class="relative w-full max-w-sm items-center">
      <Input v-model="search.query" id="search" type="text" placeholder="Search..." class="pl-10" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <div>
      <Select v-if="props.selectField.city" v-model="search.city">
        <SelectTrigger class="w-[280px]">
          <SelectValue placeholder="選擇縣市..." />
        </SelectTrigger>
        <SelectContent>
        <SelectGroup>
          <SelectLabel>選擇縣市</SelectLabel>
          <SelectItem v-for="item in cityList" :key="item" :value="item">
            {{item}}
          </SelectItem>
        </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Button @click="goSearch">搜尋</Button>
    </div>
    <div>
      <Button @click="resetSearch">清除</Button>
    </div>
  </div>
</template>