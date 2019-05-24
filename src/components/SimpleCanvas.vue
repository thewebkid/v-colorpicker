<template>
  <div style="position: relative">
    <movable
        class="circle" @move="circleMove" @start="moving=true" @complete="moving=false"
        :style="{
          top: y + 'px',
          left: x + 'px'
        }"/>
    <canvas width="720" height="200" ref="canvas" @click="canvasClick"></canvas>
  </div>
</template>

<script>
  import {Color} from "../color";

  export default {
    data:()=>{
      return {
        pureHS:{h:0,s:0},
        scale:1.25,
        h:125,w:449,
        x:0,y:0,
        moving:false,
        bouncer:null
      }
    },
    computed:{

    },
    name: "SimpleCanvas",
    props:['hsv'],
    mounted(){
      clearTimeout(this.bouncer);
      this.bouncer = setTimeout(this.render,77);
      this.pureHS = {h:this.hsv.h,s:this.hsv.s};
      this.x = Math.max(0,Math.min(Math.round(this.hsv.h * this.scale),359));
      this.y = (this.hsv.s * this.scale);
    },
    watch:{
      hsv(hsv){
        this.render(this.hsv.v);
        //this.x = this.hsv.h * this.scale;
        //this.y = (this.hsv.s * this.scale);
      }
    },
    methods:{
      circleMove(args){
        let e = {offsetX:args.css.left,offsetY:args.css.top};
        this.canvasClick(e);
      },
      canvasClick(e){
        let x = this.x = Math.max(0,Math.min(this.w, e.offsetX));
        let y = this.y = Math.max(0,Math.min(this.h, e.offsetY));
        let scale = 1 / this.scale;
        let s = Math.round(y * scale);
        let h = Math.max(0,Math.min(Math.round(x * scale),359));

        let hsv = {h, s, v:this.hsv.v};
        this.pureHS = {h,s};
        this.$emit('variantchange', new Color(hsv));
      },
      render(val){
        let v = val===undefined?100:val;
        const fill = (h,s)=>new Color({h,s,v}).hex;
        let ctx = this.$refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, 888, 888);
        const unitSize = 2;
        let incr = 2;
        for (let h = 0; h < 360; h += incr){
          for (let w = 0; w < 100; w += incr){
            ctx.fillStyle = fill(h,w);
            ctx.fillRect(h * unitSize, w * unitSize, (h + incr) * unitSize, (w + incr) * unitSize);
          }
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../scss/shared";
  div,canvas{
    display:block;
    cursor: crosshair;
    width:450px;
    height:125px;
  }
  div{
    //padding-right:5px;
    margin:-10px 9px 8px -3px;
  }
</style>