<template>
  <div class="channel-input" :class="{ light, compact, active: activeRF }">
    <label class="inline" :style="{ fontWeight: activeRF ? 900 : 100 }">
      <span class="line" :style="{ background: bg }" v-if="showPreviewBar">
        <span class="pct" :style="{ top: pct * 100 + '%' }"></span>
      </span>
      {{ compact ? lbl.charAt(0) : lbl }}
    </label>
    <RangeFlyout
      v-model="value"
      :min="0"
      :max="max"
      :incr="incr"
      :slider-height="h"
      :slide-background="bg"
      :handle-bg="handleBg"
      :scheme="light ? 'light' : 'dark'"
      @update:model-value="onValueChange"
      @active="onActive"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RangeFlyout } from 'v-range-flyout';
import 'v-range-flyout/style.css';
import { channelGradient } from '../utils/color.js';

const props = defineProps({
  lbl: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  h: {
    type: Number,
    required: true
  },
  color: {
    type: Object,
    required: true
  },
  hsx: {
    type: Object,
    default: null
  },
  incrementVal: {
    type: Number,
    default: 1
  },
  compact: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  previewBars: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['channel-change']);

const activeRF = ref(false);
const isInit = ref(true);

const incr = computed(() => props.incrementVal);

const currentCoords = computed(() => {
  if (['r', 'g', 'b', 'a'].includes(props.channel)) {
    return props.color.rgbObj;
  }
  return props.hsx ?? (props.color.hsl ?? props.color.hsv);
});

const value = computed({
  get() {
    const v = currentCoords.value[props.channel];
    if (props.channel === 'a' && v === undefined) return 1;
    return v ?? 0;
  },
  set(newVal) {
    // Handled by onValueChange
  }
});

const bg = computed(() => {
  if (!props.color) return '';
  return channelGradient(props.color, props.channel);
});

const handleBg = computed(() => {
  return props.color?.hex ?? '#000000';
});

const pct = computed(() => {
  return 1 - value.value / props.max;
});

const showPreviewBar = computed(() => {
  return props.previewBars && !activeRF.value;
});

const onValueChange = (newVal) => {
  if (isInit.value) return;

  emit('channel-change', {
    channel: props.channel,
    value: newVal
  });
};

const onActive = (active) => {
  activeRF.value = active;
};

// Initialize
setTimeout(() => {
  isInit.value = false;
}, 123);
</script>

<style lang="scss" scoped>
.channel-input {
  position: relative;
  margin-top: 3px;

  &.compact {
    label.inline {
      width: 12px;

      .line {
        height: 36px;
      }
    }
  }

  label.inline {
    position: relative;
    margin: 0 12px -2px 2px;
    font-weight: 300;
    display: inline-block;
    width: 55px;
    text-align: right;

    .line {
      position: absolute;
      height: 42px;
      width: 8px;
      top: -12px;
      right: -72px;
      border-radius: 0 3px 3px 0;
      border: solid 0.7px var(--vcp-input-border, #666);
      z-index: 9;

      .pct {
        left: -2px;
        margin-top: -0.75px;
        position: absolute;
        width: 10px;
        height: 3px;
        background: transparent;
        border: solid 0.7px #888;
        display: inline-block;

        &:before {
          content: '';
          height: 4px;
          width: 5px;
          position: absolute;
          left: -1px;
          top: -1.5px;
          background-color: var(--vcp-text, #eee);
          clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
        }
      }
    }
  }

  &.light {
    label.inline {
      .line {
        .pct {
          border-color: #ddd;

          &:before {
            background-color: #444;
          }
        }
      }
    }
  }

  &.active {
    label.inline {
      font-weight: 900;
    }
  }
}

// Override v-range-flyout styles to match original design
:deep(.range-flyout-wrapper) {
  display: inline-block;
}

:deep(input[type='number']) {
  position: relative;
  left: -1px;
  background: var(--vcp-input-bg, linear-gradient(180deg, #111, #000));
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vcp-input-color, #eee);
  background-clip: padding-box;
  border: 0.7px solid var(--vcp-input-border, #777);
  border-radius: 0.25rem 0 0 0.25rem;
  border-right: 0;
  width: 60px;
  height: 42px;
  padding: 0.25rem 0 0.25rem 0.375rem;

  &:active,
  &:focus {
    outline: none;
    border: 1px solid var(--vcp-input-focus-border, #fff);
    box-shadow: 0px 0px 5px var(--vcp-input-focus-shadow, #fff);
  }
}

&.compact :deep(input[type='number']) {
  font-size: 0.9rem;
  line-height: 1;
  height: 36px;
  padding: 0.125rem 0 0.125rem 0.375rem;
}

:deep(.flyout) {
  background: var(--vcp-bg, linear-gradient(180deg, #444, #111, #000));
  top: 0;
  left: 62px;
  z-index: 10;

  .inner {
    box-shadow: none;
    border-radius: 3px;
  }
}
</style>
