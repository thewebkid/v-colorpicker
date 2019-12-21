<template>
  <div class="input" v-if="value !== null" :class="{light, compact}">
    <label class="inline" :style="{fontWeight: activeRF ? 900 : 100}">
      <span class="line" :style="{background: bg}" v-if="previewBars">
        <span class="pct" :style="{top: (pct * 100) + '%'}"></span>
      </span>
      {{compact ? lbl.charAt(0) : lbl}}
    </label>
    <range-flyout
        :min="0" :max="max" :incr="incr" v-model="value"
        :sliderHeight="h"  :slideBackground="bg" :handle-bg="colorBase.hex"
        @change="changed" @active="isActive"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {channelGradient} from "../color";

  export default {
    data:()=>{
      return {
        chan:'',
        cb:null,
        bg:{},
        colorBase:null,
        value:null,
        hide:false,
        isInit:true,
        incr:1,
        activeRF:false,
        pct:0
      }
    },
    computed:{
      previewBars(){
        return !this.activeRF && (!this.$parent.options || this.$parent.options.previewBars !== false);
      },
      compact(){
        return this.$parent.opt('compact')
      },
      light(){
        return this.$parent.opt('light')
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
      this.changed(this.value);
      setTimeout(()=>{
        Vue.nextTick().then(()=>vm.isInit=false);
      },123)
    },
    watch:{
      previewColor(){
        this.init();

      },
      baseColor(){
        this.init();
      }
    },
    methods:{
      isActive(act){
        this.activeRF = act;
      },
      init(){
        this.chan = this.lbl.charAt(0).toLowerCase();
        this.colorBase = this.baseColor||this.previewColor;
        this.value = this.previewColor[this.chan];
        if (this.chan === 'a' && this.value === undefined){
          this.$emit('channel-change',{c:this.chan,v:1});
        }
        this.slideBg();
      },
      slideBg(){
        if (!this.colorBase || this.hide){
          return;
        }
        this.bg = channelGradient(this.colorBase, this.chan);
      },
      changed(v){
        this.pct = 1 - (v / this.max);
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
    &.compact{
      label.inline{

          width:12px;
          .line{
            height:36.5px;
            top:-6px;
          }
      }
      input[type=number],input[type=text] {
        font-size: .9rem;
        line-height: 1;

        height: 36px;
        padding: .125rem 0 .125rem .375rem;
      }
    }
    position: relative;
    margin-top:3px;
    label.inline{
      position:relative;
      .line{
        position:absolute;
        height:42.5px;
        width:8px;
        top:-9.5px;
        right:-75px;
        border-radius:0 3px 3px 0;
        border:solid .7px #666;
        z-index: 9;
        .pct{
          left:-2px;
          margin-top:-.75px;
          position:absolute;
          width:10px;
          height:3px;
          background:transparent;
          border:solid .7px #888;
          display: inline-block;
          &:before{
            content:'';
            height:4px;
            width:5px;
            position:absolute;
            left:-1px;
            top:-1.5px;
            background-color:#eee;
            clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
          }
        }
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
        left: 62px;
        z-index: 10;
        .inner{
          box-shadow:none;
          border-radius:3px;
          div{
            margin-left:-5.5px;
            border-color:rgba(23,23,23,.9);
            &.is-moving {
              border-color:#777;
            }
          }
        }
      }
    }

    input[type=number],input[type=text] {

      position:relative;
      left:-1px;
      background:linear-gradient(180deg, #111, #000);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #eee;

      background-clip: padding-box;
      border: .7px solid #777;
      &:active,&:focus{
        outline: none;
        border:1px solid #fff;
        box-shadow: 0px 0px 5px #fff;
      }

      border-radius: 0.25rem;
      display: inline-block;
      width: 60px;
      &.hex{
        width:80px;
        position:relative;
        //top:-18px;
      }
      height: 42px;
      padding: .25rem 0 .25rem .375rem;
    }
    input[type=number] {
      border-radius: 0.25rem 0 0 0.25rem;
      border-right:0;
      font-size: 1.1rem;
      font-weight: 400;
      line-height: 1.5;
    }
    &.light{
      div.range-flyout-wrapper{
        div.flyout {
          background: linear-gradient(180deg, #eee, #ddd, #ccc);
          .inner div{border-color:rgba(234,234,234,.9);}
        }
      }
      label.inline {
        border:none;
        outline:none;
        .line{
          border:solid .7px #aaa;
          //right:-12px;
          .pct{
            border-color:#ddd;
            &:before{
              background-color:#444;
            }
          }
        }
      }
      input[type=number], input[type=text].hex {
        background: linear-gradient(180deg, #fff, #fff);
        color: #111;
        &:active,&:focus{
          outline: none;
          border:1px solid #4D90FE;
          box-shadow: 0px 0px 5px  #4D90FE;
        }
      }

    }
  }

</style>
