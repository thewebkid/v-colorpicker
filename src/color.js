import {Color} from 'modern-color'

export const hueColorStops = 'rgb(255, 0, 0) 0%, rgb(255, 42, 0) 2.8%, rgb(255, 85, 0) 5.6%, rgb(255, 128, 0) 8.3%, rgb(255, 170, 0) 11.1%, rgb(255, 213, 0) 13.9%, rgb(255, 255, 0) 16.7%, rgb(212, 255, 0) 19.4%, rgb(170, 255, 0) 22.2%, rgb(128, 255, 0) 25%, rgb(85, 255, 0) 27.8%, rgb(43, 255, 0) 30.6%, rgb(0, 255, 0) 33.3%, rgb(0, 255, 42) 36.1%, rgb(0, 255, 85) 38.9%, rgb(0, 255, 128) 41.7%, rgb(0, 255, 170) 44.4%, rgb(0, 255, 213) 47.2%, rgb(0, 255, 255) 50%, rgb(0, 213, 255) 52.8%, rgb(0, 170, 255) 55.6%, rgb(0, 128, 255) 58.3%, rgb(0, 85, 255) 61.1%, rgb(0, 42, 255) 63.9%, rgb(0, 0, 255) 66.7%, rgb(43, 0, 255) 69.4%, rgb(85, 0, 255) 72.2%, rgb(128, 0, 255) 75%, rgb(170, 0, 255) 77.8%, rgb(212, 0, 255) 80.6%, rgb(255, 0, 255) 83.3%, rgb(255, 0, 212) 86.1%, rgb(255, 0, 170) 88.9%, rgb(255, 0, 128) 91.7%, rgb(255, 0, 85) 94.4%, rgb(255, 0, 43) 97.2%, rgb(255, 0, 0) 99.9%';

export const channelGradient =(c,channel)=>{

    let c1,c2;
    if (channel ==='h'){
      return `linear-gradient(0deg, ${hueColorStops})`;
    }
    if (channel==='s' || channel==='v'){
      c1 = c.hsv;
      c2 = c.hsv;
      c1[channel] = 0;
      c2[channel] = 100;
    }else if (channel==='l'){
      c1 = c.hsl;
      c2 = c.hsl;
      let c3 = c.hsl;

      c1.l = 1;
      c2.l = 50;
      c3.l = 100;
      return `linear-gradient(${new Color(c3).rgbString},${new Color(c2).rgbString},${new Color(c1).rgbString})`;
    } else if (channel ==='a') {
      c1 = c.rgbObj;
      c2 = c.rgbObj;

      c1[channel] = 0;
      c2[channel] = 1;
    }
  else {
      c1 = c.rgbObj;
      c2 = c.rgbObj;

      c1[channel] = 0;
      c2[channel] = 255;
    }
    return `linear-gradient(${new Color(c2).rgbString},${new Color(c1).rgbString})`;
  };
