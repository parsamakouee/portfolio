<script setup>
import { content } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'
</script>

<template>
  <section id="services" class="py-20 sm:py-28">
    <div class="container-page">
      <SectionHeader
        eyebrow="Services" title="What I can do for your team"
        lede="From the server room to the browser — practical IT that keeps people productive."
      />
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="s in content.services" :key="s.title" v-reveal class="card group p-7 transition-transform duration-300 hover:-translate-y-1">
          <span class="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
            <AppIcon :name="s.icon" :size="24" />
          </span>
          <h3 class="mt-5 text-xl font-semibold tracking-tight">{{ s.title }}</h3>
          <p class="mt-2 text-label-2">{{ s.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
