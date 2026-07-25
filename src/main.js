import { createApp } from 'vue';
import App from './App.vue';
import VMovable from 'v-movable';

const app = createApp(App);
app.use(VMovable);
app.mount('#app');
