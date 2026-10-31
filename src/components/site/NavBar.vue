<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { content, publishedPosts } from '../../lib/content.js'
import AppIcon from '../AppIcon.vue'

const open = ref(false)
const active = ref('')
const scrolled = ref(false)

const links = computed(() => [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'credentials', label: 'Credentials' },
  ...(publishedPosts().length ? [{ id: 'blog', label: 'Blog' }] : []),
])

let observer
const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (active.value = e.target.id)),
    { rootMargin: '-45% 0px -50% 0px' },
  )
  watch(links, () => setTimeout(() => document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))), { immediate: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})

const onKey = (e) => e.key === 'Escape' && (open.value = false)
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  v ? window.addEventListener('keydown', onKey) : window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
    <div
      class="transition-[background-color,box-shadow,backdrop-filter] duration-300"
      :class="scrolled || open ? 'bg-glass shadow-[0_1px_0_var(--separator)] backdrop-blur-xl backdrop-saturate-150' : ''"
    >
      <nav class="container-page flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" class="flex items-center gap-2.5 rounded-full font-semibold" @click="open = false">
          <span class="grid size-9 place-items-center rounded-full bg-accent text-[15px] font-bold text-on-accent">
            {{ (content.profile?.name || 'P')[0] }}
          </span>
          <span class="text-[17px]">{{ content.profile?.name?.split(' ')[0] }}</span>
        </a>

        <ul class="hidden items-center gap-1 lg:flex">
          <li v-for="l in links" :key="l.id">
            <a
              :href="`#${l.id}`"
              class="rounded-full px-3 py-2 text-[15px] transition-colors hover:text-label"
              :class="active === l.id ? 'font-medium text-label' : 'text-label-2'"
              :aria-current="active === l.id ? 'location' : undefined"
            >{{ l.label }}</a>
          </li>
        </ul>

        <div class="flex items-center gap-2">
          <a href="#contact" class="btn-primary hidden min-h-10 sm:inline-flex">Contact</a>
          <button
            class="btn-plain size-11 px-0 lg:hidden" :aria-expanded="open" aria-controls="mobile-menu"
            :aria-label="open ? 'Close menu' : 'Open menu'" @click="open = !open"
          >
            <AppIcon :name="open ? 'close' : 'menu'" :size="22" />
          </button>
        </div>
      </nav>

      <Transition
        enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="open" id="mobile-menu" class="container-page h-[calc(100dvh-4rem)] overflow-y-auto pb-10 lg:hidden">
          <ul class="divide-y divide-separator border-t border-separator">
            <li v-for="l in [...links, { id: 'contact', label: 'Contact' }]" :key="l.id">
              <a :href="`#${l.id}`" class="flex items-center justify-between py-4 text-2xl font-semibold" @click="open = false">
                {{ l.label }} <AppIcon name="arrowRight" class="text-label-3" />
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </header>
</template>
