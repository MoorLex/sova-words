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
    <!--    <div class="bg-white sticky bottom-0 border-t">-->
    <!--      <div class="h-14 pb-safe max-w-screen-sm w-full mx-auto flex items-center justify-center">-->
    <!--        <div class="flex-1 flex flex-col items-center justify-center">-->
    <!--          <BaseIcon name="outline/home" />-->
    <!--        </div>-->
    <!--        <div class="flex-1 flex flex-col items-center justify-center">-->
    <!--          <BaseIcon name="outline/home" />-->
    <!--        </div>-->
    <!--        <div class="flex-1 flex flex-col items-center justify-center">-->
    <!--          <BaseIcon name="outline/home" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
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
