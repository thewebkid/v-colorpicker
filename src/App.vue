<template>
  <div id="app">
    <a href="https://www.npmjs.com/package/v-cpicker" rel="nofollow">
      <img src="https://badge.fury.io/js/v-cpicker.svg" alt="npm version">
    </a>
    <h2>Static colorpicker <span class="swatch" :style="{background:modelColor.css}"></span></h2>
    <div style="width:1000px">
      <ul class="float-right">
        <li v-for="f in modelFormats" :key="f">
          <strong>modelColor.{{f}}</strong>: {{modelColor[f]}}
        </li>
      </ul>
      <colorpicker :options="options" v-model="modelColor"/>
    </div>
    <b-form-checkbox v-model="options.compact">
      Compact mode
    </b-form-checkbox>
    <b-form-checkbox v-model="options.light">
      Use light theme
    </b-form-checkbox>
    <b-form-checkbox v-model="options.allowModeChange">
      Allow Mode Change
    </b-form-checkbox>
    <b-form-checkbox v-model="options.advanced">
      Start in advanced mode
    </b-form-checkbox>
    <b-form-checkbox v-model="options.previewBars" v-if="options.advanced || options.allowModeChange">
      Preview Gradient Bars next to channel values
    </b-form-checkbox>

    <b-form-checkbox v-model="options.formatsPopup" v-if="options.advanced || options.allowModeChange">
      Show link to all formats
    </b-form-checkbox>
    <b-form-checkbox v-model="options.hslToggle" v-if="options.advanced || options.allowModeChange">
      Show HSL/HSV toggle
    </b-form-checkbox>
    <br>
    <h2>Colorpicker as flyout</h2>
    <a class="btn btn-light btn-lg" @click="show=!show">
      <span class="color-pie"></span>
      <span class="swatch" :style="{'background-color': flyoutColor.css}"></span>
    </a>
    <colorpicker v-if="show" class="cp" v-model="flyoutColor"/>

  </div>

</template>

<script>
  import colorpicker from './components/ColorPicker.vue';
  import { Color } from 'modern-color';

  export default {
    data: () => {
      return {
        modelFormats:['rgbaString','hex','hslaString','cmykaString','hsv'],
        modelColor:'aqua',
        options: {
          sticky:true,
          compact:true,
          light: true,
          allowModeChange: true,
          advanced: true,
          formatsPopup: true,
          previewBars: true,
          hslToggle: true
        },
        show: false,
        flyoutColor: new Color('fuchsia')
      }
    },
    name: 'app',
    components: {
      colorpicker
    }
  }
</script>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 20px;

    .control {
      display: inline-block;
      margin: 112px;
    }

    .cp {
      position: absolute;
      top: 587px;
      left: 101px;
    }

    .color-pie {
      display: inline-block;
      vertical-align: middle;
      height: 22px;
      width: 22px;
      border-radius: 50%;
      box-shadow: 0 0 3px #aaa;
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
        background: $light;
        border-radius: 5px;
        height: 10px;
        width: 10px;
        box-shadow: inset 0 0 2px #999;
      }
    }

    .swatch {
      margin-left: 5px;
      display: inline-block;
      vertical-align: middle;
      height: 15px;
      width: 15px;
      border-radius: 2px;
      box-shadow: 0 0 1px #111, inset 0 0 1px #333;
      background: white;
    }
  }
</style>
