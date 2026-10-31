<script setup>
import { computed, ref } from 'vue'
import { asset, content } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'

const filter = ref('All')
const categories = computed(() => ['All', ...new Set((content.projects || []).map((p) => p.category).filter(Boolean))])
const shown = computed(() => (content.projects || []).filter((p) => filter.value === 'All' || p.category === filter.value))
const categoryIcon = { Networking: 'network', Infrastructure: 'server', Systems: 'shield', Research: 'doc', Development: 'code' }
</script>

<template>
  <section id="work" class="bg-surface py-20 sm:py-28">
    <div class="container-page">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader eyebrow="Portfolio" title="Selected work" class="!mb-0" />
        <div v-if="categories.length > 2" role="radiogroup" aria-label="Filter projects" class="flex max-w-full gap-1 overflow-x-auto rounded-full bg-elevated p-1 ring-1 ring-separator">
          <button
            v-for="c in categories" :key="c" role="radio" :aria-checked="filter === c"
            class="min-h-9 shrink-0 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors"
            :class="filter === c ? 'bg-accent text-on-accent' : 'text-label-2 hover:text-label'"
            @click="filter = c"
          >{{ c }}</button>
        </div>
      </div>

      <TransitionGroup tag="ul" move-class="transition duration-300" class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="p in shown" :key="p.title" class="card flex flex-col overflow-hidden">
          <div class="aspect-[16/10] bg-accent-soft">
            <img v-if="p.image" :src="asset(p.image)" :alt="p.title" class="size-full object-cover" loading="lazy" />
            <div v-else class="grid size-full place-items-center text-accent">
              <AppIcon :name="categoryIcon[p.category] || 'layers'" :size="44" />
            </div>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-sm font-medium text-label-2">{{ p.category }}<template v-if="p.client"> · {{ p.client }}</template></p>
            <h3 class="mt-1 text-xl font-semibold tracking-tight">{{ p.title }}</h3>
            <p class="mt-2 flex-1 text-label-2">{{ p.summary }}</p>
            <ul v-if="p.tags?.length" class="mt-4 flex flex-wrap gap-2">
              <li v-for="t in p.tags" :key="t" class="chip text-[13px]">{{ t }}</li>
            </ul>
            <a v-if="p.url" :href="p.url" target="_blank" rel="noopener" class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              View project <AppIcon name="arrowUpRight" :size="15" />
            </a>
          </div>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>
