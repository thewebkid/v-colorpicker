import { describe, it, expect, vi } from 'vitest';
import { createApp } from 'vue';
import plugin, { ColorPicker } from '../src/index.js';

describe('plugin install', () => {
  it('exports ColorPicker and a default installable plugin', () => {
    expect(ColorPicker).toBeTruthy();
    expect(typeof plugin.install).toBe('function');
  });

  it('registers ColorPicker and colorpicker globally', () => {
    const app = createApp({ template: '<div />' });
    const useSpy = vi.fn();
    const componentSpy = vi.fn();
    app.use = useSpy;
    app.component = componentSpy;

    // Call install directly so we can assert registrations without
    // actually mounting lit-movable custom elements.
    plugin.install({
      use: useSpy,
      component: componentSpy,
    });

    expect(useSpy).toHaveBeenCalled();
    expect(componentSpy).toHaveBeenCalledWith('ColorPicker', ColorPicker);
    expect(componentSpy).toHaveBeenCalledWith('colorpicker', ColorPicker);
  });
});
