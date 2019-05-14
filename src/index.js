import Vue from 'vue';
import colorpicker from './components/colorpicker.vue';
export default {
  install(Vue) {
    Vue.component("colorpicker", colorpicker);
  }
};