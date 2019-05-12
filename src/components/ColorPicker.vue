<template>
  <div v-if="canRender" class="colorpicker-wrap">
    <div class="top">
      <div class="hue-gradient" :style="{background:`linear-gradient(90deg, ${hueGradient(10)})`}"></div>
    </div>

    <table>
      <tbody>
      <tr>
        <td class="c input-col">
          <RF v-for="(l,i) in rgbLabels" :key="i" :lbl="l" :max="255" :h="128" :preview-color="previewColor"
                                     @channel-change="channelChange"/>
          <div class="my-3">
            <!-- Our triggering (target) element -->
            <a id="popover-strings" style="cursor: pointer;display: block;text-align: center">All formats</a>
          </div>
        </td>
        <td class="r input-col" valign="top" v-if="hsw && hsw.wl">
          <RF lbl="Hue" :max="360" :h="120" :preview-color="hsw" :base-color="previewColor"
              @channel-change="channelChange"/>
          <RF lbl="Sat" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
              @channel-change="channelChange"/>
          <RF :lbl="hsw.wl" :max="100" :h="100" :preview-color="hsw" :base-color="previewColor"
              @channel-change="channelChange"/>
          <RF lbl="Alpha" :max="1" :incrementVal=".01" :h="100" :preview-color="previewColor" :base-color="previewColor"
              @channel-change="channelChange"/>

          <b-popover
              target="popover-strings"
              triggers="click"
              placement="auto"
              container="my-container"
              ref="popover"
          >

            <div style="padding:12px 0;margin:0 -9px">
              <div class="container" title="RGBA Web format">
                <input type="text" v-model="previewColor.rgbString">
                <button type="button" @mousedown="message=previewColor.rgbString;" @click="doCopy">Copy</button>
              </div>
              <div class="container" title="Hexadecimal Web format">
                <input type="text" v-model="previewColor.hex">
                <button type="button" @mousedown="message=previewColor.hex;" @click="doCopy">Copy</button>
              </div>
              <div class="container" title="HSL Web format">
                <input type="text" v-model="previewColor.HSLString">
                <button type="button" @mousedown="message=previewColor.HSLString;" @click="doCopy">Copy</button>
              </div>
              <div class="container" title="HSV format">
                <input type="text" v-model="previewColor.HSVString">
                <button type="button" @mousedown="message=previewColor.HSVString;" @click="doCopy">Copy</button>
              </div>
              <div class="container" title="Plain rgb array [r,g,b]">
                <input type="text" v-model="previewColor.rgbArrayString">
                <button type="button" @mousedown="message=previewColor.rgbArrayString;" @click="doCopy">Copy</button>
              </div>


            </div>
          </b-popover>
        </td>
        <td class="l input-col">
          <div class="canvas">
            <movable @move="circleMove"><div class="circle" :style="{top:160 - (hsw.w * 1.6) + 'px',left: (hsw.s * 1.6) + 'px'}"></div></movable>
            <canvas height="500" width="500" ref="hsw" @click="satMaskClick($event)"></canvas>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <hr>
        </td>
      </tr>
      <tr>
        <td class="input-col">
          <div class="input" style="display: inline-block;margin:-2px -40px 0 -12px">
            <label>Hex</label>
            <input type="text" v-model="previewColor.hex" class="hex"/>
          </div>
        </td>
        <td colspan="2" style="padding-top:1px">
          <a class="btn-lg btn-dark btn-outline float-right">
            OK
            <span class="dswatch" :style="{'background-color': previewColor.hex}"></span>
          </a>
          <b-form-radio-group style="display:inline-block;margin:12px 0 0 8px" @change="paintBouncer">
            <b-form-radio v-model="mode" value="hsl">HSL</b-form-radio>
            <b-form-radio v-model="mode" value="hsv">HSV</b-form-radio>
          </b-form-radio-group>
        </td>

      </tr>
      </tbody>
    </table>


  </div>
</template>

<script>
  import Vue from 'vue';
  import BootstrapVue from 'bootstrap-vue'

  Vue.use(BootstrapVue);
  import VueClipboard from 'vue-clipboard2'
  VueClipboard.config.autoSetContainer = true;
  Vue.use(VueClipboard);
  import RF from './RF';
  import RangeFlyout from './RangeFlyout';
  import {Color} from '../color';

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
        message:``,
        mode:''
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
      },
      hueGradient(){
        return (gran=3) => {

          let h = 0;
          let stops = [];
          while (h < 360) {
            stops.push(`${new Color({h,s:100,l:50}).hex} ${(h / 3.6).toFixed(1)}%`);
            h += gran;
          }
          //console.log(stops.join(', '))
          return stops.join(', ')
        }
      }
    },
    components: {RangeFlyout, RF},
    name: 'ColorPicker',
    props: [
      'value'
    ],
    mounted() {
      const vm = this;
      this.startColor = new Color(this.value);
      this.previewColor = new Color(this.value);
      this.canRender = true;
      Vue.nextTick().then(() => {
        vm.ctx = vm.$refs.hsw.getContext('2d');
        vm.paintBouncer();
        vm.mode = 'hsl';
      });
    },

    methods: {
      doCopy: function () {
        this.$copyText(this.message).then(function (e) {
          console.log('copied',e);
        }, function (e) {
          console.log('error', e);
        })
      },
      circleMove({css}){
        let e = {offsetX:css.left,offsetY:css.top};
        this.satMaskClick(e);
      },
      satMaskClick(e){
        let w = (160 - e.offsetY) / 160;//todo:bad ron- magic numbers
        w = Math.round(w * 100);
        let sat = Math.round((e.offsetX / 160) * 100);
        let hsw = {h: this.hsw.h, s: sat};
        hsw[this.mode ==='hsl' ? 'l':'v'] = w;
        this.previewColor = new Color(hsw);
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
          this.paintBouncer();
        });

      },
      paintBouncer(){
        clearTimeout(this.bouncer);
        this.bouncer = setTimeout(this.paintHsl,80);
      },
      paintHsl(){
        if (this.mode === 'hsv'){
          return this.paintHsv();
        }
        let ctx = this.ctx || this.$refs.hsw.getContext('2d');
        let hue = Math.round(this.previewColor.HSL.h * 1/*360*/);
        //console.time(`hsl${hue}`);
        ctx.clearRect(0,0,500,500);
        let incr = 2;
        for (let sat = 0; sat < 100; sat += incr){
          for (let lum = 0; lum < 100; lum += incr){
            ctx.fillStyle = `hsl(${hue}, ${sat}%, ${100-lum}%)`;
            ctx.fillRect(sat * 5, lum * 5, (sat + incr) * 5, (lum + incr) * 5);
          }
        }

        //console.timeEnd(`hsl${hue}`);
        //this.paintHsv();
      },
      paintHsv(){
        //return;
        let ctx =  this.ctx || this.$refs.hsw.getContext('2d');
        let h = Math.round(this.previewColor.HSV.h * 1/*360*/);
        //console.time(`hsv${h}`);
        ctx.clearRect(0,0,500,500);

        let incr = 2;
        for (let s = 0; s < 100; s += incr){
          for (let v = 0; v < 100; v += incr){
            ctx.fillStyle = new Color({h,s,v:100-v}).hex;
            ctx.fillRect(s * 5, v * 5, (s + incr) * 5, (v + incr) * 5);
          }
        }

        //console.timeEnd(`hsv${h}`);
      }
    }
  }
</script>
<style lang="scss">
  .popover-body{
    background:linear-gradient(#fff,#eee,#eee,#ddd);
    box-shadow: 0 3px 3px #555;
  }
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
      margin-bottom: 2px;
      border:solid 1px #777;
    }
    table{
      max-width:473px;
      margin-right:-12px;
      table-layout: fixed;
      hr{
        border-color:#777;
        margin-left:-7px;
      }
      .btn-lg {
        margin:0 15px 12px  0;
        box-shadow:0 0 1px #222;
        .dswatch {
          margin-left:5px;
          display: inline-block;
          //vertical-align: middle;
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

      &.l {
        width: 180px;
        padding: 5px 16px 0 0;
      }

      .canvas, canvas {
        height: 160px;
        width: 160px;
        display: block;
        //margin-bottom:-20px;
        //background-color:dodgerblue;
      }
      .canvas{
        height: 162px;
        width: 162px;
        margin:5px -2px 0 0;
        border: solid 1px #777;
        position:relative;
        .circle{
          height:14px;
          width:14px;
          border:solid 2px #eee;
          border-radius:50%;
          box-shadow: 0 0 2px #000, inset 0 0 2px #000;
          position:absolute;
          margin:-7px;
        }
      }
    }
  }
</style>
