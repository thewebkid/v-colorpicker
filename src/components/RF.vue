<template>
  <div class="input" v-if="v!==null">
    <label>
      <span class="line" :style="{background:bg,left:!baseColor?0:'auto',right:!!baseColor?-11+'px':'auto'}" v-if="!activeRF"></span>
      <strong v-if="activeRF">{{lbl}}</strong>
      <span v-else>{{lbl}}</span>
    </label>
    <range-flyout :min="0" :max="max" :sliderHeight="h" :incr="incr" :val="v" :slideBackground="bg" @change="changed" :hide-flyout="hide" @active="isActive"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import RangeFlyout from './RangeFlyout';
  export default {
    data:()=>{
      return {
        chan:'',
        cb:null,
        bg:{},
        colorBase:null,
        v:null,
        hide:false,
        isInit:true,
        incr:1,
        activeRF:false
      }
    },
    components:{ RangeFlyout },
    name: 'RF',
    props:['lbl','max','h','previewColor','baseColor','incrementVal'],
    mounted(){
      if (this.incrementVal){
        this.incr=this.incrementVal;
      }
      const vm = this;
      if (this.lbl==='Hue'){
        this.hide = true;
      }
      this.init();
      setTimeout(()=>{
        Vue.nextTick().then(()=>{vm.isInit=false;})
      },123)
    },
    watch:{
      previewColor(c){
        //console.log(this.chan,'pv');
        this.init();
      },
      baseColor(){
        //console.log(this.chan,'bc');
        this.init();
      }
    },
    methods:{
      isActive(act){this.activeRF = act;},
      init(){
        this.chan = this.lbl.charAt(0).toLowerCase();
        this.colorBase = this.baseColor||this.previewColor;
        this.v = this.previewColor[this.chan];
        this.slideBg();
      },
      slideBg(){
        if (!this.colorBase || this.hide){
          return;
        }
        this.bg = this.colorBase.channelGradient(this.chan);
      },
      changed(v){
        if (this.chan==='' || this.isInit){
          return;
        }
        this.slideBg();
        if (this.activeRF){
          this.$emit('channel-change',{c:this.chan,v});
        }
      }
    }
  }
</script>

<style lang="scss">
  div.input {
    position: relative;
    margin-top:15px;
    label{
      position:relative;
      .line{
        position:absolute;
        height:40px;
        width:6px;
        top:-6px;
        left:0;
        border-radius:3px;
      }
      strong{font-weight:900;}
      margin:0 8px -2px 2px;
      font-weight: 300;
      display:inline-block;
      width:55px;
      text-align: right;
    }
    div.range-flyout-wrapper {
      display:inline-block;
      div.flyout {
        background:linear-gradient(180deg, #444, #111,#000);
        top: 0;
        left: 108px;
        z-index: 10;
      }
    }
    input[type=number] ,input[type=text] {
      background:linear-gradient(180deg, #f8f8f8, #ddd);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      //background-color: #fff;
      background-clip: padding-box;
      border: 1px solid transparent;
      &:active{
        outline-color: white;
      }
      border-radius: 0.25rem;
      display: inline-block;
      width: 60px;
      &.hex{
        width:80px;
      }
      height: calc(1.5em + .35rem + 2px);
      padding: .25rem 0 .25rem .375rem;
    }
  }

</style>