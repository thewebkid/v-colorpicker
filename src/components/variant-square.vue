<template>
  <div class="canvas">

    <movable
        class="circle" @move="circleMove" @start="moving=true" @complete="moving=false"
             :bounds="{x:[-colorCoordX,size-colorCoordX],y:[-colorCoordY,size-colorCoordY]}"
        :style="{
          top: colorCoordY + 'px',
          left: colorCoordX + 'px',
          visibility:moving?'hidden':'visible'
        }"><div v-if="moving" class="circle static"></div></movable>
      <!--<div v-if="moving" class="circle" :style="{
          top: colorCoordY + 'px',
          left: colorCoordX + 'px',
          visibility:moving?'hidden':'visible'
        }"></div>-->
    <canvas height="500" width="500" ref="hsw" @click="canvasClick($event)"></canvas>
  </div>
</template>

<script>
import {Color} from "../color";

  export default {
    data:()=>{
      return {
        bouncer:null,
        scale:1.6,
        size:160,
        canvasSize:500,
        moving:false
      }
    },
    computed:{
      colorCoordX(){
        return this.hsw.s * this.scale;
      },
      colorCoordY(){
        return this.size - (this.hsw.w * this.scale)
      }
    },
    name: "variant-square",
    props:['hsw','isHsl'],//hsw is Hue, Sat, Whatever (v, l, b, etc.). It is dynamic handed from parent
    watch:{
      hsw(){
        this.paintBouncer();
      }
    },
    mounted(){
      this.paintBouncer();
    },
    methods:{

      circleMove(args){
        let e = {offsetX:args.css.left,offsetY:args.css.top};
        //console.log(args);
        this.canvasClick(e);
      },
      canvasClick(e){
        let w = (this.size - e.offsetY) / this.size;
        w = Math.round(w * 100);
        let sat = Math.round((e.offsetX / this.size) * 100);
        let hsw = {h: this.hsw.h, s: sat};
        hsw[this.isHsl ? 'l':'v'] = w;
        //console.log({hsw,x:e.offsetX,y:e.offsetY});
        this.$emit('variantchange', new Color(hsw));
      },
      paintBouncer(){
        clearTimeout(this.bouncer);
        this.bouncer = setTimeout(this.paintHsw, 40);
      },
      paintHsw(){
        if (!this.$refs.hsw){
          return;
        }
        const fillHsl = (h,s,l)=>`hsl(${h}, ${s}%, ${100 - l}%)`;
        const fillHsv = (h,s,v)=>new Color({h,s,v:100-v}).hex;
        const fill = this.isHsl ? fillHsl : fillHsv;
        let ctx = this.ctx || this.$refs.hsw.getContext('2d');
        let h = this.hsw.h;
        //console.time('hsw'+h);
        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        const unitSize = this.canvasSize / 100;
        let incr = 2;
        for (let s = 0; s < 100; s += incr){
          for (let w = 0; w < 100; w += incr){
            ctx.fillStyle = fill(h,s,w);
            ctx.fillRect(s * unitSize, w * unitSize, (s + incr) * unitSize, (w + incr) * unitSize);
          }
        }
        //console.timeEnd('hsw'+h);
      }
    }
  }
</script>

<style lang="scss">
@import "../scss/shared.scss";
    .canvas, canvas {
      height: 160px;
      width: 160px;
      display: block;
    }
    .canvas{
      height: 162px;
      width: 162px;
      margin:5px -2px 0 0;
      border: solid 1px #777;
      position:relative;

    }

</style>