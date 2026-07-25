import { ref, computed, watch } from 'vue';
import { Color } from 'modern-color';

/**
 * @typedef {'hsl' | 'hsv'} ColorSpace
 * @typedef {'canvas' | 'hue' | 'channel' | 'input' | 'external' | 'simple'} ColorSource
 */

/**
 * Picker-owned color state. Color instances stay pure —
 * polar coords (`hsx`) and provenance (`source`) live here, not on Color.
 *
 * @typedef {Object} ColorModel
 * @property {Color} color
 * @property {ColorSpace} space
 * @property {ColorSource} source
 * @property {Record<string, number> | null} hsx  explicit {h,s,l} or {h,s,v} when last edit was in HS*
 */

/** @param {unknown} n @param {number | null} [fallback] */
export const finiteOr = (n, fallback = null) =>
  Number.isFinite(n) ? /** @type {number} */ (n) : fallback;

/**
 * modern-color can emit `#NANNANNAN` when HSL/HSV channels are non-finite.
 * @param {Color | null | undefined} color
 */
export const isValidColor = (color) =>
  !!color &&
  Number.isFinite(color.r) &&
  Number.isFinite(color.g) &&
  Number.isFinite(color.b) &&
  Number.isFinite(color.alpha);

/**
 * Keep a usable hue when saturation hits 0 (RGB→HSL makes hue undefined/0)
 * and scrub non-finite polar channels so the model never stores NaNs.
 */
export const normalizeHsx = (hsx, { color, space, prevHsx = null }) => {
  const derived = space === 'hsl' ? color.hsl : color.hsv;
  const prevH = finiteOr(prevHsx?.h);

  if (hsx) {
    const h = finiteOr(hsx.h, prevH ?? finiteOr(derived.h, 0));
    const s = finiteOr(hsx.s, finiteOr(derived.s, 0));
    if (space === 'hsl') {
      return { h, s, l: finiteOr(hsx.l, finiteOr(derived.l, 0)) };
    }
    return { h, s, v: finiteOr(hsx.v, finiteOr(derived.v, 0)) };
  }

  // No explicit polar lock — for grayscale, keep the last hue
  if (derived.s === 0 && prevH != null) {
    return space === 'hsl'
      ? { h: prevH, s: 0, l: derived.l }
      : { h: prevH, s: 0, v: derived.v };
  }

  return null;
};

/**
 * @param {Color} color
 * @param {{ space?: ColorSpace, source?: ColorSource, hsx?: Record<string, number> | null }} [opts]
 * @param {ColorModel | null} [prev] previous model — supplies sticky hue
 * @returns {ColorModel}
 */
export const createColorModel = (
  color,
  { space = 'hsl', source = 'external', hsx = null } = {},
  prev = null
) => ({
  color,
  space,
  source,
  hsx: isValidColor(color)
    ? normalizeHsx(hsx, {
        color,
        space,
        prevHsx: prev?.hsx ?? null,
      })
    : null,
});

/**
 * Attribute / form-friendly string that round-trips alpha when needed.
 */
export const colorToValue = (color) =>
  color.alpha < 1 ? color.css : color.hex;

/**
 * Vue 3 composable for color picker state management
 * @param {import('vue').Ref<string|Color>} modelValue - v-model value
 * @param {import('vue').Ref<Object>} options - picker options
 * @param {(event: string, ...args: any[]) => void} emit - Vue emit function
 */
export function useColorState(modelValue, options, emit) {
  const mode = ref('hsl');
  const advanced = ref(false);
  const savedState = ref({});

  // Initialize with a default or provided color
  const initialColor = modelValue.value
    ? Color.parse(modelValue.value)
    : Color.parse('#4682B4');

  const model = ref(createColorModel(initialColor, {
    space: mode.value,
    source: 'external'
  }));

  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('v-cpicker');
      if (saved) {
        savedState.value = JSON.parse(saved);
        if (!savedState.value.mode) {
          savedState.value.mode = 'hsl';
        }
        advanced.value = savedState.value.advanced ?? options.value?.advanced ?? false;
        mode.value = savedState.value.mode;
      } else {
        advanced.value = options.value?.advanced ?? false;
        savedState.value = {
          advanced: advanced.value,
          mode: 'hsl'
        };
        localStorage.setItem('v-cpicker', JSON.stringify(savedState.value));
      }
    } catch (e) {
      console.warn('Failed to load saved color picker state:', e);
      advanced.value = options.value?.advanced ?? false;
      mode.value = 'hsl';
    }
  };

  // Persist state changes
  watch([advanced, mode], () => {
    savedState.value = {
      advanced: advanced.value,
      mode: mode.value
    };
    try {
      localStorage.setItem('v-cpicker', JSON.stringify(savedState.value));
    } catch (e) {
      console.warn('Failed to save color picker state:', e);
    }
  });

  // Single write path for picker state
  const applyModel = (newModel, { emit: shouldEmit = true } = {}) => {
    if (!isValidColor(newModel.color)) {
      return;
    }

    // Re-run through createColorModel so sticky hue / hsx scrub always apply
    const processed = createColorModel(
      newModel.color,
      { space: newModel.space, source: newModel.source, hsx: newModel.hsx },
      model.value
    );

    model.value = processed;

    if (shouldEmit) {
      const value = colorToValue(processed.color);
      emit('update:modelValue', value);
      emit('preview', processed.color);
    }
  };

  // Handle color intent from child components
  const onColorIntent = ({ color, source, hsx = null, space = null }) => {
    if (!isValidColor(color)) return;

    applyModel(
      createColorModel(
        color,
        {
          source,
          hsx,
          space: space ?? mode.value,
        },
        model.value
      )
    );
  };

  // Set color from hex/text input
  const setColorFromInput = (inputValue) => {
    const color = Color.parse(inputValue);
    if (!color || !isValidColor(color)) {
      console.log(`ignored unparsable input: ${inputValue}`);
      return false;
    }

    applyModel(
      createColorModel(
        color,
        {
          source: 'input',
          space: mode.value,
          hsx: null,
        },
        model.value
      )
    );
    return true;
  };

  // Hue bar only sends `{ h }`; merge into current HS* coords
  const setHue = (h) => {
    const base = model.value.hsx ?? (mode.value === 'hsl' ? model.value.color.hsl : model.value.color.hsv);
    const hsx = { ...base, h };
    let color = mode.value === 'hsl' ? Color.fromHsl(hsx) : Color.fromHsv(hsx);
    color.a = model.value.color.alpha;

    applyModel(
      createColorModel(color, { source: 'hue', space: mode.value, hsx }, model.value)
    );
  };

  // Confirm color pick
  const pickColor = () => {
    emit('picked', model.value.color);
  };

  // Watch for external model value changes
  watch(modelValue, (newValue) => {
    if (!newValue) return;
    const color = Color.parse(newValue);
    if (color && isValidColor(color)) {
      const currentValue = colorToValue(model.value.color);
      const newValueStr = colorToValue(color);
      if (currentValue !== newValueStr) {
        applyModel(
          createColorModel(
            color,
            { space: mode.value, source: 'external', hsx: null },
            model.value
          ),
          { emit: false }
        );
      }
    }
  });

  // Watch mode changes
  watch(mode, (newMode) => {
    if (model.value.space !== newMode) {
      applyModel(
        createColorModel(
          model.value.color,
          { space: newMode, source: 'external', hsx: null },
          model.value
        ),
        { emit: false }
      );
    }
  });

  // Initialize
  loadSavedState();

  return {
    model,
    mode,
    advanced,
    savedState,
    applyModel,
    onColorIntent,
    setColorFromInput,
    setHue,
    pickColor,
    // Computed helpers
    color: computed(() => model.value.color),
    hsx: computed(() => model.value.hsx),
    source: computed(() => model.value.source),
    isHsl: computed(() => mode.value === 'hsl'),
    hsw: computed(() => {
      const c = model.value.color;
      const isHslMode = mode.value === 'hsl';
      const hsw = isHslMode ? c.hsl : c.hsv;
      return {
        ...hsw,
        w: isHslMode ? hsw.l : hsw.v,
        wl: isHslMode ? 'Lum' : 'Val'
      };
    }),
  };
}
