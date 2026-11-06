import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Button from './components/ui/Button.vue'
import router from './router'

import './styles/base.css'
import './styles/layout.css'
import './styles/app.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('Button', Button)
app.mount('#app')