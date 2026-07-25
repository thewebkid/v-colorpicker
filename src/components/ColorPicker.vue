<template>
  <div class="colorpicker-wrap" :class="{ light: opt('light'), compact: opt('compact') }">
    <div class="top" v-if="advanced">
      <HueBar
        :hue="hsw.h"
        :color="color"
        :compact="opt('compact')"
        @hue-change="setHue"
      />
    </div>

    <div class="picker-body" :class="{ 'simple-mode': !advanced }">
      <!-- Advanced mode -->
      <template v-if="advanced">
        <div class="channels-row">
          <div class="input-col">
            <ChannelInput
              v-for="label in rgbLabels"
              :key="label"
              :lbl="label"
              :channel="label.charAt(0).toLowerCase()"
              :max="255"
              :h="128"
              :color="color"
              :hsx="hsx"
              :compact="opt('compact')"
              :light="opt('light')"
              :preview-bars="opt('previewBars')"
              @channel-change="onChannelChange"
            />

            <template v-if="!opt('alphaHidden')">
              <ChannelInput
                v-if="opt('compact') || color.alpha !== undefined"
                lbl="Alpha"
                channel="a"
                :max="1"
                :increment-val="0.01"
                :h="100"
                :color="color"
                :hsx="hsx"
                :compact="opt('compact')"
                :light="opt('light')"
                :preview-bars="opt('previewBars')"
                @channel-change="onChannelChange"
              />
              <a v-else @click="addAlpha" class="add-alpha-link">+ Alpha</a>
            </template>
          </div>

          <div class="input-col" v-if="hsw">
            <ChannelInput
              lbl="Hue"
              channel="h"
              :max="359"
              :h="180"
              :color="color"
              :hsx="hsx"
              :compact="opt('compact')"
              :light="opt('light')"
              :preview-bars="opt('previewBars')"
              @channel-change="onChannelChange"
            />
            <ChannelInput
              lbl="Sat"
              channel="s"
              :max="100"
              :h="100"
              :color="color"
              :hsx="hsx"
              :compact="opt('compact')"
              :light="opt('light')"
              :preview-bars="opt('previewBars')"
              @channel-change="onChannelChange"
            />
            <ChannelInput
              :lbl="hsw.wl"
              :channel="isHsl ? 'l' : 'v'"
              :max="100"
              :h="100"
              :color="color"
              :hsx="hsx"
              :compact="opt('compact')"
              :light="opt('light')"
              :preview-bars="opt('previewBars')"
              @channel-change="onChannelChange"
            />

            <div class="hsl-toggle" v-if="opt('hslToggle') && !opt('compact')">
              <div class="btn-group">
                <button :class="{ active: mode === 'hsl' }" @click="mode = 'hsl'">HSL</button>
                <button :class="{ active: mode === 'hsv' }" @click="mode = 'hsv'">HSV</button>
              </div>
            </div>

            <div class="hex-input-compact" v-if="opt('compact')">
              <input
                type="text"
                v-model="hexVal"
                @change="onHexChange"
                class="hex"
                placeholder="#000000"
              />
            </div>
          </div>

          <div class="variant-col">
            <VariantSquare
              :color="color"
              :hsx="hsx"
              :is-hsl="isHsl"
              :size="opt('compact') ? 100 : 160"
              :light="opt('light')"
              @variant-change="onVariantChange"
            />
            <div class="hsl-toggle-compact" v-if="opt('hslToggle') && opt('compact')">
              <div class="btn-group">
                <button :class="{ active: mode === 'hsl' }" @click="mode = 'hsl'">HSL</button>
                <button :class="{ active: mode === 'hsv' }" @click="mode = 'hsv'">HSV</button>
              </div>
            </div>
          </div>
        </div>

        <hr v-if="!opt('compact')" />
      </template>

      <!-- Simple mode -->
      <template v-else>
        <div class="simple-canvas-row">
          <SimpleCanvas
            :color="color"
            :compact="opt('compact')"
            @variant-change="onVariantChange"
          />
        </div>
      </template>

      <!-- Bottom row -->
      <div class="bottom-row">
        <div class="mode-checkbox" v-if="opt('allowModeChange')">
          <label class="checkbox-label">
            <input type="checkbox" v-model="advanced" />
            <span>Advanced</span>
          </label>
        </div>

        <div class="hex-section" v-if="advanced">
          <div class="hex-input" v-if="!opt('compact')">
            <AllFormatsPopover :color="color" v-if="opt('formatsPopup')" />
            <input
              type="text"
              v-model="hexVal"
              @change="onHexChange"
              class="hex"
              placeholder="#000000"
            />
          </div>
        </div>

        <div class="value-slider" v-else>
          <ValueSlider
            :color="color"
            :compact="opt('compact')"
            @value-change="onValueChange"
          />
        </div>

        <div class="ok-section">
          <button class="ok-btn" :class="{ light: opt('light') }" @click="pickColor">
            OK
            <span class="swatch" :style="{ backgroundColor: color.rgbString }"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Color } from 'modern-color';
import { useColorState } from '../composables/useColorState.js';
import HueBar from './HueBar.vue';
import ChannelInput from './ChannelInput.vue';
import VariantSquare from './VariantSquare.vue';
import SimpleCanvas from './SimpleCanvas.vue';
import ValueSlider from './ValueSlider.vue';
import AllFormatsPopover from './AllFormatsPopover.vue';

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '#4682B4'
  },
  options: {
    type: Object,
    default: () => ({})
  },
  debug: {
    type: Boolean,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue', 'preview', 'picked']);

const defaultOptions = {
  sticky: true,
  compact: false,
  light: false,
  allowModeChange: true,
  advanced: false,
  alpha: undefined,
  alphaHidden: false,
  formatsPopup: true,
  previewBars: true,
  hslToggle: true
};

const opt = (optionString) => {
  if (!props.options || props.options[optionString] === undefined) {
    return defaultOptions[optionString];
  }
  return props.options[optionString];
};

// Use color state composable
const {
  model,
  mode,
  advanced,
  color,
  hsx,
  isHsl,
  hsw,
  setHue,
  onColorIntent,
  setColorFromInput,
  pickColor
} = useColorState(
  computed(() => props.modelValue),
  computed(() => props.options),
  emit
);

// Local state
const hexVal = ref('');
const rgbLabels = ['Red', 'Green', 'Blue'];

// Sync hex value with color
watch(color, (newColor) => {
  hexVal.value = newColor.hex;
}, { immediate: true });

// Channel change handler
const onChannelChange = ({ channel, value }) => {
  const currentColor = color.value;

  if (['r', 'g', 'b', 'a'].includes(channel)) {
    // RGB or Alpha channel
    const rgbObj = { ...currentColor.rgbObj, [channel]: value };
    const newColor = new Color(rgbObj);
    onColorIntent({
      color: newColor,
      source: 'channel',
      hsx: null
    });
  } else {
    // HSL/HSV channel
    const base = hsx.value ?? (isHsl.value ? currentColor.hsl : currentColor.hsv);
    const newHsx = { ...base, [channel]: value };
    const newColor = isHsl.value ? Color.fromHsl(newHsx) : Color.fromHsv(newHsx);
    newColor.a = currentColor.alpha;

    onColorIntent({
      color: newColor,
      source: 'channel',
      hsx: newHsx,
      space: mode.value
    });
  }
};

// Variant square change handler
const onVariantChange = ({ color: newColor, hsx: newHsx }) => {
  newColor.a = color.value.alpha;
  onColorIntent({
    color: newColor,
    source: 'canvas',
    hsx: newHsx,
    space: mode.value
  });
};

// Value slider change handler (simple mode)
const onValueChange = (v) => {
  const hsv = { ...color.value.hsv, v };
  const newColor = Color.fromHsv(hsv);
  newColor.a = color.value.alpha;

  onColorIntent({
    color: newColor,
    source: 'simple',
    hsx: hsv,
    space: 'hsv'
  });
};

// Hex input change
const onHexChange = () => {
  setColorFromInput(hexVal.value);
};

// Add alpha channel
const addAlpha = () => {
  if (color.value.alpha === undefined || color.value.alpha === 1) {
    const rgbObj = { ...color.value.rgbObj, a: 1 };
    const newColor = new Color(rgbObj);
    onColorIntent({
      color: newColor,
      source: 'input',
      hsx: null
    });
  }
};

// Initialize alpha if needed
if (opt('alpha')) {
  addAlpha();
}
</script>

<style lang="scss" scoped>
.colorpicker-wrap {
  /* Themeable CSS custom properties — override any of these on the component
     or an ancestor to re-skin the picker. */
  --vcp-bg: linear-gradient(180deg, #444, #222, #111, #000);
  --vcp-text: #eee;
  --vcp-border-color: #444;
  --vcp-box-shadow: 0 0 3px #777777;
  --vcp-input-bg: linear-gradient(180deg, #111, #000);
  --vcp-input-color: #eee;
  --vcp-input-border: #777;
  --vcp-input-focus-border: #fff;
  --vcp-input-focus-shadow: #fff;
  --vcp-link-color: #6cf;
  --vcp-accent: #28a745;
  --vcp-accent-text: #fff;
  --vcp-btn-bg: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  --vcp-btn-color: #eee;
  --vcp-btn-border: #444;
  --vcp-hr-color: #555;
  --vcp-toggle-border: #666;
  --vcp-radius: 8px;

  display: inline-block;
  background: var(--vcp-bg);
  color: var(--vcp-text);
  box-shadow: var(--vcp-box-shadow);
  border-radius: var(--vcp-radius);
  padding: 17px 10px 5px 10px;

  &.light {
    --vcp-bg: linear-gradient(180deg, #f7f7f7, #e7e7e7, #e3e3e3);
    --vcp-text: #111;
    --vcp-box-shadow: 0 0 3px #999;
    --vcp-input-bg: linear-gradient(180deg, #fff, #fff);
    --vcp-input-color: #111;
    --vcp-input-border: #aaa;
    --vcp-input-focus-border: #4d90fe;
    --vcp-input-focus-shadow: #4d90fe;
    --vcp-link-color: #007bff;
    --vcp-btn-bg: linear-gradient(180deg, #e7e7e7, #d3d3d3);
    --vcp-btn-color: #111;
    --vcp-btn-border: #ccc;
    --vcp-hr-color: #ccc;

    a {
      color: var(--vcp-link-color);
      &:hover {
        color: #0056b3;
      }
    }
  }

  a {
    color: var(--vcp-link-color);
    cursor: pointer;
  }

  &.compact {
    padding: 13px 6px 1px 6px;

    hr {
      margin: 3px 0 -3px -7px;
    }
  }

  .top {
    margin-bottom: 8px;
  }

  .picker-body {
    &.simple-mode {
      .simple-canvas-row {
        margin-bottom: 8px;
      }
    }
  }

  .channels-row {
    display: flex;
    gap: 8px;

    .input-col {
      padding-top: 12px;
      width: 144px;

      &:first-child {
        flex-shrink: 0;
      }
    }

    .variant-col {
      padding: 12px 16px 0 4px;
      flex-shrink: 0;
    }
  }

  &.compact .channels-row {
    .input-col {
      width: 101px;
    }
  }

  .add-alpha-link {
    margin-top: 19px;
    display: block;
    cursor: pointer;
  }

  .hsl-toggle,
  .hsl-toggle-compact {
    margin-top: 12px;
    text-align: right;
    padding-right: 13px;
    font-size: 13px;

    .btn-group {
      display: inline-flex;
      font-size: 0.75rem;

      button {
        padding: 0.25rem 0.5rem;
        background: transparent;
        border: 1px solid var(--vcp-toggle-border);
        color: inherit;
        cursor: pointer;

        &:first-child {
          border-radius: 3px 0 0 3px;
        }

        &:last-child {
          border-radius: 0 3px 3px 0;
          border-left: none;
        }

        &.active {
          background: var(--vcp-accent);
          border-color: var(--vcp-accent);
          color: var(--vcp-accent-text);
        }
      }
    }
  }

  .hsl-toggle-compact {
    padding-right: 0;
    margin-top: 5px;
  }

  hr {
    border-color: var(--vcp-hr-color);
    margin-left: -7px;
    position: relative;
    left: -3px;
    border: none;
    border-top: 1px solid var(--vcp-hr-color);
  }

  .bottom-row {
    display: flex;
    align-items: flex-start;
    padding-top: 8px;
    gap: 12px;

    .mode-checkbox {
      padding-top: 8px;

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 14px;

        input[type="checkbox"] {
          cursor: pointer;
        }
      }
    }

    .hex-section {
      flex: 1;

      .hex-input {
        display: inline-block;
        text-align: right;

        input[type="text"].hex {
          width: 80px;
          height: 42px;
          padding: 0.25rem 0 0.25rem 0.375rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          background: var(--vcp-input-bg);
          color: var(--vcp-input-color);
          border: 0.7px solid var(--vcp-input-border);
          border-radius: 0.25rem;
          margin-left: 8px;

          &:active,
          &:focus {
            outline: none;
            border: 1px solid var(--vcp-input-focus-border);
            box-shadow: 0px 0px 5px var(--vcp-input-focus-shadow);
          }
        }
      }
    }

    .value-slider {
      flex: 1;
      padding-top: 8px;
    }

    .ok-section {
      padding-top: 1px;

      .ok-btn {
        background: var(--vcp-btn-bg);
        cursor: pointer;
        border: 1px solid var(--vcp-btn-border);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
        padding: 6px 10px 6px 20px;
        color: var(--vcp-btn-color);
        font-size: 14px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 5px;

        .swatch {
          display: inline-block;
          height: 15px;
          width: 15px;
          border-radius: 2px;
          box-shadow: 0 0 1px #fff, inset 0 0 1px rgba(0, 0, 0, 0.5);
          background: white;
        }
      }
    }
  }

  .hex-input-compact {
    margin-top: 8px;

    input[type="text"].hex {
      width: 100%;
      height: 36px;
      padding: 0.125rem 0 0.125rem 0.375rem;
      font-size: 0.9rem;
      line-height: 1;
      background: var(--vcp-input-bg);
      color: var(--vcp-input-color);
      border: 0.7px solid var(--vcp-input-border);
      border-radius: 0.25rem;

      &:active,
      &:focus {
        outline: none;
        border: 1px solid var(--vcp-input-focus-border);
        box-shadow: 0px 0px 5px var(--vcp-input-focus-shadow);
      }
    }
  }
}
</style>
