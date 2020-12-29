import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

document.addEventListener('carinthia:load', () => {
  createApp(App).mount('#app')
})
