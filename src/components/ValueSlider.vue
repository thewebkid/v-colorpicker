<template>
  <div class="value-slider" :class="{ compact }">
    <div
      class="gradient-bar"
      :style="{ backgroundImage: gradientStyle }"
      @click="onClick"
    >
      <v-movable
        class="bar"
        axis="x"
        :left="sliderPos"
        :boundsX="boundsX"
        :style="{ background: sliderBg }"
        @move="onMove"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

const emit = defineEmits(['value-change']);

const scale = computed(() => (props.compact ? 1 : 2));
const w = computed(() => (props.compact ? 100 : 200));

const hsv = computed(() => props.color.hsv);
const sliderPos = computed(() => hsv.value.v * scale.value);

const boundsX = computed(() => {
  const pos = sliderPos.value;
  return `${-pos}, ${w.value - pos}`;
});

const gradientStyle = computed(() => {
  const { h, s } = hsv.value;
  const g0 = new Color({ h, s, v: 0 }).hex;
  const g100 = new Color({ h, s, v: 100 }).hex;
  return `linear-gradient(90deg, ${g0}, ${g100})`;
});

const sliderBg = computed(() => {
  const { h, s, v } = hsv.value;
  return new Color({ h, s, v }).hex;
});

const setValue = (x) => {
  const v = Math.max(0, Math.min(100, Math.round(x / scale.value)));
  emit('value-change', v);
};

const onClick = (e) => {
  if (e.target.closest('.bar')) return;
  setValue(e.offsetX);
};

const onMove = (e) => {
  setValue(e.posLeft);
};
</script>

<style lang="scss" scoped>
.value-slider {
  position: relative;

  .gradient-bar {
    position: relative;
    height: 20px;
    width: 200px;
    background: linear-gradient(90deg, black, white);
    border: solid 1px var(--vcp-border-color, #444);
    border-radius: 3px;
    margin: 0 0 10px 10px;
    cursor: pointer;

    &.compact {
      width: 100px;
    }
  }

  .bar {
    height: 24px;
    width: 12px;
    margin: -3px -6px -2px -6px;
    position: absolute;
    border-radius: 3px;
    border: solid 1px var(--vcp-handle-border, #444);
    cursor: grab;

    &:active {
      cursor: grabbing;
      border-color: var(--vcp-input-border, #777);
    }
  }
}

.light .value-slider {
  .gradient-bar {
    border: solid 1px #ddd;
  }

  .bar {
    border: solid 1px #ddd;
  }
}
</style>
