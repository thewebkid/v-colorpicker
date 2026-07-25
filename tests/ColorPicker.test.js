import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import ColorPicker from '../src/components/ColorPicker.vue';

// Child components that paint canvas / drag — stub to keep unit tests focused.
const stubs = {
  HueBar: true,
  VariantSquare: true,
  SimpleCanvas: true,
  ValueSlider: true,
  ChannelInput: {
    name: 'ChannelInput',
    props: ['lbl', 'channel', 'max', 'color'],
    template: '<div class="channel-stub" :data-channel="channel">{{ lbl }}</div>',
  },
  AllFormatsPopover: {
    name: 'AllFormatsPopover',
    props: ['color'],
    template: '<button class="formats-stub">All formats</button>',
  },
  VMovable: true,
  RangeFlyout: true,
};

function mountPicker(props = {}) {
  return mount(ColorPicker, {
    props: {
      modelValue: 'aqua',
      options: {
        light: true,
        advanced: true,
        allowModeChange: true,
        formatsPopup: true,
        previewBars: true,
        hslToggle: true,
        compact: false,
      },
      ...props,
    },
    global: { stubs },
  });
}

describe('ColorPicker.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders advanced mode with channel stubs and hex input', () => {
    const wrapper = mountPicker();
    expect(wrapper.find('.colorpicker-wrap').exists()).toBe(true);
    expect(wrapper.findAll('.channel-stub').length).toBeGreaterThan(0);
    expect(wrapper.find('input.hex').element.value).toBe('#00FFFF');
  });

  it('applies light class from options', () => {
    const wrapper = mountPicker({
      options: { light: true, advanced: true, allowModeChange: true },
    });
    expect(wrapper.find('.colorpicker-wrap').classes()).toContain('light');
  });

  it('emits picked when OK is clicked', async () => {
    const wrapper = mountPicker();
    await wrapper.find('.ok-btn').trigger('click');
    expect(wrapper.emitted('picked')).toBeTruthy();
    expect(wrapper.emitted('picked')[0][0].hex).toBe('#00FFFF');
  });

  it('updates color from hex input', async () => {
    const wrapper = mountPicker();
    const hex = wrapper.find('input.hex');
    await hex.setValue('#FF0000');
    await hex.trigger('change');
    await flushPromises();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const last = wrapper.emitted('update:modelValue').at(-1)[0];
    expect(last).toBe('#FF0000');
  });

  it('toggles HSL / HSV mode', async () => {
    const wrapper = mountPicker();
    const buttons = wrapper.findAll('.btn-group button');
    const hsvBtn = buttons.find((b) => b.text() === 'HSV');
    expect(hsvBtn).toBeTruthy();
    await hsvBtn.trigger('click');
    await nextTick();
    expect(hsvBtn.classes()).toContain('active');
    // Lum label becomes Val in HSV mode via ChannelInput lbl prop
    const labels = wrapper.findAll('.channel-stub').map((n) => n.text());
    expect(labels).toContain('Val');
  });

  it('renders simple mode when advanced is off', async () => {
    localStorage.setItem(
      'v-cpicker',
      JSON.stringify({ advanced: false, mode: 'hsl' })
    );
    const wrapper = mountPicker({
      options: {
        advanced: false,
        allowModeChange: true,
        light: true,
      },
    });
    await nextTick();
    expect(wrapper.find('.simple-mode').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SimpleCanvas' }).exists()).toBe(true);
  });
});
