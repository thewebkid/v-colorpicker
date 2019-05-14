<template>
  <div class="hsvv" @click="vclick">
    <movable class="bar" :horizontal="[-x, 200 - x]" :style="{background:bg, left:(left===null ? x : left) + 'px'}" @move="moved"/>
  </div>
</template>

<script>
  import {Color} from "../color";

  export default {
    data:()=>{
      return {
        left:null,
        x:0,
        moving:false
      }
    },
    computed:{
      bg(){
        let byte = Math.round(this.hsv.v * 2.55);
        return new Color([byte,byte,byte]).hex;
      }
    },
    mounted(){
      this.x = this.hsv.v * 2;
    },
    methods:{
      vclick({offsetX}){
        let css = {left:offsetX};
        this.moved({css});
      },
      moved({css}){
        let hsv = Object.assign(this.hsv, {v: Math.round(css.left/2)});
        this.left = Math.max(0,Math.min(200,css.left));
        this.$emit('hsvvChange', new Color(hsv));
      }
    },
    props:['hsv'],
    name: "HSVV"
  }
</script>

<style lang="scss">
  .hsvv{
    position:relative;
    height:20px;
    width:200px;
    background:linear-gradient(90deg, black, white);
    border:solid 1px #888;
    border-radius:3px;
    margin:0 0 10px 10px;
    .bar{
      height:24px;
      width:12px;
      margin:-2px -6px;
      position:absolute;
      box-shadow: 0 0 .7px #eee, inset 0 0 1px #111;
      border-color:rgba(23,23,23,.9);
      &:hover {
        box-shadow: 0 0 2px #fff, inset 0 0 2px #fefefe;
      }
    }
  }
</style>