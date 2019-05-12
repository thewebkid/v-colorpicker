import Vue from 'vue'
import App from './App.vue'
/*
import rangeFlyout from 'v-range-flyout';
Vue.use(rangeFlyout);
*/
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
