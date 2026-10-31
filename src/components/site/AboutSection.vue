<script setup>
import { content, paragraphs } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
</script>

<template>
  <section id="about" class="bg-surface py-20 sm:py-28">
    <div class="container-page">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div v-reveal>
          <p class="eyebrow">About me</p>
          <h2 class="h-section mt-2">{{ content.about?.title }}</h2>
          <ul class="mt-8 space-y-3">
            <li v-for="h in content.about?.highlights" :key="h" class="flex gap-3">
              <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <AppIcon name="check" :size="15" />
              </span>
              <span>{{ h }}</span>
            </li>
          </ul>
        </div>
        <div v-reveal class="space-y-5 text-lg text-label-2">
          <p v-for="(para, i) in paragraphs(content.about?.body)" :key="i">{{ para }}</p>
        </div>
      </div>

      <div v-if="content.skills?.length" class="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="g in content.skills" :key="g.group" v-reveal class="card p-6">
          <h3 class="font-semibold">{{ g.group }}</h3>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li v-for="s in g.items" :key="s" class="chip">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
