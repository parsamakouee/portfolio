import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router.js'
import { reveal } from './lib/reveal.js'
import './style.css'

createApp(App).use(router).directive('reveal', reveal).mount('#app')
