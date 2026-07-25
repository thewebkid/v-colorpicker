<template>
  <div class="simple-canvas" :class="{ compact }">
    <canvas
      ref="canvasRef"
      :width="720"
      :height="200"
      :class="{ compact }"
      @click="onCanvasClick"
    />
    <v-movable
      class="circle"
      :left="x"
      :top="y"
      :boundsX="boundsX"
      :boundsY="boundsY"
      @move="onMove"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Color } from 'modern-color';

const props = defineProps({
  color: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['variant-change']);

const canvasRef = ref(null);
const ctx = ref(null);
const x = ref(0);
const y = ref(0);
const pureHS = ref({ h: 0, s: 0 });

const scale = computed(() => (props.compact ? 1 : 1.25));
const h = computed(() => (props.compact ? 100 : 125));
const w = computed(() => (props.compact ? 360 : 449));

const boundsX = computed(() => `${-x.value}, ${w.value - x.value}`);
const boundsY = computed(() => `${-y.value}, ${h.value - y.value}`);

const render = () => {
  if (!ctx.value) return;

  const hsv = props.color.hsv;
  const v = hsv.v;
  const fill = (h, s) => new Color({ h, s, v }).hex;

  ctx.value.clearRect(0, 0, 720, 200);
  const unitSize = 2;
  const incr = 2;

  for (let h = 0; h < 360; h += incr) {
    for (let w = 0; w < 100; w += incr) {
      ctx.value.fillStyle = fill(h, w);
      ctx.value.fillRect(h * unitSize, w * unitSize, (h + incr) * unitSize, (w + incr) * unitSize);
    }
  }
};

const updatePosition = () => {
  const hsv = props.color.hsv;
  pureHS.value = { h: hsv.h, s: hsv.s };
  x.value = Math.max(0, Math.min(Math.round(hsv.h * scale.value), w.value));
  y.value = hsv.s * scale.value;
};

const pickCoord = (offsetX, offsetY) => {
  const newX = Math.max(0, Math.min(w.value, offsetX));
  const newY = Math.max(0, Math.min(h.value, offsetY));

  x.value = newX;
  y.value = newY;

  const scaleInv = 1 / scale.value;
  const s = Math.round(newY * scaleInv);
  const h = Math.max(0, Math.min(Math.round(newX * scaleInv), 359));

  const hsv = { h, s, v: props.color.hsv.v };
  pureHS.value = { h, s };

  const newColor = Color.fromHsv(hsv);
  emit('variant-change', { color: newColor, hsx: hsv });
};

const onCanvasClick = (e) => {
  if (e.target.closest('.circle')) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  pickCoord(offsetX, offsetY);
};

const onMove = (e) => {
  pickCoord(e.posLeft, e.posTop);
};

watch(
  () => props.color,
  () => {
    render();
  },
  { deep: true }
);

onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d');
  updatePosition();
  render();
});
</script>

<style lang="scss" scoped>
.simple-canvas {
  position: relative;
  display: block;
  margin: -10px 9px 8px -3px;

  canvas {
    display: block;
    cursor: crosshair;
    width: 450px;
    height: 125px;

    &.compact {
      width: 360px;
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
}
</style>
