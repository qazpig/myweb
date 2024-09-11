import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import './css/global.css'
import gsap from 'gsap';

const app = createApp(App)

app.config.globalProperties.$gsap = gsap
app.use(createPinia(App))
app.use(router)

app.mount('#app')
