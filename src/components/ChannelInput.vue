<template>
  <div class="input" v-if="v!==null">
    <label class="inline" :style="{fontWeight:activeRF?900:100}">
      <span class="line" :style="{background:bg}" v-if="previewBars"></span>
      {{lbl}}
    </label>
    <range-flyout
        :min="0" :max="max" :incr="incr" :val="v"
        :sliderHeight="h"  :slideBackground="bg" :handle-bg="colorBase.hex"
        @change="changed" @active="isActive"
    />
  </div>
</template>

<script>
  import Vue from 'vue';

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
    computed:{
      previewBars(){
        return this.activeRF || !this.$parent.options || this.$parent.options.previewBars !== false;
      }
    },

    name: 'ChannelInput',
    props:['lbl','max','h','previewColor','baseColor','incrementVal'],
    mounted(){
      if (this.incrementVal){
        this.incr=this.incrementVal;
      }
      const vm = this;
      this.init();
      setTimeout(()=>{
        Vue.nextTick().then(()=>vm.isInit=false);
      },123)
    },
    watch:{
      previewColor(){
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
        //console.log(this.$parent.options);
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
    label.inline{
      position:relative;
      .line{
        position:absolute;
        height:40px;
        width:6px;
        top:-7px;
        right:-11px;
        border-radius:3px;
        border:solid .7px #eee;
      }
      strong{font-weight:900;}
      margin:0 12px -2px 2px;
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
        .inner{
          box-shadow:none;
          border:solid .7px #eee;
          border-radius:3px;
          div{
            box-shadow: 0 0 .7px #eee, inset 0 0 1px #111;
            //background:linear-gradient(90deg, rgba(234,234,234,.9),rgba(234,234,234,.5),rgba(234,234,234,.9));
            //background-color:rgba(234,234,234,.5);
            border-color:rgba(23,23,23,.9);
            &:hover {
              box-shadow: 0 0 2px #fff, inset 0 0 4px #fefefe;
              //background:linear-gradient(90deg, rgba(234,234,234,.9),rgba(234,234,234,.5),rgba(234,234,234,.9));
            }
          }
        }
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
      &:active,&:focus{
        outline: none;
        box-shadow:0 0 4px white;
      }
      border-radius: 0.25rem;
      display: inline-block;
      width: 60px;
      &.hex{
        width:80px;
        position:relative;
        top:-18px;
      }
      height: calc(1.5em + .35rem + 2px);
      padding: .25rem 0 .25rem .375rem;
    }
  }

</style>