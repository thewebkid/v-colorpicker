<template>
  <div class="hue-gradient" :class="{ compact }" :style="gradientStyle" @click="onHueClick">
    <v-movable
      class="bar"
      axis="x"
      :left="sliderPos"
      :boundsX="boundsX"
      :style="{ background: sliderBg }"
      @move="onMove"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Color } from 'modern-color';
import { hueColorStops } from '../utils/color.js';

const props = defineProps({
  hue: {
    type: Number,
    required: true
  },
  color: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['hue-change']);

const scale = computed(() => (props.compact ? 0.844444 : 1.25));
const width = computed(() => (props.compact ? 304 : 450));
const moveScale = computed(() => (props.compact ? 1.184210526315789 : 0.8));

const sliderPos = computed(() => props.hue * scale.value);

const boundsX = computed(() => {
  const pos = sliderPos.value;
  return `${-pos}, ${width.value - pos}`;
});

const gradientStyle = computed(() => ({
  background: `linear-gradient(90deg, ${hueColorStops})`
}));

const sliderBg = computed(() => {
  return new Color({ h: props.hue, s: 100, v: 100 }).hex;
});

const setHue = (x) => {
  const hVal = Math.max(0, Math.min(Math.round(x * moveScale.value), 359));
  emit('hue-change', hVal);
};

const onHueClick = (e) => {
  // Ignore clicks on the slider itself
  if (e.target.closest('.bar')) return;
  setHue(e.offsetX);
};

const onMove = (e) => {
  setHue(e.posLeft);
};
</script>

<style lang="scss" scoped>
.hue-gradient {
  height: 17px;
  width: 450px;
  margin: 0 0 2px 3px;
  border: solid 1px var(--vcp-input-border, #777);
  position: relative;
  cursor: pointer;
  left:15px;
  &.compact {
    width: 304px;
  }

  .bar {
    height: 20px;
    width: 10px;
    margin: -2px -6px;
    position: absolute;
    box-shadow: 0 0 0.7px var(--vcp-handle-shadow, #eee), inset 0 0 1px rgba(0, 0, 0, 0.7);
    border: 1px solid var(--vcp-handle-border, rgba(23, 23, 23, 0.9));
    cursor: grab;

    &:active {
      cursor: grabbing;
      box-shadow: 0 0 2px var(--vcp-handle-shadow, #fff), inset 0 0 2px #fefefe;
    }
  }
}
</style>
