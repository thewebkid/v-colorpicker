<template>
  <div style="position: relative">
    <movable
        class="circle" @move="circleMove" @start="moving=true" @complete="moving=false"
        :bounds="{x:[-colorCoordX,size-colorCoordX],y:[-colorCoordY,size-colorCoordY]}"
        :style="{
          top: colorCoordY + 'px',
          left: colorCoordX + 'px',
          visibility:moving?'hidden':'visible'
        }"><div v-if="moving" class="circle static"></div></movable>
    <canvas width="720" height="200" ref="canvas" @click="render"></canvas>
  </div>
</template>

<script>
  import {Color} from "../color";

  export default {
    data:()=>{
      return {
        scale:1.25,
        moving:false
      }
    },
    computed:{
      colorCoordX(){
        return this.hsv.h * this.scale;
      },
      colorCoordY(){
        return 125 - (this.hsv.s * this.scale)
      }
    },
    name: "SimpleCanvas",
    props:['hsv'],
    mounted(){
      this.render();
    },
    methods:{
      circleMove(args){
        let e = {offsetX:args.css.left,offsetY:args.css.top};
        //console.log(args);
        //this.satMaskClick(e);
      },
      satMaskClick(e){
       /* let w = (this.size - e.offsetY) / this.size;
        w = Math.round(w * 100);
        let sat = Math.round((e.offsetX / this.size) * 100);
        let hsw = {h: this.hsw.h, s: sat};
        hsw[this.isHsl ? 'l':'v'] = w;*/
        //console.log({hsw,x:e.offsetX,y:e.offsetY});
        //this.$emit('variantchange', new Color(hsw));
      },
      render(){
        const fill = (h,s,v)=>new Color({h,s,v}).hex;
        let ctx = this.$refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, 888, 888);
        const unitSize = 2;
        let incr = 2;
        for (let h = 0; h < 360; h += incr){
          for (let w = 0; w < 100; w += incr){
            ctx.fillStyle = fill(h,w,100);
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
    //padding-right:10px;
    margin:-10px 3px 12px -3px;
  }
</style>