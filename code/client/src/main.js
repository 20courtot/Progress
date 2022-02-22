import { createApp } from 'vue'
import store from '@/store'
import App from './App.vue'
import axios from 'axios'
import router from '@/router'
import set from './assets/fetch_set'

const app = createApp(App)
app.use(router).mount('#app')
app.use(store)

import VueAxios from 'vue-axios'
axios.defaults.baseURL = "http://"+set.url+":3000";
app.use(VueAxios, axios)


