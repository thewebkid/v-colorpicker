<template>
  <div  class="colorpicker-wrap" :class="{light:opt('light'),compact:opt('compact')}">
    <div class="top" v-if="advanced">
      <Hue :hsv="previewColor.HSV" @hueChange="updateColor"/>
    </div>
    <table :style="{marginBottom: !advanced ? '-9px' : 0}">
      <tbody>
      <tr v-if="advanced">
        <td class="input-col">
          <ChannelInput v-for="(l,i) in rgbLabels" :key="i" :lbl="l" :max="255" :h="128" :preview-color="previewColor"
                        @channel-change="channelChange"/>

          <template v-if="!opt('alphaHidden')">
            <ChannelInput v-if="opt('compact') || previewColor.a !== undefined" lbl="Alpha" :max="1" :incrementVal=".01" :h="100" :preview-color="previewColor" :base-color="previewColor"
                          @channel-change="channelChange"/>
            <a v-else @click="addAlpha" style="margin-top:19px;display: block;cursor: pointer">+ Alpha</a>
          </template>
        </td>
        <td class="input-col" v-if="hsw && hsw.wl">
          <ChannelInput lbl="Hue" :max="359" :h="180" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <ChannelInput lbl="Sat" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <ChannelInput :lbl="hsw.wl" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>

          <div class="mt-3" style="text-align: right;padding-right:13px;font-size:13px" v-if="opt('hslToggle') && !opt('compact')">
            <b-button-group size="sm" style="font-size: 0.75rem;">
              <b-button  :variant="mode==='hsl'?'success':''" @click="mode='hsl'">HSL</b-button>
              <b-button  :variant="mode==='hsv'?'success':''" @click="mode='hsv'">HSV</b-button>
            </b-button-group>
          </div>
          <div class="input" :class="{light:opt('light'),compact:opt('compact')}" v-if="opt('compact')">
            <input type="text" v-model="hexVal" @change="updateColor(hexVal, true)" class="hex"/>
          </div>
        </td>
        <td class="variant-square">
          <variant-square v-if="canRender" :hsw="hsw" :isHsl="mode==='hsl'" :light="opt('light')" @variantchange="updateColor"/>
          <div style="text-align: right;padding:5px 0px;font-size:13px" v-if="opt('hslToggle') && opt('compact')">
            <b-button-group size="sm" style="font-size: 0.75rem;">
              <b-button  :variant="mode==='hsl'?'success':''" @click="mode='hsl'">HSL</b-button>
              <b-button  :variant="mode==='hsv'?'success':''" @click="mode='hsv'">HSV</b-button>
            </b-button-group>
          </div>
        </td>
      </tr>
      <tr v-else>
        <td colspan="3">
          <SimpleCanvas v-if="canRender" :hsv="previewColor.HSV" @variantchange="updateColor"/>
        </td>
      </tr>
      <tr v-if="advanced && !opt('compact')">
        <td colspan="3">
          <hr>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top;padding-top:8px;" v-if="opt('allowModeChange')">
          <b-form-checkbox
            v-model="advanced"
            name="checkbox-adv">
            Advanced
          </b-form-checkbox>

        </td>
        <td class="input-col" v-if="advanced" :colspan="opt('allowModeChange') ? 1 : 2">
          <div class="input" style="display: inline-block;margin:-20px -40px 0 -12px;text-align:right" v-if="!opt('compact')">
            <label class="inline">
              <a id="popover-strings" style="cursor: pointer;" :style="{visibility:opt('formatsPopup') ? 'visible':'hidden'}">
              <small>All&nbsp;formats</small>
            </a></label>
            <input type="text" v-model="hexVal" @change="updateColor(hexVal, true)" class="hex"/>
            <br>
          </div>
          <all-formats-popover :color="previewColor"/>

        </td>
        <td v-else style="vertical-align: top;padding-top:8px;">
          <hsvv :hsv="previewColor.HSV" @hsvvChange="updateColor"/>
        </td>
        <td style="padding-top:1px">
          <b-button size="sm" id="okBtn" class="btn-outline float-right" :variant="opt('light') ? 'light':'dark'" @click="$emit('picked',previewColor)" :style="{marginRight: !advanced ? '7px' : '15px'}">
            OK
            <span class="dswatch" :style="{'background-color': previewColor.rgbaString}"></span>
          </b-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Vue from 'vue';
  import BootstrapVue from 'bootstrap-vue'
  import movable from 'v-movable';
  import rangeFlyout from 'v-range-flyout';
  import Hue from './Hue.vue';
  import ChannelInput from './ChannelInput.vue';
  import allFormatsPopover from './AllFormatsPopover.vue';
  import VariantSquare from './VariantSquare.vue';
  import {Color} from '../color.js';
  import SimpleCanvas from "./SimpleCanvas.vue";
  import hsvv from "./HSVV.vue";
  Vue.use(rangeFlyout);
  Vue.use(movable);
  Vue.use(BootstrapVue);
  const debug = ()=>window._debugColorPicker === true;
  const rgb = 'rgb';
  const isHsl = c => rgb.indexOf(c) === -1;

  export default {
    data: () => {
      return {
        startColor: new Color(),
        previewColor: new Color(),
        hexVal:'',
        rgbLabels: ['Red', 'Green', 'Blue'],
        canRender: false,
        ctx:null,
        bouncer:null,
        mode:'',
        hueGradient:'',
        savedState:{},
        advanced:true,
        defaultOptions:{
          sticky:true,
          compact:false,
          light:false,
          allowModeChange:true,
          advanced:false,
          alpha:undefined,
          alphaHidden:false,
          formatsPopup:true,
          previewBars:true,
          hslToggle:true
        }
      }
    },
    computed:{
      opt(){
        return optionString => {
          if (!this.options || this.options[optionString]===undefined){
            return this.defaultOptions[optionString];
          }else{
            return this.options[optionString];
          }
        }
      },
      hsw(){
        let c = this.previewColor;
        let hsl = this.mode === 'hsl';
        let hsw = hsl ? c.HSL : c.HSV;
        hsw.w = hsl ? hsw.l : hsw.v;
        hsw.wl = hsl ? 'Lum' : 'Val';
        return hsw;
      }
    },
    components: {Hue, SimpleCanvas, ChannelInput, allFormatsPopover, VariantSquare, hsvv},
    name: 'ColorPicker',
    props: [
      'value','options'
    ],
    created(){

    },
    mounted() {
      const vm = this;
      let savedState = localStorage.getItem('v-cpicker');
      if (savedState){
        savedState = this.savedState = JSON.parse(savedState);

        if (!savedState.mode){
          this.savedState.mode = 'hsl';
        }
        this.advanced = savedState.advanced;
        this.mode = savedState.mode;
      }else {
        this.advanced = this.options && this.options.advanced === true;
        this.savedState = {
          advanced:this.advanced,
          mode:'hsl'
        };
        localStorage.setItem('v-cpicker', JSON.stringify(this.savedState))
      }
      this.startColor = new Color(this.value);
      this.updateColor(this.value,true);
      this.hueGradient = Color.hueColorStops();
      this.canRender = true;
      if (this.opt('alpha')){
        this.addAlpha();
      }
      Vue.nextTick().then(() => {
        vm.mode = this.savedState.mode;
      });
      if(debug()){
        console.log(`**********colorpicker debug (mounted)***********`);
        console.log({startColor:this.startColor,value:this.value,previewColor:this.previewColor})
      }
    },
    watch:{
      options(opts){
        //console.log(opts);
      },
      advanced(flag){
        this.savedState.advanced = flag;
        localStorage.setItem('v-cpicker', JSON.stringify(this.savedState));
        console.log(flag)
      },
      mode(m){
        this.savedState.mode = m;
        localStorage.setItem('v-cpicker', JSON.stringify(this.savedState))
      },
      enableAlpha(enable){
        if (enable){
          this.addAlpha();
        }else{
          this.updateColor(this.previewColor.hex, true);
        }
      }
    },
    methods: {
      addAlpha(){
        if (this.previewColor.a === undefined) {
          this.updateColor(new Color(Object.assign(this.previewColor.rgbObj, {a: 1})));
        }
      },
      channelChange({c, v}) {
        const vm = this;
        if (isHsl(c)) {
          let hsw = this.hsw;
          hsw[c] = v;
          vm.updateColor(new Color(hsw));
        } else {
          let rgb = vm.previewColor.rgbObj;
          rgb[c] = v;
          vm.updateColor(new Color(rgb));
        }
      },
      updateColor(updatedColor,construct){
        if (construct===true || updatedColor.constructor.name !== 'Color'){
          updatedColor = new Color(updatedColor);
        }
        this.previewColor = updatedColor;
        this.hexVal = this.previewColor.hex;
        Vue.nextTick().then(() => {
          this.$emit('preview', this.previewColor);
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../scss/shared";
  .colorpicker-wrap {
    display:inline-block;
    background: linear-gradient(180deg, #444, #222, #111, #000);
    color:#eee;

    &.light{
      #okBtn{background:linear-gradient(180deg,  #e7e7e7, #d3d3d3);}
      background: linear-gradient(180deg, #f7f7f7, #e7e7e7, #e3e3e3);
      color:#111;
      a{
        color:#007bff;
        &:hover{
          color:darken(#007bff, 15%);
        }
      }
      hr {
        border-color: #ccc;
      }
    }
    box-shadow:0 0 3px #777777;
    border-radius:8px;
    padding:17px 10px 5px 10px;
    #okBtn {
      cursor:pointer;
      position:relative;
      left:-2px;
      margin:0 0px 12px  0;
      box-shadow:0 0 1px #222;
      padding:6px 10px;
      border-color:#ccc;
      .dswatch {
        margin-left:5px;
        position:relative;
        top:2px;
        display: inline-block;
        height: 15px;
        width: 15px;
        border-radius: 2px;
        box-shadow: 0 0 1px #fff, inset 0 0 1px #eee;
        background: white;
      }
    }
    hr{
     border-color:#555;
     margin-left:-7px;
     position:relative;
     left:-3px;
   }
    table{
      max-width:473px;
      margin-right:-12px;
      table-layout: fixed;


    }
    td.input-col {
      padding-top:12px;
      vertical-align: top;
      width: 144px;
      margin-right:-4px;
      overflow: visible;
    }
    td.variant-square {
      vertical-align: top;
      width: 180px;
      padding: 12px 16px 0 4px;
    }
    &.compact{
      hr{
        margin:3px 0 -3px -7px
      }
      table {
        max-width: 413px;
      }
      td.input-col {
        width: 128px;
        input[type=text].hex {
          background: linear-gradient(180deg, #fff, #fff);
          color: #111;
          top:37px;
          left:7px;
          &:active,&:focus{
            outline: none;
            border:1px solid #4D90FE;
            box-shadow: 0px 0px 5px  #4D90FE;
          }
        }
      }
      td.variant-square{
        width:120px;
      }
    }
  }
</style>
