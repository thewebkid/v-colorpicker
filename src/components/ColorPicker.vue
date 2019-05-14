<template>
  <div v-if="canRender" class="colorpicker-wrap">
    <div class="top" v-if="advanced">
      <Hue :hsv="previewColor.HSV" @hueChange="variantChange"/>
      <!--<div class="hue-gradient" :style="{background:`linear-gradient(90deg, ${hueGradient})`}"></div>-->
    </div>

    <table :style="{marginBottom: !advanced ? '-9px' : 0}">
      <tbody>
      <tr v-if="advanced">
        <td class="input-col">
          <ChannelInput v-for="(l,i) in rgbLabels" :key="i" :lbl="l" :max="255" :h="128" :preview-color="previewColor"
                        @channel-change="channelChange"/>

          <ChannelInput v-if="previewColor.a !== undefined" lbl="Alpha" :max="1" :incrementVal=".01" :h="100" :preview-color="previewColor" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <a v-else @click="addAlpha" style="margin-top:19px;display: block;cursor: pointer">+ Alpha</a>

        </td>
        <td class="input-col" valign="top" v-if="hsw && hsw.wl">
          <ChannelInput lbl="Hue" :max="359" :h="180" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <ChannelInput lbl="Sat" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <ChannelInput :lbl="hsw.wl" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
                        @channel-change="channelChange"/>
          <div class="mt-3" style="text-align: right;padding-right:13px;font-size:13px">
            <b-button-group size="sm" style="font-size: 0.75rem;">
              <b-button  :variant="mode==='hsl'?'success':''" @click="mode='hsl'">HSL</b-button>
              <b-button  :variant="mode==='hsv'?'success':''" @click="mode='hsv'">HSV</b-button>
            </b-button-group>
          </div>

        </td>
        <td class="variant-square">
          <variant-square :hsw="hsw" :isHsl="mode==='hsl'" @variantchange="variantChange"/>

        </td>
      </tr>
      <tr v-else>
        <td colspan="3">
          <SimpleCanvas :hsv="previewColor.HSV" @variantchange="variantChange"/>
        </td>
      </tr>
      <tr v-if="advanced">
        <td colspan="3">
          <hr>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top;padding-top:8px;">
          <b-form-checkbox
            v-model="advanced"
            name="checkbox-adv">
            Advanced
          </b-form-checkbox>

        </td>
        <td class="input-col" v-if="advanced">
          <div class="input" style="display: inline-block;margin:-2px -40px 0 -12px">
            <label class="inline">Hex
              <br><a id="popover-strings" style="cursor: pointer;">
              <small>All&nbsp;formats</small>
            </a></label>
            <input type="text" v-model="previewColor.hex" class="hex"/>
            <br>
          </div>
          <all-formats-popover :color="previewColor"/>

        </td>
        <td v-else style="vertical-align: top;padding-top:8px;">
          <hsvv :hsv="previewColor.HSV" @hsvvChange="variantChange"/>
        </td>
        <td  style="padding-top:1px">
          <a class="btn-lg btn-dark btn-outline float-right" @click="$emit('picked',previewColor)" :style="{marginRight: !advanced ? '7px' : '15px'}">
            OK
            <span class="dswatch" :style="{'background-color': previewColor.rgbaString}"></span>
          </a>
          <!--<b-form-radio-group class="hsw-radios">
            <b-form-radio v-model="mode" value="hsl">HSL</b-form-radio>
            <b-form-radio v-model="mode" value="hsv">HSV</b-form-radio>
          </b-form-radio-group>-->
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
  Vue.use(movable);
  Vue.use(BootstrapVue);

  import Hue from './Hue.vue';
  import ChannelInput from './ChannelInput.vue';
  import RangeFlyout from './RangeFlyout.vue';
  import allFormatsPopover from './AllFormatsPopover.vue';
  import VariantSquare from './variant-square.vue';
  import {Color} from '../color.js';
  import SimpleCanvas from "./SimpleCanvas.vue";
  import hsvv from "./HSVV.vue";

  const rgb = 'rgb';
  const isHsl = c => rgb.indexOf(c) === -1;
  export default {
    data: () => {
      return {
        startColor: new Color(),
        previewColor: new Color(),
        rgbLabels: ['Red', 'Green', 'Blue'],
        canRender: false,
        ctx:null,
        bouncer:null,
        mode:'',
        hueGradient:'',
        advanced:true
      }
    },
    computed:{
      hsw(){
        let c = this.previewColor;
        let hsl = this.mode === 'hsl';
        let hsw = hsl ? c.HSL : c.HSV;
        hsw.w = hsl ? hsw.l : hsw.v;
        hsw.wl = hsl ? 'Lum' : 'Val';
        return hsw;
      }
    },
    components: {Hue, SimpleCanvas, RangeFlyout, ChannelInput, allFormatsPopover,VariantSquare,hsvv},
    name: 'ColorPicker',
    props: [
      'value'
    ],
    mounted() {
      const vm = this;
      this.startColor = new Color(this.value);
      this.previewColor = new Color(this.value);
      this.hueGradient = Color.hueColorStops();
      this.canRender = true;

      Vue.nextTick().then(() => {
        vm.mode = 'hsl';
      });
    },
    methods: {
      addAlpha(){
        this.previewColor = new  Color(Object.assign(this.previewColor.rgbObj,{a:1}));
      },
      channelChange({c, v}) {
        const vm = this;
        if (isHsl(c)) {
          let hsw = this.hsw;
          hsw[c] = v;
          vm.previewColor = new Color(hsw);
        } else {
          let rgb = vm.previewColor.rgbObj;
          rgb[c] = v;
          vm.previewColor = new Color(rgb);
        }
        Vue.nextTick().then(() => {
          vm.$emit('preview', vm.previewColor);
          //this.paintBouncer();
        });

      },
      variantChange(updatedColor){
        this.previewColor = updatedColor;
      }

    }
  }
</script>
<style lang="scss">

  .colorpicker-wrap {
    display:inline-block;
    background:linear-gradient(180deg, #444, #222,#111,#000);
    color:#eee;
    box-shadow:0 0 3px #777777;
    border-radius:8px;
    padding:17px 10px 5px 10px;
    .hue-gradient {
      height: 17px;
      width: 450px;
      margin:0 0 2px 3px;
      border:solid 1px #777;
    }
    table{
      max-width:473px;
      margin-right:-12px;
      table-layout: fixed;
      hr{
        border-color:#777;
        margin-left:-7px;
        position:relative;
        left:-3px;
      }
      .btn-lg {
        margin:0 15px 12px  0;
        box-shadow:0 0 1px #222;
        padding:6px 16px;
        .dswatch {
          margin-left:5px;
          display: inline-block;
          height: 15px;
          width: 15px;
          border-radius: 2px;
          box-shadow: 0 0 1px #fff, inset 0 0 1px #eee;
          background: white;
        }
      }
    }
    td.input-col {
      width: 144px;
      margin-right:-4px;
      overflow: visible;
    }
    td.variant-square {
      vertical-align: top;
      width: 180px;
      padding: 12px 16px 0 4px;
    }
    .hsvv{
      position:relative;
      height:20px;
      width:200px;
      background:linear-gradient(90deg, black, white);
      border:solid 1px #888;
      border-radius:3px;
      margin:0 0 10px 10px;
      .bar{
        height:24px;
        width:12px;
        margin:-2px -6px;
        position:absolute;
        box-shadow: 0 0 .7px #eee, inset 0 0 1px #111;
        border-color:rgba(23,23,23,.9);
        &:hover {
          box-shadow: 0 0 2px #fff, inset 0 0 2px #fefefe;

        }
      }
    }
  }
</style>
