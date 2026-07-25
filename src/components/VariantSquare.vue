<template>
  <div class="variant-square" :class="{ light, compact }" :style="containerStyle">
    <canvas
      ref="canvasRef"
      :height="canvasSize"
      :width="canvasSize"
      @click="onCanvasClick"
      :class="{ compact }"
    />
    <v-movable
      class="circle"
      :left="circlePos.left"
      :top="circlePos.top"
      :boundsX="circlePos.boundsX"
      :boundsY="circlePos.boundsY"
      @movestart="onMoveStart"
      @move="onMove"
      @moveend="onMoveEnd"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Color } from 'modern-color';

const props = defineProps({
  color: {
    type: Object,
    required: true
  },
  hsx: {
    type: Object,
    default: null
  },
  isHsl: {
    type: Boolean,
    default: true
  },
  size: {
    type: Number,
    default: 160
  },
  light: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['variant-change']);

const canvasRef = ref(null);
const ctx = ref(null);
const isDragging = ref(false);
const hsw = ref(null);

const canvasSize = 100; // Internal canvas resolution
const compact = computed(() => props.size === 100);
const scale = computed(() => props.size / 100);

const circlePos = ref({
  left: 0,
  top: 0,
  boundsX: '0,0',
  boundsY: '0,0'
});

const containerStyle = computed(() => ({
  width: `${props.size + 2}px`,
  height: `${props.size + 2}px`
}));

const currentHsx = computed(() => {
  if (props.hsx) return props.hsx;
  return props.isHsl ? props.color.hsl : props.color.hsv;
});

const setCirclePos = (x, y, updateBounds = !isDragging.value) => {
  const left = Number(x);
  const top = Number(y);
  const size = props.size;

  circlePos.value = {
    left,
    top,
    boundsX: updateBounds ? `${-left}, ${size - left}` : circlePos.value.boundsX,
    boundsY: updateBounds ? `${-top}, ${size - top}` : circlePos.value.boundsY
  };
};

const paintCanvas = (hsxOverride = null) => {
  if (!ctx.value) return;

  const coords = hsxOverride ?? currentHsx.value;
  const h = coords.h;
  const isHsl = props.isHsl;

  hsw.value = {
    h,
    s: coords.s,
    w: isHsl ? coords.l : coords.v
  };

  const fillHsl = (h, s, l) => `hsl(${h}, ${s}%, ${100 - l}%)`;
  const fillHsv = (h, s, v) => Color.fromHsv({ h, s, v: 100 - v }).hex;
  const fill = isHsl ? fillHsl : fillHsv;

  const incr = 1;
  for (let s = 0; s < 100; s += incr) {
    for (let w = 0; w < 100; w += incr) {
      ctx.value.fillStyle = fill(h, s, w);
      ctx.value.fillRect(s, w, s + incr, w + incr);
    }
  }

  // Update circle position
  const x = hsw.value.s * scale.value;
  const y = props.size - hsw.value.w * scale.value;
  setCirclePos(x, y);
};

const pickCoord = (offsetX, offsetY) => {
  if (!Number.isFinite(offsetX) || !Number.isFinite(offsetY)) return;

  const size = props.size;
  const x = Math.min(size, Math.max(0, offsetX));
  const y = Math.min(size, Math.max(0, offsetY));

  const h = hsw.value?.h ?? currentHsx.value.h ?? props.color.hsl.h ?? 0;
  const w = Math.round(((size - y) / size) * 100);
  const sat = Math.round((x / size) * 100);

  const hsx = props.isHsl
    ? { h, s: sat, l: w }
    : { h, s: sat, v: w };

  const newColor = props.isHsl ? Color.fromHsl(hsx) : Color.fromHsv(hsx);

  setCirclePos(x, y);
  emit('variant-change', { color: newColor, hsx });
};

const onCanvasClick = (e) => {
  if (e.target.closest('.circle')) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  pickCoord(offsetX, offsetY);
};

const onMoveStart = () => {
  isDragging.value = true;
  const { left, top } = circlePos.value;
  setCirclePos(left, top, true);
};

const onMove = (e) => {
  pickCoord(e.posLeft, e.posTop);
};

const onMoveEnd = () => {
  isDragging.value = false;
  const { left, top } = circlePos.value;
  setCirclePos(left, top, true);
};

// Watch for external color changes
watch(
  () => [props.color, props.hsx, props.isHsl],
  () => {
    if (!isDragging.value) {
      nextTick(() => paintCanvas());
    }
  },
  { deep: true }
);

onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d');
  paintCanvas();
});
</script>

<style lang="scss" scoped>
.variant-square {
  display: block;
  margin: 5px -2px 0 -1px;
  border: solid 1px var(--vcp-border-color, #444);
  position: relative;

  &.light {
    border-color: #bbb;
  }

  canvas {
    display: block;
    cursor: crosshair;
    width: 160px;
    height: 160px;

    &.compact {
      width: 100px;
      height: 100px;
    }
  }

  .circle {
    height: 14px;
    width: 14px;
    border: solid 2px var(--vcp-knob-border, #eee);
    border-radius: 50%;
    box-shadow: 0 0 2px #000, inset 0 0 2px #000;
    position: absolute;
    margin: -7px;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &.light .circle {
    border-color: #fff;
    box-shadow: 0 0 2px #333, inset 0 0 2px #333;
  }
}
</style>
