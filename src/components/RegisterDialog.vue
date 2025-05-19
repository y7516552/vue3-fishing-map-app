<script setup >
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
</script>

<template>
  <div>
    <Dialog>
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
            First Dialog
          </DialogTitle>
          <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-sm leading-normal">
            First dialog.
          </DialogDescription>

        </DialogContent>
    </Dialog>
  </div>
</template>