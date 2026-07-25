import ColorPicker from './components/ColorPicker.vue';
import VMovable from 'v-movable';

// Plugin install function
const install = (app) => {
  app.use(VMovable);
  app.component('ColorPicker', ColorPicker);
  // Also register with original name for backwards compatibility
  app.component('colorpicker', ColorPicker);
};

// Auto-install when Vue is found (browser)
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

export { ColorPicker };
export default { install };
