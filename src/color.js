const colorByte = v => Math.min(255, Math.max(0, parseInt(v)));
const toFlt = v => {
  if (!isNaN(v)) {
    return Math.max(0, Math.min(1, v));
  }
  if (typeof v==='string' && v.indexOf('%') > 0) {
    v = Number(v.split('%')[0]) / 100;
  }
  v = Number(v);
  if (!isNaN(v)) {
    return Math.max(0, Math.min(1, v));
  }

  return 1;
};
export const namedColors = {
  "aliceblue": "#F0F8FF",
  "antiquewhite": "#FAEBD7",
  "aqua": "#00FFFF",
  "aquamarine": "#7FFFD4",
  "azure": "#F0FFFF",
  "beige": "#F5F5DC",
  "bisque": "#FFE4C4",
  "black": "#000000",
  "blanchedalmond": "#FFEBCD",
  "blue": "#0000FF",
  "blueviolet": "#8A2BE2",
  "brown": "#A52A2A",
  "burlywood": "#DEB887",
  "cadetblue": "#5F9EA0",
  "chartreuse": "#7FFF00",
  "chocolate": "#D2691E",
  "coral": "#FF7F50",
  "cornflowerblue": "#6495ED",
  "cornsilk": "#FFF8DC",
  "crimson": "#DC143C",
  "cyan": "#00FFFF",
  "darkblue": "#00008B",
  "darkcyan": "#008B8B",
  "darkgoldenrod": "#B8860B",
  "darkgray": "#A9A9A9",
  "darkgrey": "#A9A9A9",
  "darkgreen": "#006400",
  "darkkhaki": "#BDB76B",
  "darkmagenta": "#8B008B",
  "darkolivegreen": "#556B2F",
  "darkorange": "#FF8C00",
  "darkorchid": "#9932CC",
  "darkred": "#8B0000",
  "darksalmon": "#E9967A",
  "darkseagreen": "#8FBC8F",
  "darkslateblue": "#483D8B",
  "darkslategray": "#2F4F4F",
  "darkslategrey": "#2F4F4F",
  "darkturquoise": "#00CED1",
  "darkviolet": "#9400D3",
  "deeppink": "#FF1493",
  "deepskyblue": "#00BFFF",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1E90FF",
  "firebrick": "#B22222",
  "floralwhite": "#FFFAF0",
  "forestgreen": "#228B22",
  "fuchsia": "#FF00FF",
  "gainsboro": "#DCDCDC",
  "ghostwhite": "#F8F8FF",
  "gold": "#FFD700",
  "goldenrod": "#DAA520",
  "gray": "#808080",
  "grey": "#808080",
  "green": "#008000",
  "greenyellow": "#ADFF2F",
  "honeydew": "#F0FFF0",
  "hotpink": "#FF69B4",
  "indianred ": "#CD5C5C",
  "indigo ": "#4B0082",
  "ivory": "#FFFFF0",
  "khaki": "#F0E68C",
  "lavender": "#E6E6FA",
  "lavenderblush": "#FFF0F5",
  "lawngreen": "#7CFC00",
  "lemonchiffon": "#FFFACD",
  "lightblue": "#ADD8E6",
  "lightcoral": "#F08080",
  "lightcyan": "#E0FFFF",
  "lightgoldenrodyellow": "#FAFAD2",
  "lightgray": "#D3D3D3",
  "lightgrey": "#D3D3D3",
  "lightgreen": "#90EE90",
  "lightpink": "#FFB6C1",
  "lightsalmon": "#FFA07A",
  "lightseagreen": "#20B2AA",
  "lightskyblue": "#87CEFA",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#B0C4DE",
  "lightyellow": "#FFFFE0",
  "lime": "#00FF00",
  "limegreen": "#32CD32",
  "linen": "#FAF0E6",
  "magenta": "#FF00FF",
  "maroon": "#800000",
  "mediumaquamarine": "#66CDAA",
  "mediumblue": "#0000CD",
  "mediumorchid": "#BA55D3",
  "mediumpurple": "#9370DB",
  "mediumseagreen": "#3CB371",
  "mediumslateblue": "#7B68EE",
  "mediumspringgreen": "#00FA9A",
  "mediumturquoise": "#48D1CC",
  "mediumvioletred": "#C71585",
  "midnightblue": "#191970",
  "mintcream": "#F5FFFA",
  "mistyrose": "#FFE4E1",
  "moccasin": "#FFE4B5",
  "navajowhite": "#FFDEAD",
  "navy": "#000080",
  "oldlace": "#FDF5E6",
  "olive": "#808000",
  "olivedrab": "#6B8E23",
  "orange": "#FFA500",
  "orangered": "#FF4500",
  "orchid": "#DA70D6",
  "palegoldenrod": "#EEE8AA",
  "palegreen": "#98FB98",
  "paleturquoise": "#AFEEEE",
  "palevioletred": "#DB7093",
  "papayawhip": "#FFEFD5",
  "peachpuff": "#FFDAB9",
  "peru": "#CD853F",
  "pink": "#FFC0CB",
  "plum": "#DDA0DD",
  "powderblue": "#B0E0E6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#FF0000",
  "rosybrown": "#BC8F8F",
  "royalblue": "#4169E1",
  "saddlebrown": "#8B4513",
  "salmon": "#FA8072",
  "sandybrown": "#F4A460",
  "seagreen": "#2E8B57",
  "seashell": "#FFF5EE",
  "sienna": "#A0522D",
  "silver": "#C0C0C0",
  "skyblue": "#87CEEB",
  "slateblue": "#6A5ACD",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#FFFAFA",
  "springgreen": "#00FF7F",
  "steelblue": "#4682B4",
  "tan": "#D2B48C",
  "teal": "#008080",
  "thistle": "#D8BFD8",
  "tomato": "#FF6347",
  "turquoise": "#40E0D0",
  "violet": "#EE82EE",
  "wheat": "#F5DEB3",
  "white": "#FFFFFF",
  "whitesmoke": "#F5F5F5",
  "yellow": "#FFFF00",
  "yellowgreen": "#9ACD32"
};
/*hueGradient(){
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
  }*/
const hueColorStops = 'rgb(255, 0, 0) 0%, rgb(255, 42, 0) 2.8%, rgb(255, 85, 0) 5.6%, rgb(255, 128, 0) 8.3%, rgb(255, 170, 0) 11.1%, rgb(255, 213, 0) 13.9%, rgb(255, 255, 0) 16.7%, rgb(212, 255, 0) 19.4%, rgb(170, 255, 0) 22.2%, rgb(128, 255, 0) 25%, rgb(85, 255, 0) 27.8%, rgb(43, 255, 0) 30.6%, rgb(0, 255, 0) 33.3%, rgb(0, 255, 42) 36.1%, rgb(0, 255, 85) 38.9%, rgb(0, 255, 128) 41.7%, rgb(0, 255, 170) 44.4%, rgb(0, 255, 213) 47.2%, rgb(0, 255, 255) 50%, rgb(0, 213, 255) 52.8%, rgb(0, 170, 255) 55.6%, rgb(0, 128, 255) 58.3%, rgb(0, 85, 255) 61.1%, rgb(0, 42, 255) 63.9%, rgb(0, 0, 255) 66.7%, rgb(43, 0, 255) 69.4%, rgb(85, 0, 255) 72.2%, rgb(128, 0, 255) 75%, rgb(170, 0, 255) 77.8%, rgb(212, 0, 255) 80.6%, rgb(255, 0, 255) 83.3%, rgb(255, 0, 212) 86.1%, rgb(255, 0, 170) 88.9%, rgb(255, 0, 128) 91.7%, rgb(255, 0, 85) 94.4%, rgb(255, 0, 43) 97.2%, rgb(255, 0, 0) 99.9%';

export class Color {
  constructor(input,g,b,a) {
    if (g !== undefined && b!== undefined){
      this.r = colorByte(input);
      this.g = colorByte(g);
      this.b = colorByte(b);
      if (this.a !== undefined){
        this.a = a;
      }
    }
    if (Array.isArray(input)) {
      return Color.fromArray(input);
    } else if (typeof input === 'string') {
      if (input.startsWith('#')) {
        return Color.fromHex(input);
      } else if (namedColors[input.toLowerCase()]) {
        return Color.fromNamed(input);
      } else if (input.startsWith('rgb')) {
        return Color.fromRgbString(input);
      }
    } else if (typeof input === 'object') {
      if (input.r !== undefined) {
        this.r = colorByte(input.r);
        this.g = colorByte(input.g);
        this.b = colorByte(input.b);
      }
      if (input.a !== undefined) {
        this.a = toFlt(input.a);
      }
      if (input.h !== undefined) {
        let c = {};
        if (input.v !== undefined) {
          c = Color.fromHsv(input);
        }else if (input.l !== undefined){
          c = Color.fromHsl(input);
        }else {
          return Color.fromArray([0, 0, 0]);
        }
        c.a = input.a !== undefined ? toFlt(input.a) : undefined;
        return new Color(c);
      }
      return this;
    }
    return Color.fromArray([0, 0, 0]);
  }
  static fromNamed(colorName){
    return Color.fromHex(namedColors[colorName.toLowerCase()])
  }
  static fromArray(input) {
    let c = {
      r: colorByte(input[0]),
      g: colorByte(input[1]),
      b: colorByte(input[2])
    };
    if (input[3]) {
      c.a = toFlt(input[3]);
    }
    return new Color(c);
  }

  static fromHex(hex) {
    if (hex.length < 5){
      hex = hex.split('').map(h=>h+h).join('');
    }
    return Color.fromArray(hex.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16)));
  }

  static fromRgbString(s) {
    return Color.fromArray(s.split('(')[1].split(')')[0].split(','))
  }

  static fromHsv({h, s, v}) {
    s = s / 100;
    v = v / 100;

    let hi = Math.floor((h / 60) % 6);
    let f = (h / 60) - hi;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    const sequences = [[v, t, p],
      [q, v, p],
      [p, v, t],
      [p, q, v],
      [t, p, v],
      [v, p, q]];
    let rgb = sequences[hi].map(chan => Math.round(chan * 256));

    return new Color({r: colorByte(rgb[0]), g: colorByte(rgb[1]), b: colorByte(rgb[2])});
  }

  static fromHsl({h, s, l}){
    //h=h/360;
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    return new Color({
      r:Math.round((m+r) * 255),
      g:Math.round((m+g) * 255),
      b:Math.round((m+b) * 255)
    });
  }

  static hueColorStops(){
    return hueColorStops;
  }
  get rgb() {
    return [this.r, this.g, this.b];
  }
  get rgba() {
    return [this.r, this.g, this.b, this.a===undefined? 1 : this.a];
  }
  get rgbArrayString() {
    return JSON.stringify([this.r, this.g, this.b]);
  }
  get rgbObj() {
    let o = {r:this.r,g:this.g,b:this.b};
    if (this.a !== undefined){
      o.a = this.a;
    }
    return o;
  }

  get rgbString() {
    return `rgb(${this.rgb.join(',')})`;
  }
  get rgbaString() {
    return `rgba(${this.rgb.join(',')},${this.a === undefined ? 1 : this.a})`;
  }
  get hex() {
    return `#${this.rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  }

  get HSV() {
    const rgbVal = channel => channel / 255;
    const r = rgbVal(this.r);
    const g = rgbVal(this.g);
    const b = rgbVal(this.b);
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    let hue;
    const value = max;
    const diff = max - min;

    // Hue
    if (diff === 0)
      hue = 0;
    else if (max === r)
      hue = (60 * ((g - b) / diff)) % 360;
    else if (max === g)
      hue = 60 * ((b - r) / diff) + 120;
    else if (max === b)
      hue = 60 * ((r - g) / diff) + 240;
    else hue = 0;
    if (hue < 0)
      hue += 360;

    // Saturation
    const saturation = max === 0 ? 0 : 1 - (min / max);

    return {
      h: Math.round(hue),
      s: Math.round(saturation * 100),
      v: Math.round(value * 100)
    };
  }
  get HSVString(){
    let hsv = this.HSV;
    return `{h:${hsv.h}, s:${hsv.s}, v:${hsv.v}}`;
  }
  get HSL(){
    let r = this.r;
    let g = this.g;
    let b = this.b;
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return {
      h:Math.round(h * 360),
      s:Math.round(s * 100),
      l:Math.round(l * 100) };
  }

  get HSLString(){
    let hsl = this.HSL;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  channelGradient(channel){
    let c1,c2;
    if (channel ==='h'){
      return `linear-gradient(0deg, ${hueColorStops})`;
    }
    if (channel==='s' || channel==='v'){
      c1 = this.HSV;
      c2 = this.HSV;
      c1[channel] = 0;
      c2[channel] = 100;
    }else if (channel==='l'){
      c1 = this.HSL;
      c2 = this.HSL;
      let c3 = this.HSL;

      c1.l = 1;
      c2.l = 50;
      c3.l = 100;
      return `linear-gradient(${new Color(c3).rgbaString},${new Color(c2).rgbaString},${new Color(c1).rgbaString})`;
    } else if (channel ==='a') {
      c1 = this.rgbObj;
      c2 = this.rgbObj;

      c1[channel] = 0;
      c2[channel] = 1;
    }
  else {
      c1 = this.rgbObj;
      c2 = this.rgbObj;

      c1[channel] = 0;
      c2[channel] = 255;
    }
    return `linear-gradient(${new Color(c2).rgbaString},${new Color(c1).rgbaString})`;
  }
}
