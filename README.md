# v-cpicker (a vue colorpicker) [![npm version](https://badge.fury.io/js/v-cpicker.svg)](https://badge.fury.io/js/v-cpicker) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![alt text](http://preview.thewebkid.com/img/colorpicker.png)
[Live Demo](http://preview.thewebkid.com/modules/v-cpicker)

## Installation
    npm i --save v-cpicker

### Initialize in main.js
    import colorpicker from "v-cpicker";
    Vue.use(colorpicker);

### Options (set as :options="optionsObject")
- **compact**: (_default=false_) Compact layout
- **light**: (_default=true_) Use light theme
- **allowModeChange**: (_default=true_) Allow simple/advanced mode change (checkbox on UI)
- **advanced**:(_default=false_) Start in advanced mode
- **previewBars**: (_default=true_) Preview gradient bars next to channel values
- **formatsPopup**: (_default=true_) Show link to all formats
- **hslToggle**: (_default=true_) Show HSL/HSV toggle

### Usage example
```html
<template>
  <div>
    <div class="float-right picked">
      Preview <span class="swatch" :style="{background:modelColor.css}"></span>
    </div>
    <colorpicker v-model="modelColor" />
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      modelColor:'blue'//will become a Color object. See npm modern_color
    };
  }
};
</script>
<style>
  .swatch {
    margin-left: 5px;
    display: inline-block;
    vertical-align: middle;
    height: 15px;
    width: 15px;
  }
</style>

```

### Output color value
The v-model can be any css color (it will parse almost anything). Under the hood it uses the [modern-color](https://www.npmjs.com/package/modern-color) package which will convert the input to a Color instance and expose getters like css, hex, and hsl. You can import the module and set the model as a Color.parse('red') if you prefer.

### Events
- **preview**: Fires continuously whenever the preview color is modified.
- **picked**: Fires when the user clicks ok.

### Disclaimer
I have not written a turn-key solution for a flyout version bound to a color input or another element. I welcome pull requests from someone who wants to write an implementation similar to how bootstrap-vue.js handles popovers and the various placement options.
