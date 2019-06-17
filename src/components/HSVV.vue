<template>
  <div class="hsvv" v-if="init" :class="{compact}" @click="vclick" :style="{'background-image':`linear-gradient(90deg, ${gradient(0)}, ${gradient(100)})`}">
    <movable class="bar" :horizontal="[-x, w - x]" :style="{background:bg, left:(left===null ? x : left) + 'px'}" @move="moved"/>
  </div>
</template>

<script>
  import {Color} from "../color";

  export default {
    data:()=>{
      return {
        init:false,
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
        return this.left / this.scale
      },
      gradient(){
        return v => new Color({h:this.h,s:this.s,v}).hex
      },
      bg(){
        //let byte = Math.round(this.hsv.v * 2.55);
        return new Color({h:this.h,s:this.s,v:this.v}).hex;//new Color([byte,byte,byte]).hex;
      },
      scale(){
        return this.compact ? 1 : 2;
      },
      w(){
        return this.compact ? 100 : 200;
      },
      compact(){
        return this.$parent.opt('compact')
      }
    },
    mounted(){
      this.sibling = this.$parent.$children.find(c=>c.scale !==undefined);
      this.x = this.left = this.hsv.v * this.scale;
      this.$nextTick().then(() => this.$emit('hsvvChange', new Color(this.hsv)));
      this.init = true;
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
        let hsv = Object.assign(this.hsv, {v: Math.round(css.left/this.scale)});
        this.left = Math.max(0,Math.min(this.w,css.left));
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
    &.compact{
      width:100px;
    }
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
