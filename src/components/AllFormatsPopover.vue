<template>
  <div class="all-formats">
    <button class="formats-toggle" @click="showDialog = !showDialog" title="Show all formats">
      <small>All&nbsp;formats</small>
    </button>

    <Teleport to="body">
      <div v-if="showDialog" class="formats-overlay" @click="showDialog = false">
        <div class="formats-dialog" @click.stop>
          <div class="formats-header">
            <h3>Color Formats</h3>
            <button class="close-btn" @click="showDialog = false">&times;</button>
          </div>
          <div class="formats-list">
            <div v-for="format in formats" :key="format.title" class="format-item" :title="format.title">
              <label>{{ format.label }}</label>
              <div class="format-value">
                <input :value="format.getter" readonly />
                <button @click="copyToClipboard(format.getter)" title="Copy to clipboard" class="copy-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div v-if="copiedMessage" class="copied-message">
            Copied: {{ copiedMessage }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
});

const showDialog = ref(false);
const copiedMessage = ref('');

const formats = computed(() => {
  const c = props.color;
  if (!c) return [];
  return [
    {
      title: 'Hexadecimal Web format',
      label: 'HEX',
      getter: c.hex
    },
    {
      title: 'RGBA Web format (with Alpha)',
      label: 'RGBA',
      getter: c.rgbaString
    },
    {
      title: 'HSLA Web format',
      label: 'HSLA',
      getter: c.hslaString
    },
    {
      title: 'HWB (Hue / Whiteness / Blackness)',
      label: 'HWB',
      getter: c.alpha < 1 ? c.toString('hwba') : c.toString('hwb')
    }
  ];
});

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedMessage.value = text;
    setTimeout(() => {
      copiedMessage.value = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style lang="scss" scoped>
.all-formats {
  display: inline-block;
}

.formats-toggle {
  background: transparent;
  border: none;
  color: var(--vcp-link-color, inherit);
  cursor: pointer;
  padding: 4px 8px;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
}

.formats-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vcp-overlay-bg, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.formats-dialog {
  background: var(--vcp-dialog-bg, linear-gradient(#fff, #eee, #eee, #ddd));
  box-shadow: var(--vcp-dialog-shadow, 0 3px 10px rgba(0, 0, 0, 0.3));
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  color: var(--vcp-dialog-text, #333);
}

.formats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vcp-dialog-border, #ccc);

  h3 {
    margin: 0;
    font-size: 18px;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: var(--vcp-dialog-muted, #666);
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--vcp-dialog-text, #000);
    }
  }
}

.formats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.format-item {
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 12px;
    text-transform: uppercase;
    color: var(--vcp-dialog-muted, #666);
  }

  .format-value {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      padding: 6px 10px;
      border: 1px solid var(--vcp-dialog-border, #ccc);
      border-radius: 4px;
      font-family: 'Lucida Console', 'Courier New', monospace;
      font-size: 13px;
      background: var(--vcp-dialog-input-bg, white);
      color: var(--vcp-dialog-text, #333);
    }

    .copy-btn {
      padding: 6px 10px;
      background: var(--vcp-accent, #007bff);
      color: var(--vcp-accent-text, white);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        filter: brightness(0.85);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.copied-message {
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--vcp-accent, #28a745);
  color: var(--vcp-accent-text, white);
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}
</style>
