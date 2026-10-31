<script setup>
import { computed } from 'vue'
import { formatDate, publishedPosts } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'

const posts = computed(publishedPosts)
</script>

<template>
  <section v-if="posts.length" id="blog" class="bg-surface py-20 sm:py-28">
    <div class="container-page">
      <SectionHeader eyebrow="Blog" title="Notes from the field" />
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="p in posts" :key="p.slug" v-reveal>
          <RouterLink :to="`/blog/${p.slug}`" class="card group flex h-full flex-col overflow-hidden">
            <img v-if="p.cover" :src="p.cover" alt="" class="aspect-[16/9] w-full object-cover" loading="lazy" />
            <div class="flex flex-1 flex-col p-6">
              <time class="text-sm text-label-2" :datetime="p.date">{{ formatDate(p.date) }}</time>
              <h3 class="mt-1 text-xl font-semibold tracking-tight group-hover:text-accent">{{ p.title }}</h3>
              <p class="mt-2 flex-1 text-label-2">{{ p.excerpt }}</p>
              <span class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">Read post <AppIcon name="arrowRight" :size="15" /></span>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
