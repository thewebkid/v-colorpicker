<template>
  <div id="app">
    <header class="demo-header">
      <h1>v-cpicker <span class="version">v2.0.0</span></h1>
      <p>A modern Vue 3 color picker component</p>
      <a href="https://www.npmjs.com/package/v-cpicker" rel="nofollow" target="_blank">
        <img src="https://badge.fury.io/js/v-cpicker.svg" alt="npm version" />
      </a>
    </header>

    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- ══════════════ DEMO TAB ══════════════ -->
    <div v-show="activeTab === 'demo'">
      <section class="demo-section">
        <h2>
          Static colorpicker
          <span class="swatch" :style="{ background: modelColor }"></span>
        </h2>
        <div class="demo-container">
          <div class="demo-main">
            <ColorPicker v-model="modelColor" :options="options" />
          </div>
          <div class="demo-sidebar">
            <h3>Current Color</h3>
            <div class="color-info">
              <div class="color-preview" :style="{ background: modelColor }"></div>
              <code>{{ modelColor }}</code>
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>Options</h2>
        <div class="options-grid">
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.compact" />
            <span>Compact mode</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.light" />
            <span>Use light theme</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.allowModeChange" />
            <span>Allow Mode Change</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.advanced" />
            <span>Start in advanced mode</span>
          </label>
          <label class="option-checkbox" v-if="options.advanced || options.allowModeChange">
            <input type="checkbox" v-model="options.previewBars" />
            <span>Preview Gradient Bars</span>
          </label>
          <label class="option-checkbox" v-if="options.advanced || options.allowModeChange">
            <input type="checkbox" v-model="options.formatsPopup" />
            <span>Show all formats popup</span>
          </label>
          <label class="option-checkbox" v-if="options.advanced || options.allowModeChange">
            <input type="checkbox" v-model="options.hslToggle" />
            <span>Show HSL/HSV toggle</span>
          </label>
        </div>

        <div class="usage-block">
          <div class="usage-header">
            <h3>Usage — what you see is what you get</h3>
            <button class="copy-usage-btn" @click="copyUsage" title="Copy usage snippet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {{ usageCopied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre class="usage-code"><code>{{ usageSnippet }}</code></pre>
        </div>
      </section>

      <section class="demo-section">
        <h2>Colorpicker as flyout</h2>
        <div class="flyout-anchor">
          <button class="flyout-trigger" @click.stop="showFlyout = !showFlyout">
            <span class="color-pie"></span>
            <span class="swatch" :style="{ background: flyoutColor }"></span>
            Toggle Picker
          </button>

          <Transition name="flyout">
            <div v-if="showFlyout" class="flyout-pop" @click.stop>
              <ColorPicker v-model="flyoutColor" @picked="showFlyout = false" />
            </div>
          </Transition>
        </div>
        <p class="flyout-value">Selected: {{ flyoutColor }}</p>

        <!-- transparent backdrop to dismiss -->
        <div v-if="showFlyout" class="flyout-backdrop" @click="showFlyout = false"></div>
      </section>
    </div>

    <!-- ══════════════ THEME TAB ══════════════ -->
    <div v-show="activeTab === 'theme'">
      <section class="demo-section themer-section">
        <h2>Theme your colorpicker</h2>
        <p class="themer-blurb">
          Every visual in the picker is driven by a <code>--vcp-*</code> CSS custom property.
          Pick a variable below, then use the colorpicker to restyle itself — changes apply live.
        </p>

        <div class="themer-controls">
          <label class="themer-select-label">
            Theme variable
            <select v-model="activeThemeVar" class="themer-select" @change="selectThemeVar(activeThemeVar)">
              <option v-for="t in themeTargets" :key="t.var" :value="t.var">
                {{ t.var }} — {{ t.label }}
              </option>
            </select>
          </label>

          <div class="themer-presets">
            <span>Presets:</span>
            <button
              v-for="preset in presets"
              :key="preset.name"
              class="preset-btn"
              :class="{ active: activePreset === preset.name }"
              @click="applyPreset(preset)"
            >
              <span class="preset-dots">
                <i :style="{ background: preset.vars['--vcp-bg'] }"></i>
                <i :style="{ background: preset.vars['--vcp-accent'] }"></i>
              </span>
              {{ preset.name }}
            </button>
          </div>
        </div>

        <div class="themer-workspace">
          <div class="themer-picker">
            <ColorPicker
              v-model="themerColor"
              :options="themerOptions"
              :style="pickerThemeVars"
              @preview="onThemerPreview"
            />
          </div>

          <div class="themer-output">
            <h3>
              Theme (CSS vars)
              <button class="copy-theme-btn" @click="copyTheme" title="Copy theme CSS">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {{ themeCopied ? 'Copied!' : 'Copy' }}
              </button>
            </h3>
            <pre class="theme-code"><code><span class="sel">color-picker</span> {
<span v-for="t in themeTargets" :key="t.var"><span
  class="prop"
  :class="{ 'is-active': t.var === activeThemeVar, 'has-swatch': isColorValue(themeVars[t.var]) }"
  :style="swatchStyle(themeVars[t.var])"
  @click="selectThemeVar(t.var)"
>  {{ t.var }}</span>: <span class="val">{{ themeVars[t.var] }}</span>;
</span>}</code></pre>
            <p class="themer-hint">
              Click a variable in the CSS to edit it. Paste this block onto any ancestor
              (or the component itself) to apply the theme.
            </p>
          </div>
        </div>
      </section>
    </div>

    <footer class="demo-footer">
      <p>
        Built with Vue 3, Vite, modern-color, v-movable, and v-range-flyout |
        <a href="https://github.com/thewebkid/v-colorpicker" target="_blank">GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Color } from 'modern-color';
import ColorPicker from './components/ColorPicker.vue';

/* ── Tabs ─────────────────────────────────────────────── */
const tabs = [
  { id: 'demo', label: 'Demo' },
  { id: 'theme', label: 'Themer' }
];
const activeTab = ref('demo');

/* ── Demo tab state ───────────────────────────────────── */
const modelColor = ref('aqua');
const flyoutColor = ref('fuchsia');
const showFlyout = ref(false);

const options = ref({
  sticky: true,
  compact: false,
  light: true,
  allowModeChange: true,
  advanced: true,
  formatsPopup: true,
  previewBars: true,
  hslToggle: true
});

/* ── Dynamic usage snippet (WYSIWYG) ─────────────────── */
const optionDefaults = {
  compact: false,
  light: true,
  allowModeChange: true,
  advanced: false,
  formatsPopup: true,
  previewBars: true,
  hslToggle: true
};

const usageSnippet = computed(() => {
  // Only include options that differ from defaults, for a clean snippet.
  const changed = Object.entries(options.value).filter(
    ([k, v]) => optionDefaults[k] !== undefined && v !== optionDefaults[k]
  );

  const open = '<' + 'script setup>';
  const close = '</' + 'script>';

  let optsStr = '';
  if (changed.length) {
    const lines = changed.map(([k, v]) => `    ${k}: ${v}`).join(',\n');
    optsStr = `\n  const options = {\n${lines}\n  };\n`;
  }

  return `${open}
import { ref } from 'vue';
import { ColorPicker } from 'v-cpicker';
import 'v-cpicker/style.css';

const color = ref('${modelColor.value}');${optsStr}${close}

<template>
  <ColorPicker
    v-model="color"${changed.length ? '\n    :options="options"' : ''}
  />
</template>`;
});

const usageCopied = ref(false);
const copyUsage = async () => {
  try {
    await navigator.clipboard.writeText(usageSnippet.value);
    usageCopied.value = true;
    setTimeout(() => (usageCopied.value = false), 2000);
  } catch (err) {
    console.error('Failed to copy usage:', err);
  }
};

/* ── Themer tab state ─────────────────────────────────── */
const themeTargets = [
  { var: '--vcp-bg', label: 'picker surface' },
  { var: '--vcp-text', label: 'label text' },
  { var: '--vcp-input-bg', label: 'input background' },
  { var: '--vcp-input-color', label: 'input text' },
  { var: '--vcp-input-border', label: 'input border' },
  { var: '--vcp-input-focus-border', label: 'focus ring' },
  { var: '--vcp-link-color', label: 'links' },
  { var: '--vcp-accent', label: 'accent (toggles, copy)' },
  { var: '--vcp-accent-text', label: 'accent text' },
  { var: '--vcp-btn-bg', label: 'OK button' },
  { var: '--vcp-btn-color', label: 'OK button text' },
  { var: '--vcp-border-color', label: 'canvas borders' }
];

const defaultTheme = {
  '--vcp-bg': '#1e293b',
  '--vcp-text': '#e2e8f0',
  '--vcp-input-bg': '#0f172a',
  '--vcp-input-color': '#e2e8f0',
  '--vcp-input-border': '#475569',
  '--vcp-input-focus-border': '#818cf8',
  '--vcp-link-color': '#7dd3fc',
  '--vcp-accent': '#6366f1',
  '--vcp-accent-text': '#ffffff',
  '--vcp-btn-bg': '#312e81',
  '--vcp-btn-color': '#e0e7ff',
  '--vcp-border-color': '#334155'
};

const presets = [
  {
    name: 'Midnight (default)',
    vars: { ...defaultTheme }
  },
  {
    name: 'Paper',
    vars: {
      '--vcp-bg': '#f8fafc',
      '--vcp-text': '#1e293b',
      '--vcp-input-bg': '#ffffff',
      '--vcp-input-color': '#1e293b',
      '--vcp-input-border': '#cbd5e1',
      '--vcp-input-focus-border': '#4d90fe',
      '--vcp-link-color': '#007bff',
      '--vcp-accent': '#0ea5e9',
      '--vcp-accent-text': '#ffffff',
      '--vcp-btn-bg': '#e2e8f0',
      '--vcp-btn-color': '#0f172a',
      '--vcp-border-color': '#cbd5e1'
    }
  },
  {
    name: 'Forest',
    vars: {
      '--vcp-bg': '#14261a',
      '--vcp-text': '#d1fae5',
      '--vcp-input-bg': '#0b1a10',
      '--vcp-input-color': '#d1fae5',
      '--vcp-input-border': '#2f5d3f',
      '--vcp-input-focus-border': '#34d399',
      '--vcp-link-color': '#6ee7b7',
      '--vcp-accent': '#10b981',
      '--vcp-accent-text': '#ffffff',
      '--vcp-btn-bg': '#14532d',
      '--vcp-btn-color': '#d1fae5',
      '--vcp-border-color': '#2f5d3f'
    }
  },
  {
    name: 'Sunset',
    vars: {
      '--vcp-bg': '#2b1a12',
      '--vcp-text': '#fed7aa',
      '--vcp-input-bg': '#1c110a',
      '--vcp-input-color': '#fed7aa',
      '--vcp-input-border': '#7c4a2d',
      '--vcp-input-focus-border': '#fb923c',
      '--vcp-link-color': '#fdba74',
      '--vcp-accent': '#f97316',
      '--vcp-accent-text': '#ffffff',
      '--vcp-btn-bg': '#7c2d12',
      '--vcp-btn-color': '#ffedd5',
      '--vcp-border-color': '#7c4a2d'
    }
  }
];

const themeVars = ref({ ...defaultTheme });
const activeThemeVar = ref('--vcp-bg');
const activePreset = ref('Midnight (default)');
const themerColor = ref(themeVars.value[activeThemeVar.value]);
const themeCopied = ref(false);

const themerOptions = ref({
  compact: false,
  light: false,
  allowModeChange: true,
  advanced: true,
  formatsPopup: true,
  previewBars: true,
  hslToggle: true
});

// Style binding applied to every picker in the demo — the live theme.
const pickerThemeVars = computed(() => {
  const style = {};
  for (const [k, v] of Object.entries(themeVars.value)) {
    style[k] = v;
  }
  return style;
});

// Live-apply picker edits to the selected theme var.
const onThemerPreview = (colorInstance) => {
  const v = activeThemeVar.value;
  const current = themeVars.value[v];
  // Keep gradient values gradient-able: swap solid only if the target was solid.
  themeVars.value[v] =
    typeof current === 'string' && current.includes('gradient')
      ? current
      : colorInstance.css;
  activePreset.value = '';
};

const selectThemeVar = (v) => {
  activeThemeVar.value = v;
  const current = themeVars.value[v];
  try {
    // Seed the picker with the var's current color (non-color values ignored).
    new Color(current);
    themerColor.value = current;
  } catch {
    themerColor.value = '#4682b4';
  }
};

const isColorValue = (v) => {
  if (!v) return false;
  try {
    new Color(v);
    return true;
  } catch {
    return false;
  }
};

const swatchStyle = (v) =>
  isColorValue(v) ? { '--swatch': v } : {};

const applyPreset = (preset) => {
  themeVars.value = { ...preset.vars };
  activePreset.value = preset.name;
  selectThemeVar(activeThemeVar.value);
};

const copyTheme = async () => {
  const body = Object.entries(themeVars.value)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  const css = `color-picker {\n${body}\n}`;
  try {
    await navigator.clipboard.writeText(css);
    themeCopied.value = true;
    setTimeout(() => (themeCopied.value = false), 2000);
  } catch (err) {
    console.error('Failed to copy theme:', err);
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 48px;
    font-weight: 700;

    .version {
      font-size: 18px;
      font-weight: 400;
      opacity: 0.8;
    }
  }

  p {
    margin: 0 0 16px 0;
    font-size: 18px;
    opacity: 0.9;
  }
}

/* ── Tabs ── */
.tab-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px;
  border-radius: 10px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;

  .tab {
    padding: 8px 28px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(255, 255, 255, 0.85);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &.active {
      background: white;
      color: #4c1d95;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .swatch {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(0, 0, 0, 0.1);
    vertical-align: middle;
  }
}

.demo-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;

  .demo-main {
    flex: 1;
  }

  .demo-sidebar {
    width: 250px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;

    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #666;
    }

    .color-info {
      .color-preview {
        width: 100%;
        height: 120px;
        border-radius: 8px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      code {
        display: block;
        padding: 8px;
        background: white;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        color: #333;
        border: 1px solid #e0e0e0;
      }
    }
  }
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;

  .option-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: #e9ecef;
    }

    input[type='checkbox'] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 14px;
      color: #333;
    }
  }
}

.flyout-trigger {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  .color-pie {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
    background: conic-gradient(
      rgb(61, 159, 232) 0deg 45deg,
      rgb(115, 18, 237) 45deg 90deg,
      rgb(232, 64, 115) 90deg 135deg,
      rgb(185, 22, 41) 135deg 180deg,
      rgb(240, 65, 34) 180deg 225deg,
      rgb(254, 211, 55) 225deg 270deg,
      rgb(83, 166, 86) 270deg 315deg,
      rgb(112, 218, 232) 315deg 360deg
    );
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      background: white;
      border-radius: 5px;
      height: 10px;
      width: 10px;
      box-shadow: inset 0 0 2px #999;
    }
  }

  .swatch {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  }
}

.flyout-anchor {
  position: relative;
  display: inline-block;
}

.flyout-pop {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 1000;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));

  // little caret pointing up at the trigger
  &::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 28px;
    width: 14px;
    height: 14px;
    background: #3a3a3a;
    transform: rotate(45deg);
    border-radius: 2px 0 0 0;
  }
}

/* flyout open/close transition */
.flyout-enter-active,
.flyout-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  transform-origin: top left;
}

.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.flyout-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
}

.flyout-value {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
  font-family: monospace;
}

/* ── Themer ── */
.themer-section {
  .themer-blurb {
    margin: -8px 0 20px 0;
    color: #666;
    font-size: 14px;

    code {
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 13px;
    }
  }
}

.themer-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  .themer-select-label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #555;
  }

  .themer-select {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 14px;
    font-family: monospace;
    background: white;
    min-width: 300px;
    cursor: pointer;
  }

  .themer-presets {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    > span {
      font-size: 13px;
      font-weight: 600;
      color: #555;
    }

    .preset-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      background: white;
      font-size: 13px;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:hover {
        border-color: #667eea;
      }

      &.active {
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
      }

      .preset-dots {
        display: inline-flex;

        i {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);

          & + i {
            margin-left: -5px;
          }
        }
      }
    }
  }
}

.themer-workspace {
  display: flex;
  gap: 30px;
  align-items: flex-start;

  .themer-picker {
  }

  .themer-output {
    flex: 1;
    min-width: 0;

    h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .copy-theme-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: white;
        color: #475569;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          border-color: #667eea;
          color: #667eea;
        }
      }
    }
  }
}

.theme-code {
  margin: 0;
  padding: 16px;
  background: #0f172a;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.7;

  code {
    font-family: 'Cascadia Code', 'Fira Code', 'Lucida Console', monospace;
    color: #e2e8f0;
  }

  .sel {
    color: #7dd3fc;
  }

  .prop {
    color: #c4b5fd;
    border-radius: 3px;
    padding: 0 2px;
    margin-left: -2px;

    &.has-swatch {
      cursor: pointer;
      position: relative;

      &::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 7px;
        border-radius: 2px;
        background: var(--swatch);
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
      }

      &:hover {
        background: rgba(196, 181, 253, 0.15);
      }
    }

    &.is-active {
      background: rgba(102, 126, 234, 0.4);
      box-shadow: 0 0 0 1px #818cf8;
    }
  }

  .val {
    color: #fbbf24;
  }
}

.themer-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
}

/* ── Usage snippet ── */
.usage-block {
  margin-top: 24px;
}

.usage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 15px;
    color: #555;
  }

  .copy-usage-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: white;
    color: #475569;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      border-color: #667eea;
      color: #667eea;
    }
  }
}

.usage-code {
  margin: 0;
  padding: 16px;
  background: #0f172a;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;

  code {
    font-family: 'Cascadia Code', 'Fira Code', 'Lucida Console', monospace;
    color: #e2e8f0;
    white-space: pre;
  }
}

.demo-footer {
  text-align: center;
  color: white;
  padding: 20px;
  opacity: 0.9;

  a {
    color: white;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
