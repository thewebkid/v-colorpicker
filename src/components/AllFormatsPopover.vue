<template>
  <label class="inline">
    <a id="popover-strings" style="cursor: pointer;">
      <small>All&nbsp;formats</small>
    </a>
    <b-popover
        target="popover-strings"
        triggers="click" placement="auto"
        ref="popover">
      <div class="pop-wrap">
        <div v-for="(item,i) in formats" :key="i" class="container" :title="item.title">
          <input v-model="item.getter"/>
          <button
              @mousedown="message=item.getter"
              @click="copyColor" title="Copy to clipboard">
            <i class="far fa-copy"></i>
          </button>
        </div>
      </div>
    </b-popover>
  </label>
</template>
<script>
  import Vue from 'vue';
  import VueClipboard from 'vue-clipboard2'

  VueClipboard.config.autoSetContainer = true;
  Vue.use(VueClipboard);

  export default {
    data: () => {
      return {
        message: ''
      }
    },
    computed:{
      formats(){
        return [{
          title: 'Hexadecimal Web format',
          getter: this.hex
        }, {
          title: 'RGBA Hexadecimal (with Alpha)',
          getter: this['rgbaHex']
        }, {
          title: 'RGB Web format',
          getter: this['rgbString']
        }, {
          title: 'HSL Web format',
          getter: this['hslString']
        }, {
          title: 'Plain rgb array [r, g, b]',
          getter: this['rgb']
        }]
      },
      hex(){
        return this.color && this.color.hex;
      },
      rgbaHex(){
        return this.color && this.color.rgbaHex;
      },
      rgbString(){
        return this.color && this.color.rgbString;
      },
      hslString(){
        return this.color && this.color.hslString;
      },
      rgb(){
        return this.color && `[${this.color.rgb.join(' ,')}]`;
      }
    },
    name: "AllFormatsPopover",
    props: ['color'],
    methods: {
      copyColor() {
        this.$copyText(this.message).then(e => {
          console.log(`copied: ${this.message}`, e);
        }, (e) => {
          console.warn('error', this.message, e);
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import url("//use.fontawesome.com/releases/v5.0.13/css/all.css");
  .popover-body {
    background: linear-gradient(#fff, #eee, #eee, #ddd);
    box-shadow: 0 3px 3px #555;
  }
  .pop-wrap {
    padding: 12px 0;
    margin: 0 -9px;
    input, button {
      vertical-align: middle;
      padding: 2px 6px;
    }
    input {
      font-family: "Lucida Console", "Courier New";
    }
  }
</style>
