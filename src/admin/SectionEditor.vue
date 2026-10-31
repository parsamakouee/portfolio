<script setup>
import { computed, ref, watch } from 'vue'
import { api } from '../lib/api.js'
import { content } from '../lib/content.js'
import AppIcon from '../components/AppIcon.vue'
import FieldInput from './FieldInput.vue'

const props = defineProps({ section: Object })
const emit = defineEmits(['dirty', 'unauthorized'])

const clone = (v) => JSON.parse(JSON.stringify(v ?? null))
const draft = ref(null)
const expanded = ref(new Set())
const status = ref('') // '' | saving | saved | error
const error = ref('')

function reset() {
  draft.value = clone(content[props.section.key]) ?? (props.section.kind === 'list' ? [] : {})
  expanded.value = new Set()
  status.value = ''
}
watch(() => props.section.key, reset, { immediate: true })

const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(content[props.section.key] ?? draft.value))
watch(dirty, (d) => emit('dirty', d), { immediate: true })
watch(draft, () => status.value === 'saved' && (status.value = ''), { deep: true })

async function save() {
  status.value = 'saving'
  error.value = ''
  try {
    await api.put(`/api/content/${props.section.key}`, { value: draft.value })
    content[props.section.key] = clone(draft.value)
    status.value = 'saved'
  } catch (e) {
    if (e.status === 401) emit('unauthorized')
    error.value = e.message
    status.value = 'error'
  }
}

// ----- list helpers -----
function toggle(i) {
  const s = new Set(expanded.value)
  s.has(i) ? s.delete(i) : s.add(i)
  expanded.value = s
}
function add() {
  const b = props.section.blank
  draft.value.push(typeof b === 'function' ? b() : clone(b))
  expanded.value = new Set([...expanded.value, draft.value.length - 1])
}
function move(i, dir) {
  const j = i + dir
  const list = draft.value
  ;[list[i], list[j]] = [list[j], list[i]]
  const s = new Set([...expanded.value].map((k) => (k === i ? j : k === j ? i : k)))
  expanded.value = s
}
function remove(i) {
  const name = props.section.title(draft.value[i])
  if (!confirm(`Delete “${name}”? You can still discard this before saving.`)) return
  draft.value.splice(i, 1)
  expanded.value = new Set([...expanded.value].filter((k) => k !== i).map((k) => (k > i ? k - 1 : k)))
}
</script>

<template>
  <div>
    <div class="sticky top-16 z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 bg-surface/90 px-4 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">{{ section.label }}</h1>
        <p v-if="section.hint" class="text-sm text-label-2">{{ section.hint }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="status === 'saved'" class="flex items-center gap-1 text-sm font-medium text-success" role="status"><AppIcon name="check" :size="16" /> Saved</span>
        <button v-if="dirty" type="button" class="btn-plain min-h-10" @click="reset">Discard</button>
        <button type="button" class="btn-primary min-h-10" :disabled="!dirty || status === 'saving'" @click="save">
          {{ status === 'saving' ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </div>
    <p v-if="status === 'error'" class="mb-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">{{ error }}</p>

    <div v-if="section.kind === 'object'" class="card grid gap-6 p-6 sm:p-8">
      <FieldInput v-for="f in section.fields" :key="f.name" :field="f" :item="draft" />
    </div>

    <div v-else class="space-y-3">
      <div v-for="(item, i) in draft" :key="i" class="card overflow-hidden">
        <div class="flex items-center gap-1 pr-2">
          <button
            type="button" class="flex min-h-14 flex-1 cursor-pointer items-center gap-3 px-5 text-left font-medium"
            :aria-expanded="expanded.has(i)" @click="toggle(i)"
          >
            <AppIcon :name="expanded.has(i) ? 'up' : 'down'" :size="18" class="text-label-3" />
            <span class="truncate">{{ section.title(item) }}</span>
          </button>
          <button type="button" class="btn-plain size-10 px-0" :disabled="i === 0" aria-label="Move up" @click="move(i, -1)"><AppIcon name="up" :size="18" /></button>
          <button type="button" class="btn-plain size-10 px-0" :disabled="i === draft.length - 1" aria-label="Move down" @click="move(i, 1)"><AppIcon name="down" :size="18" /></button>
          <button type="button" class="btn-danger size-10 px-0" aria-label="Delete" @click="remove(i)"><AppIcon name="trash" :size="18" /></button>
        </div>
        <div v-if="expanded.has(i)" class="grid gap-5 border-t border-separator p-5 sm:p-6">
          <FieldInput v-for="f in section.fields" :key="f.name" :field="f" :item="item" />
        </div>
      </div>
      <p v-if="!draft.length" class="rounded-3xl border border-dashed border-separator p-10 text-center text-label-2">Nothing here yet.</p>
      <button type="button" class="btn-secondary w-full" @click="add"><AppIcon name="plus" :size="18" /> Add {{ section.label === 'Blog' ? 'post' : 'item' }}</button>
    </div>
  </div>
</template>
