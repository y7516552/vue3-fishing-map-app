import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { setupFirebase } from '@/firebase/index';
import vue3GoogleLogin from 'vue3-google-login'

setupFirebase;

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin);
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
})

app.mount('#app')
