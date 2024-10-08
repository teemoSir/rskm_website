

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import router from './router/index.js';
import { createPinia } from "pinia"

const app = createApp(App);
app.use(Antd)
app.use(router)
app.use(createPinia())

app.mount('#app');