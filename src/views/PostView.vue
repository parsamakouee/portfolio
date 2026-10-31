<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { content, formatDate, loaded, paragraphs } from '../lib/content.js'
import AppIcon from '../components/AppIcon.vue'
import SiteFooter from '../components/site/SiteFooter.vue'

const route = useRoute()
const post = computed(() => (content.posts || []).find((p) => p.slug === route.params.slug && p.published))
watchEffect(() => post.value && (document.title = `${post.value.title} — ${content.profile?.name}`))
</script>

<template>
  <div class="min-h-dvh">
    <div class="container-page max-w-3xl pt-8">
      <RouterLink to="/#blog" class="btn-plain -ml-4"><AppIcon name="arrowLeft" :size="18" /> All posts</RouterLink>
    </div>
    <article v-if="post" class="container-page max-w-3xl pt-8 pb-24">
      <time class="text-sm font-medium text-label-2" :datetime="post.date">{{ formatDate(post.date) }}</time>
      <h1 class="h-display mt-2 !text-4xl sm:!text-5xl">{{ post.title }}</h1>
      <p v-if="post.excerpt" class="lede mt-4">{{ post.excerpt }}</p>
      <img v-if="post.cover" :src="post.cover" alt="" class="mt-10 aspect-[16/9] w-full rounded-3xl object-cover" />
      <div class="mt-10 space-y-6 text-lg leading-relaxed">
        <p v-for="(para, i) in paragraphs(post.body)" :key="i" class="whitespace-pre-line">{{ para }}</p>
      </div>
    </article>
    <div v-else-if="loaded" class="container-page max-w-3xl py-24 text-center">
      <h1 class="text-3xl font-semibold">Post not found</h1>
      <p class="mt-2 text-label-2">It may have been moved or unpublished.</p>
    </div>
    <SiteFooter />
  </div>
</template>
