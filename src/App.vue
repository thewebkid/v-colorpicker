<template>
  <div id="app">
    <a class="btn btn-light btn-lg" @click="show=!show">
      <span class="color-pie"></span>
      <span class="swatch" :style="{'background-color': previewColor.hex}"></span>
    </a>
    <color-picker v-if="show" class="cp" @preview="preview" @picked="picked" :value="previewColor.hex"/>
  </div>
</template>

<script>
import ColorPicker from './components/ColorPicker.vue'
import {Color} from './color';
export default {
  data:()=>{
    return {
      show:false,
      previewColor: new Color('fuchsia')
    }
},
  name: 'app',
  methods:{
    picked(c){
      this.show = false;
    },
    preview(c){
      this.previewColor = c;
    }
  },
  components: {
    ColorPicker
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
.cp{
  position:absolute;
  top:55px;
  left:101px;
}
  .color-pie{
    display: inline-block;
    vertical-align: middle;
    height:22px;
    width:22px;
    border-radius:50%;
    box-shadow:0 0 3px #aaa;
    background: conic-gradient(
      rgb(61,159,232) 0deg 45deg,
      rgb(115,18,237) 45deg 90deg,
      rgb(232,64,115) 90deg 135deg,
      rgb(185,22,41) 135deg 180deg,
      rgb(240,65,34) 180deg 225deg,
      rgb(254,211,55) 225deg 270deg,
      rgb(83,166,86) 270deg 315deg,
      rgb(112,218,232) 315deg 360deg
    );
    position:relative;
    &:after{
      content:'';
      position:absolute;
      top:6px;
      left:6px;
      background:$light;
      border-radius: 5px;
      height:10px;
      width:10px;
      box-shadow:inset 0 0 2px #999;
    }
  }
  .swatch{
    margin-left:5px;
    display: inline-block;
    vertical-align: middle;
    height: 15px;
    width:15px;
    border-radius: 2px;
    box-shadow:0 0 1px #111, inset 0 0 1px #333;
    background:white;
  }
}
</style>
