<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { api } from '../lib/api.js'
import { loaded } from '../lib/content.js'
import { sections } from '../admin/schema.js'
import AppIcon from '../components/AppIcon.vue'
import SectionEditor from '../admin/SectionEditor.vue'
import MessagesPanel from '../admin/MessagesPanel.vue'

const authed = ref(null) // null = checking
const password = ref('')
const loginError = ref('')
const signingIn = ref(false)

const current = ref('profile')
const dirty = ref(false)
const unread = ref(0)
const section = computed(() => sections.find((s) => s.key === current.value))

onMounted(async () => {
  document.title = 'Admin — Portfolio'
  authed.value = (await api.get('/api/me').catch(() => ({ authed: false }))).authed
  if (authed.value) countUnread()
})

const countUnread = () =>
  api.get('/api/messages').then((m) => (unread.value = m.filter((x) => !x.is_read).length)).catch(() => {})

async function signIn() {
  signingIn.value = true
  loginError.value = ''
  try {
    await api.post('/api/login', { password: password.value })
    password.value = ''
    authed.value = true
    countUnread()
  } catch (e) {
    loginError.value = e.message
  } finally {
    signingIn.value = false
  }
}
async function signOut() {
  if (dirty.value && !confirm('You have unsaved changes. Sign out anyway?')) return
  await api.post('/api/logout')
  authed.value = false
  dirty.value = false
}

function go(key) {
  if (key === current.value) return
  if (dirty.value && !confirm('You have unsaved changes in this section. Leave without saving?')) return
  current.value = key
  dirty.value = false
  window.scrollTo({ top: 0 })
}

const beforeUnload = (e) => dirty.value && e.preventDefault()
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave(() => !dirty.value || confirm('You have unsaved changes. Leave without saving?'))
</script>

<template>
  <div class="min-h-dvh bg-surface">
    <!-- Checking session -->
    <div v-if="authed === null || !loaded" class="grid min-h-dvh place-items-center">
      <span class="size-8 animate-spin rounded-full border-2 border-separator border-t-accent" role="status" aria-label="Loading" />
    </div>

    <!-- Sign in -->
    <main v-else-if="!authed" class="grid min-h-dvh place-items-center p-4">
      <form class="card w-full max-w-sm p-8" @submit.prevent="signIn">
        <span class="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent"><AppIcon name="lock" :size="26" /></span>
        <h1 class="mt-5 text-center text-2xl font-semibold tracking-tight">Edit your portfolio</h1>
        <p class="mt-1 text-center text-sm text-label-2">Sign in with your admin password.</p>
        <label for="pw" class="field-label mt-8">Password</label>
        <input id="pw" v-model="password" type="password" class="field" autocomplete="current-password" required autofocus />
        <p v-if="loginError" class="mt-3 text-sm text-danger" role="alert">{{ loginError }}</p>
        <button type="submit" class="btn-primary mt-6 w-full" :disabled="signingIn || !password">{{ signingIn ? 'Signing in…' : 'Sign in' }}</button>
        <RouterLink to="/" class="btn-plain mt-2 w-full">Back to site</RouterLink>
      </form>
    </main>

    <!-- Editor -->
    <template v-else>
      <header class="sticky top-0 z-20 border-b border-separator bg-glass backdrop-blur-xl">
        <div class="flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
          <p class="flex items-center gap-2.5 font-semibold">
            <span class="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">P</span>
            Portfolio editor
          </p>
          <div class="flex items-center gap-1">
            <a href="/" target="_blank" class="btn-plain min-h-10"><AppIcon name="eye" :size="18" /><span class="hidden sm:inline">View site</span></a>
            <button class="btn-plain min-h-10" @click="signOut"><AppIcon name="logout" :size="18" /><span class="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-24 sm:px-8 lg:flex-row lg:gap-10">
        <!-- Sidebar (desktop) / picker (mobile) -->
        <nav aria-label="Sections" class="lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:w-56 lg:shrink-0 lg:overflow-y-auto lg:py-6">
          <label for="section-picker" class="sr-only">Section</label>
          <select id="section-picker" class="field mt-4 lg:hidden" :value="current" @change="go($event.target.value); $event.target.value = current">
            <option v-for="s in sections" :key="s.key" :value="s.key">{{ s.label }}</option>
            <option value="messages">Messages{{ unread ? ` (${unread} new)` : '' }}</option>
          </select>
          <ul class="hidden space-y-0.5 lg:block">
            <li v-for="s in [...sections, { key: 'messages', label: 'Messages', icon: 'inbox' }]" :key="s.key">
              <button
                type="button" class="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-[15px] transition-colors"
                :class="current === s.key ? 'bg-accent text-on-accent font-medium' : 'text-label hover:bg-elevated'"
                :aria-current="current === s.key ? 'page' : undefined" @click="go(s.key)"
              >
                <AppIcon :name="s.icon" :size="18" />
                <span class="flex-1">{{ s.label }}</span>
                <span v-if="s.key === 'messages' && unread" class="rounded-full px-2 text-xs font-semibold" :class="current === s.key ? 'bg-on-accent/20' : 'bg-accent text-on-accent'">{{ unread }}</span>
              </button>
            </li>
          </ul>
        </nav>

        <main class="min-w-0 flex-1 lg:pt-2">
          <MessagesPanel v-if="current === 'messages'" @count="unread = $event" @unauthorized="authed = false" />
          <SectionEditor v-else :key="section.key" :section="section" @dirty="dirty = $event" @unauthorized="authed = false" />
        </main>
      </div>
    </template>
  </div>
</template>
