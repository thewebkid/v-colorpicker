import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { Color } from 'modern-color';
import AllFormatsPopover from '../src/components/AllFormatsPopover.vue';

function mountFormats(color) {
  return mount(AllFormatsPopover, {
    props: { color },
    global: {
      stubs: {
        // Render dialog content in-place instead of teleporting to <body>
        Teleport: { template: '<div><slot /></div>' },
      },
    },
  });
}

describe('AllFormatsPopover.vue', () => {
  let writeText;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists HEX, RGBA, HSLA, and HWB (no RGB)', async () => {
    const wrapper = mountFormats(Color.parse('#00ffff'));
    await wrapper.find('.formats-toggle').trigger('click');
    const labels = wrapper.findAll('.format-item label').map((n) => n.text());
    expect(labels).toEqual(['HEX', 'RGBA', 'HSLA', 'HWB']);
  });

  it('copies a format to the clipboard', async () => {
    const wrapper = mountFormats(Color.parse('#ff00ff'));
    await wrapper.find('.formats-toggle').trigger('click');
    await wrapper.findAll('.copy-btn')[0].trigger('click');
    expect(writeText).toHaveBeenCalledWith('#FF00FF');
    expect(wrapper.find('.copied-message').exists()).toBe(true);
  });

  it('shows HWB string for the current color', async () => {
    const wrapper = mountFormats(Color.parse('#00ffff'));
    await wrapper.find('.formats-toggle').trigger('click');
    const values = wrapper
      .findAll('.format-item input')
      .map((n) => n.element.value);
    expect(values.some((v) => v.startsWith('hwb('))).toBe(true);
  });
});
