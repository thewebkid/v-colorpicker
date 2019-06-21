<template>
  <div class="hue-gradient" v-if="init" :class="{compact}" :style="{background:`linear-gradient(90deg, ${hueGradient})`}" @click="hueClick">
    <movable class="bar" :horizontal="[-x, w - x]" :style="{background:bg, left: x + 'px'}" @move="moved"/>
  </div>
</template>

<script>
  import {Color} from "modern-color";
  import {hueColorStops} from "../color";

  export default {
    data: () => {
      return {
        init:false,
        hueGradient:'',
        x:0
      }
    },
    computed:{
      scale(){
        return this.compact ? 1 : 1.25;
      },
      w(){
        return this.compact ? 360 : 450;
      },
      moveScale(){
        return this.compact ? 1 : .8;
      },
      bg(){
        return new Color({h:this.hsv.h, s:100, v:100}).hex;
      },
      compact(){
        return this.$parent.opt('compact');
      }
    },
    name: "Hue",
    mounted() {
      this.hueGradient = hueColorStops;
      if (this.hsv) {
        this.x = this.hsv.h * this.scale;
      }
      this.init = true;
    },
    watch:{
      hsv({h}){
        this.x = h * this.scale;
      }
    },
    methods:{
      setHue(x){
        let hVal = Math.max(0,Math.min(Math.round(x * this.moveScale),360));
        let hsv = Object.assign(this.hsv, {h: hVal});
        this.$emit('hueChange', new Color(hsv));
      },
      hueClick({offsetX}){
        this.setHue(offsetX)
      },
      moved({css}){
        this.setHue(css.left)
      }
    },
    props:['hsv'],
  }
</script>

<style lang="scss">
  .hue-gradient {
    height: 17px;
    width: 450px;
    &.compact{
      width:360px;
    }
    margin:0 0 2px 3px;
    border:solid 1px #777;
    position: relative;
    .bar{
      height:20px;
      width:10px;
      margin:-2px -6px;
      position:absolute;
      box-shadow: 0 0 .7px #eee, inset 0 0 1px #111;
      border-color:rgba(23,23,23,.9);
      &.is-moving {
       box-shadow: 0 0 2px #fff, inset 0 0 2px #fefefe;
     }
    }
  }
</style>
