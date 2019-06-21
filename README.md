# v-cpicker (a vue colorpicker) [![npm version](https://badge.fury.io/js/v-cpicker.svg)](https://badge.fury.io/js/v-cpicker) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![alt text](http://preview.thewebkid.com/img/colorpicker.png)
[Live Demo](http://preview.thewebkid.com/modules/v-cpicker)

Currently in active development - please file a github issue if you have a bug or request. 
  
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
- **alpha**: (_default=true_)  Enable alpha channel
- **alphaHidden**: (_default=true_) Hide link to enable alpha on ui
- **formatsPopup**: (_default=true_) Show link to all formats
- **hslToggle**: (_default=true_) Show HSL/HSV toggle

### Usage example
```html
<template>
  <div>
    <div class="float-right picked">
      Preview <span class="swatch" :style="{background:previewColor.hex}"></span>
      Picked <span class="swatch" :style="{background:pickedColor.hex}"></span>
    </div>
    <colorpicker value="blue" @preview="previewed" @picked="picked"/>
  </div>
</template>
<script>
export default {
  data:()=>{
    return {
      pickedColor:null,
      previewColor:{hex:'blue'}
    }
  },  
  methods: {
    picked(c) {
      this.pickedColor = c;
    },
    preview(c) {
      this.previewColor = c;
    }
  }
}
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


