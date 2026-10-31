<script setup>
import { computed, ref, useId } from 'vue'
import { api } from '../lib/api.js'
import AppIcon from '../components/AppIcon.vue'

const props = defineProps({ field: Object, item: Object })
const id = useId()
const uploading = ref(false)
const uploadError = ref('')

const model = computed({
  get: () => props.item[props.field.name],
  set: (v) => (props.item[props.field.name] = v),
})

// "lines" fields are arrays edited as one-per-line text.
const linesText = computed({
  get: () => (props.item[props.field.name] || []).join('\n'),
  set: (v) => (props.item[props.field.name] = v.split('\n').map((s) => s.trim()).filter(Boolean)),
})

const slugify = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-')

async function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    model.value = (await api.post('/api/upload', fd)).url
  } catch (err) {
    uploadError.value = err.message
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}
</script>

<template>
  <div>
    <div v-if="field.type === 'toggle'" class="flex min-h-11 items-center justify-between gap-4">
      <label :for="id" class="text-sm font-medium">{{ field.label }}</label>
      <button
        :id="id" type="button" role="switch" :aria-checked="!!model"
        class="relative h-[31px] w-[51px] shrink-0 cursor-pointer rounded-full transition-colors"
        :class="model ? 'bg-success' : 'bg-label-3/40'" @click="model = !model"
      >
        <span class="absolute top-0.5 left-0.5 size-[27px] rounded-full bg-white shadow transition-transform" :class="model && 'translate-x-5'" />
      </button>
    </div>

    <template v-else>
      <label :for="id" class="field-label">{{ field.label }}</label>

      <textarea v-if="field.type === 'textarea'" :id="id" v-model="model" :rows="field.rows || 3" class="field resize-y" :placeholder="field.placeholder" />
      <textarea v-else-if="field.type === 'lines'" :id="id" v-model.lazy="linesText" :rows="Math.max(3, (model?.length || 0) + 1)" class="field resize-y" />

      <div v-else-if="field.type === 'icon'" class="flex flex-wrap gap-2" role="radiogroup" :aria-label="field.label">
        <button
          v-for="name in field.options" :key="name" type="button" role="radio" :aria-checked="model === name" :aria-label="name"
          class="grid size-11 cursor-pointer place-items-center rounded-xl ring-1 transition-colors"
          :class="model === name ? 'bg-accent text-on-accent ring-accent' : 'bg-elevated text-label-2 ring-separator hover:text-label'"
          @click="model = name"
        ><AppIcon :name="name" /></button>
      </div>

      <div v-else-if="field.type === 'image' || field.type === 'file'" class="flex flex-wrap items-center gap-4">
        <img v-if="field.type === 'image' && model" :src="model" alt="" class="size-20 rounded-2xl object-cover ring-1 ring-separator" />
        <span v-else-if="field.type === 'image'" class="grid size-20 place-items-center rounded-2xl bg-surface text-label-3 ring-1 ring-separator"><AppIcon name="image" :size="28" /></span>
        <a v-else-if="model" :href="model" target="_blank" class="text-sm font-medium text-accent underline">View current file</a>
        <div class="flex flex-wrap gap-2">
          <label class="btn-secondary min-h-10 cursor-pointer">
            {{ uploading ? 'Uploading…' : model ? 'Replace' : 'Upload' }}
            <input :id="id" type="file" class="sr-only" :accept="field.type === 'image' ? 'image/*' : 'application/pdf'" :disabled="uploading" @change="onFile" />
          </label>
          <button v-if="model" type="button" class="btn-danger min-h-10" @click="model = ''">Remove</button>
        </div>
        <p v-if="uploadError" class="w-full text-sm text-danger" role="alert">{{ uploadError }}</p>
      </div>

      <div v-else-if="field.type === 'slug'" class="flex gap-2">
        <input :id="id" :value="model" class="field" @input="model = slugify($event.target.value)" />
        <button type="button" class="btn-secondary min-h-10 shrink-0" @click="model = slugify(item[field.from])">From title</button>
      </div>

      <input v-else :id="id" v-model.trim="model" :type="field.type === 'text' ? 'text' : field.type" class="field" :placeholder="field.placeholder" />

      <p v-if="field.help" class="mt-1.5 text-[13px] text-label-2">{{ field.help }}</p>
    </template>
  </div>
</template>
