<script setup>
import { computed, reactive, ref } from 'vue'
import { api } from '../../lib/api.js'
import { content } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'
import SectionHeader from './SectionHeader.vue'

const p = computed(() => content.profile || {})
const rows = computed(() => [
  p.value.email && { icon: 'mail', label: 'Email', value: p.value.email, href: `mailto:${p.value.email}` },
  p.value.emailAlt && { icon: 'mail', label: 'Alternate email', value: p.value.emailAlt, href: `mailto:${p.value.emailAlt}` },
  p.value.phone && { icon: 'phone', label: 'Phone', value: p.value.phone, href: `tel:${p.value.phone.replace(/[^\d+]/g, '')}` },
  p.value.location && { icon: 'pin', label: 'Location', value: p.value.location },
  p.value.linkedin && { icon: 'linkedin', label: 'LinkedIn', value: 'View profile', href: p.value.linkedin },
  p.value.github && { icon: 'github', label: 'GitHub', value: 'View profile', href: p.value.github },
].filter(Boolean))

const form = reactive({ name: '', email: '', subject: '', body: '', website: '' })
const status = ref('idle') // idle | sending | sent | error
const error = ref('')

async function submit() {
  status.value = 'sending'
  error.value = ''
  try {
    await api.post('/api/messages', form)
    status.value = 'sent'
    Object.assign(form, { name: '', email: '', subject: '', body: '' })
  } catch (e) {
    error.value = e.message
    status.value = 'error'
  }
}
</script>

<template>
  <section id="contact" class="py-20 sm:py-28">
    <div class="container-page">
      <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader eyebrow="Contact" title="Let’s talk about your infrastructure" lede="Have a role, a project or a problem that needs a second pair of eyes? Send a message and I’ll reply within two business days." class="!mb-8" />
          <ul class="card divide-y divide-separator overflow-hidden">
            <li v-for="r in rows" :key="r.label">
              <component :is="r.href ? 'a' : 'div'" :href="r.href" class="flex min-h-14 items-center gap-4 px-5 py-3" :class="r.href && 'hover:bg-surface'">
                <span class="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent"><AppIcon :name="r.icon" /></span>
                <span class="min-w-0">
                  <span class="block text-sm text-label-2">{{ r.label }}</span>
                  <span class="block truncate font-medium">{{ r.value }}</span>
                </span>
              </component>
            </li>
          </ul>
        </div>

        <div v-reveal class="card p-6 sm:p-8">
          <div v-if="status === 'sent'" class="grid min-h-80 place-items-center text-center" role="status">
            <div>
              <span class="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success"><AppIcon name="check" :size="28" /></span>
              <h3 class="mt-4 text-2xl font-semibold">Message sent</h3>
              <p class="mt-2 text-label-2">Thanks for reaching out — I’ll get back to you soon.</p>
              <button class="btn-secondary mt-6" @click="status = 'idle'">Send another message</button>
            </div>
          </div>

          <form v-else class="grid gap-5 sm:grid-cols-2" @submit.prevent="submit">
            <div>
              <label for="c-name" class="field-label">Name</label>
              <input id="c-name" v-model="form.name" class="field" autocomplete="name" required maxlength="120" />
            </div>
            <div>
              <label for="c-email" class="field-label">Email</label>
              <input id="c-email" v-model="form.email" type="email" class="field" autocomplete="email" required maxlength="200" />
            </div>
            <div class="sm:col-span-2">
              <label for="c-subject" class="field-label">Subject <span class="font-normal text-label-2">(optional)</span></label>
              <input id="c-subject" v-model="form.subject" class="field" maxlength="200" />
            </div>
            <div class="sm:col-span-2">
              <label for="c-body" class="field-label">Message</label>
              <textarea id="c-body" v-model="form.body" rows="6" class="field resize-y" required maxlength="5000" placeholder="Tell me a little about what you need…" />
            </div>
            <!-- honeypot: hidden from people and assistive tech -->
            <div aria-hidden="true" hidden>
              <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
            </div>
            <p v-if="error" class="text-sm text-danger sm:col-span-2" role="alert">{{ error }}</p>
            <div class="sm:col-span-2">
              <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="status === 'sending'">
                {{ status === 'sending' ? 'Sending…' : 'Send message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
