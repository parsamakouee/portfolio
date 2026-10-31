<script setup>
import { watchEffect } from 'vue'
import { content } from '../lib/content.js'
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
