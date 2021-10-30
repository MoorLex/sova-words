<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  created() {
    document.body.classList.add('dark')
  }
})
</script>
