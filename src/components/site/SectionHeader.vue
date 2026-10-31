<script setup>
defineProps({ eyebrow: String, title: String, lede: String, center: Boolean })
</script>

<template>
  <header v-reveal class="mb-12 max-w-2xl" :class="center && 'mx-auto text-center'">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2 class="h-section mt-2">{{ title }}</h2>
    <p v-if="lede" class="lede mt-4">{{ lede }}</p>
  </header>
</template>
