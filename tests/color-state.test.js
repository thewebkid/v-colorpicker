import { describe, it, expect } from 'vitest';
import { Color } from 'modern-color';
import {
  finiteOr,
  isValidColor,
  normalizeHsx,
  createColorModel,
  colorToValue,
} from '../src/composables/useColorState.js';

describe('finiteOr', () => {
  it('returns finite numbers as-is', () => {
    expect(finiteOr(0)).toBe(0);
    expect(finiteOr(42.5)).toBe(42.5);
  });

  it('falls back for non-finite values', () => {
    expect(finiteOr(NaN)).toBeNull();
    expect(finiteOr(Infinity, 7)).toBe(7);
    expect(finiteOr(undefined, 3)).toBe(3);
  });
});

describe('isValidColor', () => {
  it('accepts a real Color', () => {
    expect(isValidColor(Color.parse('#ff0000'))).toBe(true);
  });

  it('rejects null / incomplete objects', () => {
    expect(isValidColor(null)).toBe(false);
    expect(isValidColor({ r: 1, g: 2, b: NaN, alpha: 1 })).toBe(false);
  });
});

describe('normalizeHsx', () => {
  it('preserves explicit polar coords', () => {
    const color = Color.fromHsl({ h: 200, s: 50, l: 40 });
    const hsx = normalizeHsx({ h: 200, s: 50, l: 40 }, { color, space: 'hsl' });
    expect(hsx).toEqual({ h: 200, s: 50, l: 40 });
  });

  it('keeps sticky hue when saturation hits 0', () => {
    const color = Color.parse('#808080'); // grayscale
    const hsx = normalizeHsx(null, {
      color,
      space: 'hsl',
      prevHsx: { h: 280, s: 40, l: 50 },
    });
    expect(hsx).toEqual({ h: 280, s: 0, l: color.hsl.l });
  });

  it('returns null for saturated colors without explicit hsx', () => {
    const color = Color.parse('#ff0000');
    expect(normalizeHsx(null, { color, space: 'hsl' })).toBeNull();
  });

  it('builds hsv shape when space is hsv', () => {
    const color = Color.fromHsv({ h: 90, s: 80, v: 70 });
    const hsx = normalizeHsx({ h: 90, s: 80, v: 70 }, { color, space: 'hsv' });
    expect(hsx).toEqual({ h: 90, s: 80, v: 70 });
  });
});

describe('createColorModel', () => {
  it('wraps a color with defaults', () => {
    const color = Color.parse('aqua');
    const model = createColorModel(color);
    expect(model.color).toBe(color);
    expect(model.space).toBe('hsl');
    expect(model.source).toBe('external');
  });

  it('carries sticky hue from prev model', () => {
    const gray = Color.parse('#888');
    const prev = createColorModel(Color.fromHsl({ h: 42, s: 60, l: 50 }), {
      space: 'hsl',
      source: 'channel',
      hsx: { h: 42, s: 60, l: 50 },
    });
    const next = createColorModel(gray, { space: 'hsl', source: 'channel' }, prev);
    expect(next.hsx?.h).toBe(42);
    expect(next.hsx?.s).toBe(0);
  });
});

describe('colorToValue', () => {
  it('returns hex for opaque colors', () => {
    const c = Color.parse('#00ffff');
    expect(colorToValue(c)).toBe('#00FFFF');
  });

  it('returns css for translucent colors', () => {
    const c = Color.parse('rgba(0,255,255,0.5)');
    expect(colorToValue(c)).toMatch(/rgba?\(/);
    expect(colorToValue(c)).not.toMatch(/^#/);
  });
});
