<template>
  <div class="min-h-screen w-full flex flex-col select-none">
    <div class="bg-white sticky top-0 z-20 dark:bg-gray-800 dark:text-white">
      <div class="h-14 flex items-center">
        <div class="flex-1" />
        <div class="text-lg font-black">
          {{ title }}
        </div>
        <div class="flex-1" />
      </div>
    </div>
    <div class="bg-gray-100 flex-1 border-t relative dark:border-gray-600 dark:bg-gray-800">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutMain',
  computed: {
    title() {
      const { title } = this.$route.meta

      return title
    }
  }
})
</script>
