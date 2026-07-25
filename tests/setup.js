import { config } from '@vue/test-utils';

// Stub web-component wrappers that register custom elements at import time.
config.global.stubs = {
  VMovable: {
    name: 'VMovable',
    template: '<div class="v-movable-stub"><slot /></div>',
    props: ['left', 'top', 'boundsX', 'boundsY', 'axis'],
  },
  RangeFlyout: {
    name: 'RangeFlyout',
    template:
      '<input class="range-flyout-stub" type="number" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />',
    props: [
      'modelValue',
      'min',
      'max',
      'incr',
      'sliderHeight',
      'slideBackground',
      'handleBg',
      'scheme',
    ],
    emits: ['update:modelValue', 'active'],
  },
};

// Quiet noisy console during tests unless asserted.
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('Lit is in dev mode')) return;
  originalWarn(...args);
};
