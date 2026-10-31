<script setup>
import { watchEffect } from 'vue'
import { content, loaded, loadError } from '../lib/content.js'
import NavBar from '../components/site/NavBar.vue'
import HeroSection from '../components/site/HeroSection.vue'
import AboutSection from '../components/site/AboutSection.vue'
import ServicesSection from '../components/site/ServicesSection.vue'
import ProcessSection from '../components/site/ProcessSection.vue'
import ExperienceSection from '../components/site/ExperienceSection.vue'
import WorkSection from '../components/site/WorkSection.vue'
import CredentialsSection from '../components/site/CredentialsSection.vue'
import BlogSection from '../components/site/BlogSection.vue'
import ContactSection from '../components/site/ContactSection.vue'
import SiteFooter from '../components/site/SiteFooter.vue'

watchEffect(() => {
  const p = content.profile
  if (p) document.title = `${p.name} — ${p.role}`
})
</script>

<template>
  <div v-if="!loaded" class="grid min-h-dvh place-items-center" aria-busy="true">
    <span class="size-8 animate-spin rounded-full border-2 border-separator border-t-accent" role="status" aria-label="Loading" />
  </div>
  <div v-else-if="loadError && !content.profile" class="grid min-h-dvh place-items-center p-6 text-center">
    <div>
      <h1 class="text-2xl font-semibold">This page couldn’t load</h1>
      <p class="mt-2 text-label-2">The server didn’t respond. Check your connection and try again.</p>
      <button class="btn-primary mt-6" @click="$router.go(0)">Try again</button>
    </div>
  </div>
  <template v-else>
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Skip to content</a>
    <NavBar />
    <main id="main">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ExperienceSection />
      <WorkSection />
      <CredentialsSection />
      <BlogSection />
      <ContactSection />
    </main>
    <SiteFooter />
  </template>
</template>
