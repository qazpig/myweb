import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import './css/global.css'

const app = createApp(App)

app.use(createPinia(App))
app.use(router)

app.mount('#app')
