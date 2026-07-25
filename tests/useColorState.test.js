import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { Color } from 'modern-color';
import { useColorState } from '../src/composables/useColorState.js';

function createHarness(initial = '#00ffff', options = {}) {
  const modelValue = ref(initial);
  const opts = ref(options);
  const emit = vi.fn();
  const api = useColorState(modelValue, opts, emit);
  return { modelValue, opts, emit, ...api };
}

describe('useColorState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes from the model value', () => {
    const { color } = createHarness('aqua');
    expect(color.value.hex).toBe('#00FFFF');
  });

  it('emits update:modelValue and preview on intent', () => {
    const { onColorIntent, emit } = createHarness('red');
    const next = Color.parse('blue');
    onColorIntent({ color: next, source: 'channel', hsx: null });
    expect(emit).toHaveBeenCalledWith('update:modelValue', '#0000FF');
    expect(emit).toHaveBeenCalledWith('preview', expect.any(Color));
  });

  it('setColorFromInput parses valid strings and rejects garbage', () => {
    const { setColorFromInput, color, emit } = createHarness('red');
    expect(setColorFromInput('lime')).toBe(true);
    expect(color.value.hex).toBe('#00FF00');
    emit.mockClear();
    expect(setColorFromInput('not-a-color!!!')).toBe(false);
    expect(emit).not.toHaveBeenCalled();
  });

  it('setHue merges into current polar coords', () => {
    const { setHue, color, hsx } = createHarness('#ff0000');
    setHue(120);
    expect(hsx.value.h).toBe(120);
    // red → green-ish after hue shift with s/l preserved
    expect(color.value.hsl.h).toBe(120);
  });

  it('pickColor emits the picked event', () => {
    const { pickColor, emit, color } = createHarness('fuchsia');
    pickColor();
    expect(emit).toHaveBeenCalledWith('picked', color.value);
  });

  it('persists advanced/mode to localStorage', async () => {
    const { advanced, mode } = createHarness('red', { advanced: false });
    advanced.value = true;
    mode.value = 'hsv';
    await nextTick();
    const saved = JSON.parse(localStorage.getItem('v-cpicker'));
    expect(saved).toEqual({ advanced: true, mode: 'hsv' });
  });

  it('loads saved state from localStorage on init', () => {
    localStorage.setItem(
      'v-cpicker',
      JSON.stringify({ advanced: true, mode: 'hsv' })
    );
    const { advanced, mode, isHsl } = createHarness('red');
    expect(advanced.value).toBe(true);
    expect(mode.value).toBe('hsv');
    expect(isHsl.value).toBe(false);
  });

  it('exposes hsw with dynamic Lum/Val label', async () => {
    const { hsw, mode } = createHarness('#336699');
    expect(hsw.value.wl).toBe('Lum');
    mode.value = 'hsv';
    await nextTick();
    expect(hsw.value.wl).toBe('Val');
  });

  it('ignores invalid color intents', () => {
    const { onColorIntent, emit, color } = createHarness('red');
    const before = color.value.hex;
    onColorIntent({ color: { r: NaN, g: 0, b: 0, alpha: 1 }, source: 'channel' });
    expect(emit).not.toHaveBeenCalled();
    expect(color.value.hex).toBe(before);
  });
});
