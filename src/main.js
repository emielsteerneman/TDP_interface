import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

import { createApp } from 'vue'
import { createPinia } from "pinia"

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(VueAxios, axios)
app.use(pinia)

app.mount('#app')

