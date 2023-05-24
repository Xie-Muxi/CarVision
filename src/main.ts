import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from "naive-ui";

// const app = createApp(App)

// import AFRAME from 'aframe';
import './style/index.css'

const app = createApp(App, {
    // compilerOptions: {
    //   isCustomElement: tag => tag.startsWith('a-')
    // }
})

import 'material-design-icons-iconfont/dist/material-design-icons.css';

// import 'aframe';
// import 'mind-ar/dist/mindar-image-aframe.prod.js';

app.use(router)
app.use(naive);
app.use(AFRAME);

app.mount('#app')
