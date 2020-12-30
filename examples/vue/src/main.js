import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

function appFactoryFunction() {
  return createApp(App)
}

let app = appFactoryFunction()

document.addEventListener('carinthia:load', () => {
  app.mount('#app')
})

document.addEventListener('carinthia:unload', () => {
  app.unmount('#app')
  // One can not re-mount same app instance
  // https://github.com/vuejs/vue-next/issues/1287#issuecomment-638252620
  app = appFactoryFunction()
})
