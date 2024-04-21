import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueAxios, axios)
app.mount('#app')

