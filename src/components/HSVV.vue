<template>
  <div class="hsvv" @click="vclick" :style="{'background-image':`linear-gradient(90deg, ${gradient(0)}, ${gradient(100)})`}">
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
        hs:{},
        moving:false,
        sibling:null
      }
    },
    computed:{
      c(){
        return this.sibling ? this.sibling.pureHS : this.hsv;
      },
      h(){
        return this.c.h;
      },
      s(){
        return this.c.s;
      },
      v(){
        return this.left / 2
      },
      gradient(){
        return v => new Color({h:this.h,s:this.s,v}).hex
      },
      bg(){
        //let byte = Math.round(this.hsv.v * 2.55);
        return new Color({h:this.h,s:this.s,v:this.v}).hex;//new Color([byte,byte,byte]).hex;
      }
    },
    mounted(){
      this.sibling = this.$parent.$children.find(c=>c.scale !==undefined);
      //console.log(this.sibling);
      this.x = this.left = this.hsv.v * 2;
    },
    watch:{
      hsv(){
        this.sibling = this.$parent.$children.find(c=>c.scale !==undefined);
        this.hs = this.c;
      }
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
    border: solid 1px #444;
    border-radius:3px;
    margin:0 0 10px 10px;
    .bar{
      height:24px;
      width:12px;
      margin:-3px -6px -2px -6px;
      position:absolute;
      border-radius:3px;
      border: solid 1px #444;
      &.is-moving {
        border-color:#777;
      }
    }
  }
  .light {
    .hsvv {
      border: solid 1px #ddd;
      .bar {
        border: solid 1px #ddd;
      }
    }
  }
</style>