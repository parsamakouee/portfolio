<script setup>
import { content } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'
</script>

<template>
  <section id="credentials" class="py-20 sm:py-28">
    <div class="container-page">
      <SectionHeader eyebrow="Credentials" title="Education & certifications" />
      <div class="grid gap-4 lg:grid-cols-2">
        <div v-reveal class="card p-6 sm:p-8">
          <h3 class="flex items-center gap-2 font-semibold"><AppIcon name="cap" class="text-accent" /> Education</h3>
          <ul class="mt-6 divide-y divide-separator">
            <li v-for="e in content.education" :key="e.degree" class="py-5 first:pt-0 last:pb-0">
              <div class="flex items-baseline justify-between gap-4">
                <p class="font-semibold">{{ e.degree }}</p>
                <p class="shrink-0 text-sm font-medium text-label-2 tabular-nums">{{ e.year }}</p>
              </div>
              <p class="mt-1 text-label-2">{{ e.school }}</p>
              <p v-if="e.details" class="mt-2 text-[15px] text-label-2">{{ e.details }}</p>
            </li>
          </ul>
        </div>
        <div v-reveal class="card p-6 sm:p-8">
          <h3 class="flex items-center gap-2 font-semibold"><AppIcon name="award" class="text-accent" /> Certifications, tests & research</h3>
          <ul class="mt-6 divide-y divide-separator">
            <li v-for="c in content.credentials" :key="c.title" class="py-5 first:pt-0 last:pb-0">
              <div class="flex items-baseline justify-between gap-4">
                <p class="font-semibold">{{ c.title }}</p>
                <p v-if="c.date" class="shrink-0 text-sm font-medium text-label-2">{{ c.date }}</p>
              </div>
              <p class="mt-1 text-label-2">{{ c.issuer }}</p>
              <p v-if="c.detail" class="mt-2 text-[15px] text-label-2">{{ c.detail }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
