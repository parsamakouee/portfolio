<script setup>
import { content } from '../../lib/content.js'
</script>

<template>
  <footer class="border-t border-separator py-10 text-sm text-label-2">
    <div class="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p>© {{ new Date().getFullYear() }} {{ content.profile?.name }}<template v-if="content.profile?.credential">, {{ content.profile.credential }}</template></p>
      <a href="#top" class="rounded-full px-3 py-2 hover:text-label">Back to top ↑</a>
    </div>
  </footer>
</template>
