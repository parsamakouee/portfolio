<script setup>
import { onMounted } from 'vue'
import { loadContent } from './lib/content.js'

onMounted(loadContent)
</script>

<template>
  <RouterView />
</template>
