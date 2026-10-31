<script setup>
import { content } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'

const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url } }
</script>

<template>
  <section id="experience" class="py-20 sm:py-28">
    <div class="container-page">
      <SectionHeader eyebrow="Experience" title="Where I’ve worked" />
      <ol class="relative space-y-4 border-l border-separator pl-6 sm:pl-8">
        <li v-for="job in content.experience" :key="job.company + job.role" v-reveal class="relative">
          <span class="absolute top-8 -left-[29px] size-2.5 rounded-full bg-accent ring-4 ring-canvas sm:-left-[37px]" aria-hidden="true" />
          <article class="card p-6 sm:p-8">
            <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 class="text-xl font-semibold tracking-tight">{{ job.role }}</h3>
              <p class="text-sm font-medium text-label-2 tabular-nums">{{ job.period }}</p>
            </div>
            <p class="mt-1 font-medium text-accent">{{ job.company }}</p>
            <ul class="mt-4 list-disc space-y-1.5 pl-5 text-label-2 marker:text-label-3">
              <li v-for="pt in job.points" :key="pt">{{ pt }}</li>
            </ul>
            <a v-if="job.url" :href="job.url" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              {{ host(job.url) }} <AppIcon name="arrowUpRight" :size="15" />
            </a>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
