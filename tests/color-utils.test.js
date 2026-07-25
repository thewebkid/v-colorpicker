import { describe, it, expect } from 'vitest';
import { Color } from 'modern-color';
import { hueGradient, channelGradient, hueColorStops } from '../src/utils/color.js';

describe('hueGradient', () => {
  it('returns a comma-separated list of CSS color stops', () => {
    const stops = hueGradient(60);
    expect(stops).toContain('%');
    expect(stops.split(',').length).toBeGreaterThan(4);
  });

  it('uses HSL when no hsx is provided', () => {
    const stops = hueGradient(90);
    expect(stops).toMatch(/rgba?\(|hsla?\(|hwb\(/i);
  });

  it('accepts HSV polar coords', () => {
    const stops = hueGradient(90, { h: 0, s: 80, v: 90 });
    expect(typeof stops).toBe('string');
    expect(stops.length).toBeGreaterThan(20);
  });
});

describe('channelGradient', () => {
  const color = Color.parse('#336699');

  it('returns the hue stops for channel h', () => {
    expect(channelGradient(color, 'h')).toBe(
      `linear-gradient(0deg, ${hueColorStops})`
    );
  });

  it('builds RGB channel gradients', () => {
    const g = channelGradient(color, 'r');
    expect(g.startsWith('linear-gradient(')).toBe(true);
    expect(g).toContain('rgb');
  });

  it('builds a three-stop luminosity gradient', () => {
    const g = channelGradient(color, 'l');
    // mid + ends = three rgb values
    expect(g.match(/rgb\(/g)?.length).toBe(3);
  });

  it('builds an alpha gradient', () => {
    const g = channelGradient(color, 'a');
    expect(g.startsWith('linear-gradient(')).toBe(true);
  });

  it('builds saturation / value gradients', () => {
    expect(channelGradient(color, 's')).toMatch(/^linear-gradient\(/);
    expect(channelGradient(color, 'v')).toMatch(/^linear-gradient\(/);
  });
});
