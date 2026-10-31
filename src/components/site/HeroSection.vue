<script setup>
import { computed } from 'vue'
import { asset, content, initials } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'

const p = computed(() => content.profile || {})
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
    <!-- soft accent wash -->
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(60%_60%_at_70%_20%,var(--accent-soft),transparent_70%)]" />

    <div class="container-page grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div>
        <p v-if="p.available" class="mb-6 inline-flex items-center gap-2 rounded-full bg-elevated px-3.5 py-1.5 text-sm font-medium text-label-2 shadow-card ring-1 ring-separator">
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span class="relative inline-flex size-2.5 rounded-full bg-success" />
          </span>
          {{ p.availabilityText }}
        </p>

        <h1 class="h-display">
          Hello, I’m <span class="whitespace-nowrap">{{ p.name }}</span>
        </h1>
        <p class="mt-3 text-xl font-medium text-accent sm:text-2xl">{{ p.role }}</p>
        <p class="lede mt-6 max-w-xl">{{ p.intro }}</p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#contact" class="btn-primary">Say hello <AppIcon name="arrowRight" :size="18" /></a>
          <a v-if="p.cvUrl" :href="asset(p.cvUrl)" target="_blank" rel="noopener" class="btn-secondary">
            <AppIcon name="download" :size="18" /> Download CV
          </a>
          <a v-else href="#work" class="btn-secondary">See my work</a>
          <a
            v-if="p.linkedin" :href="p.linkedin" target="_blank" rel="noopener"
            class="btn-plain size-11 px-0 ring-1 ring-separator" aria-label="LinkedIn profile" title="LinkedIn"
          ><AppIcon name="linkedin" /></a>
          <a
            v-if="p.github" :href="p.github" target="_blank" rel="noopener"
            class="btn-plain size-11 px-0 ring-1 ring-separator" aria-label="GitHub profile" title="GitHub"
          ><AppIcon name="github" /></a>
        </div>

        <dl v-if="content.stats?.length" class="card mt-12 grid grid-cols-3 divide-x divide-separator overflow-hidden">
          <div v-for="s in content.stats" :key="s.label" class="flex flex-col gap-1 px-3 py-5 text-center sm:px-6">
            <dt class="text-[13px] text-label-2 sm:text-sm">{{ s.label }}</dt>
            <dd class="order-first text-2xl font-semibold tracking-tight sm:text-3xl">{{ s.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div class="card relative aspect-[4/5] overflow-hidden rounded-[2rem] p-2">
          <img
            v-if="p.photo" :src="asset(p.photo)" :alt="`Portrait of ${p.name}`"
            class="size-full rounded-[1.6rem] object-cover"
          />
          <div v-else class="relative grid size-full place-items-center overflow-hidden rounded-[1.6rem] bg-surface">
            <!-- network motif: the placeholder hints at the work until a photo is uploaded -->
            <svg class="absolute inset-0 size-full text-accent/25" viewBox="0 0 400 500" fill="none" aria-hidden="true">
              <g stroke="currentColor" stroke-width="1.5">
                <path d="M60 90L200 160L340 80M200 160L120 300L200 420L300 310L200 160M120 300L40 380M300 310L370 420M60 90L120 300M340 80L300 310" />
              </g>
              <g fill="currentColor">
                <circle cx="60" cy="90" r="6" /><circle cx="340" cy="80" r="6" /><circle cx="200" cy="160" r="8" />
                <circle cx="120" cy="300" r="6" /><circle cx="300" cy="310" r="6" /><circle cx="200" cy="420" r="6" />
                <circle cx="40" cy="380" r="5" /><circle cx="370" cy="420" r="5" />
              </g>
            </svg>
            <span class="relative grid size-32 place-items-center rounded-full bg-accent text-5xl font-semibold text-on-accent shadow-card" aria-hidden="true">
              {{ initials(p.name) }}
            </span>
          </div>
        </div>
        <p class="card absolute -bottom-5 left-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium sm:-left-6">
          <AppIcon name="pin" :size="18" class="text-accent" /> {{ p.location }}
        </p>
      </div>
    </div>
  </section>
</template>
