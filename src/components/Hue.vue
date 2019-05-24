<template>
  <div class="hue-gradient" :style="{background:`linear-gradient(90deg, ${hueGradient})`}" @click="hueClick">
    <movable class="bar" :horizontal="[-x, w - x]" :style="{background:bg, left: x + 'px'}" @move="moved"/>
  </div>
</template>

<script>
  import {Color} from "../color";

  export default {
    data: () => {
      return {
        hueGradient:'',
        w:450,
        x:0,
        scale:1.25,
        moveScale:.8
      }
    },
    computed:{
      bg(){
        return new Color({h:this.hsv.h, s:100, v:100}).hex;
      }
    },
    name: "Hue",
    mounted() {
      this.hueGradient = Color.hueColorStops();
      this.x = this.hsv.h * this.scale;
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