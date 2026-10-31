<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../lib/api.js'
import AppIcon from '../components/AppIcon.vue'

const emit = defineEmits(['count', 'unauthorized'])
const list = ref([])
const loading = ref(true)
const error = ref('')

const report = () => emit('count', list.value.filter((m) => !m.is_read).length)

async function load() {
  loading.value = true
  try {
    list.value = await api.get('/api/messages')
    report()
  } catch (e) {
    if (e.status === 401) emit('unauthorized')
    error.value = e.message
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function setRead(m, isRead) {
  await api.patch(`/api/messages/${m.id}`, { is_read: isRead })
  m.is_read = isRead ? 1 : 0
  report()
}
async function remove(m) {
  if (!confirm(`Delete the message from ${m.name}? This can’t be undone.`)) return
  await api.del(`/api/messages/${m.id}`)
  list.value = list.value.filter((x) => x.id !== m.id)
  report()
}
const when = (s) => new Date(s.replace(' ', 'T') + 'Z').toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
  <div>
    <div class="mb-6 py-4">
      <h1 class="text-2xl font-semibold tracking-tight">Messages</h1>
      <p class="text-sm text-label-2">Sent through the contact form on your site.</p>
    </div>
    <p v-if="error" class="mb-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">{{ error }}</p>
    <p v-if="loading" class="text-label-2">Loading…</p>
    <div v-else-if="!list.length" class="rounded-3xl border border-dashed border-separator p-12 text-center">
      <AppIcon name="inbox" :size="32" class="mx-auto text-label-3" />
      <p class="mt-3 font-medium">No messages yet</p>
      <p class="mt-1 text-sm text-label-2">When someone uses your contact form, it shows up here.</p>
    </div>
    <ul v-else class="space-y-3">
      <li v-for="m in list" :key="m.id" class="card p-5 sm:p-6" :class="!m.is_read && 'ring-2 ring-accent/40'">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold">
              <span v-if="!m.is_read" class="mr-1.5 inline-block size-2 rounded-full bg-accent align-middle" aria-label="Unread" />{{ m.name }}
            </p>
            <a :href="`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'your message'))}`" class="text-sm text-accent hover:underline">{{ m.email }}</a>
          </div>
          <time class="text-sm text-label-2">{{ when(m.created_at) }}</time>
        </div>
        <p v-if="m.subject" class="mt-3 font-medium">{{ m.subject }}</p>
        <p class="mt-2 whitespace-pre-line text-label-2">{{ m.body }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a :href="`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'your message'))}`" class="btn-secondary min-h-10"><AppIcon name="mail" :size="16" /> Reply</a>
          <button class="btn-plain min-h-10" @click="setRead(m, !m.is_read)">{{ m.is_read ? 'Mark as unread' : 'Mark as read' }}</button>
          <button class="btn-danger min-h-10" @click="remove(m)"><AppIcon name="trash" :size="16" /> Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
