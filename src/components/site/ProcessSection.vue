<script setup>
import { content } from '../../lib/content.js'
import SectionHeader from './SectionHeader.vue'
</script>

<template>
  <section id="process" class="bg-surface py-20 sm:py-28">
    <div class="container-page">
      <SectionHeader eyebrow="Process" title="How a project runs" lede="Four steps, the same every time, so you always know what happens next." />
      <!-- Numbered because the steps really are a sequence. -->
      <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(step, i) in content.process" :key="step.title" v-reveal class="relative card p-7">
          <span class="text-sm font-semibold text-accent tabular-nums">Step {{ i + 1 }}</span>
          <h3 class="mt-2 text-xl font-semibold tracking-tight">{{ step.title }}</h3>
          <p class="mt-2 text-label-2">{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
