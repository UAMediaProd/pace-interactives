import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import * as Resize from 'iframe-resizer/js/iframeResizer.contentWindow'

createApp(App).use(router)
.use(Resize)
.mount('#app')
