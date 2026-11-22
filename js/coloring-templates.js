/* =====================================================================
 * STWADD — Colouring Studio templates
 * Simple, friendly SVG line-art made of closed shapes. Each shape is a
 * clickable region that can be filled with a colour. 400x400 viewBox.
 * Fields per shape: t (path|circle|ellipse|rect), geometry, c (default
 * fill), w (stroke width). Decorative faces use small dark shapes that
 * are also recolourable — kids can make the picture their own.
 * ===================================================================== */
(function () {
  'use strict';

  var T = [
    {
      name: 'Happy Cup',
      shapes: [
        { t: 'path', d: 'M120,120 L280,120 L262,330 Q260,352 238,352 L162,352 Q140,352 138,330 Z', c: '#dbeaf2' },
        { t: 'path', d: 'M112,120 L112,102 Q112,92 200,92 Q288,92 288,102 L288,120 Q200,132 112,120 Z', c: '#3fa9c9' },
        { t: 'path', d: 'M150,352 L250,352 L250,368 Q200,376 150,368 Z', c: '#8a96a1' },
        { t: 'circle', cx: 168, cy: 210, r: 15, c: '#ffffff' },
        { t: 'circle', cx: 232, cy: 210, r: 15, c: '#ffffff' },
        { t: 'circle', cx: 168, cy: 210, r: 5, c: '#25313b', w: 2 },
        { t: 'circle', cx: 232, cy: 210, r: 5, c: '#25313b', w: 2 },
        { t: 'path', d: 'M172,262 Q200,292 228,262 Q200,276 172,262 Z', c: '#e86fa8', w: 3 },
        { t: 'circle', cx: 146, cy: 246, r: 10, c: '#f2913c', w: 2 },
        { t: 'circle', cx: 254, cy: 246, r: 10, c: '#f2913c', w: 2 }
      ]
    },
    {
      name: 'Ice Cream',
      shapes: [
        { t: 'path', d: 'M150,180 L250,180 L200,340 Z', c: '#e9bd7a' },
        { t: 'path', d: 'M163,205 L237,205 M154,232 L246,232 M145,260 L255,260 M136,288 L264,288', c: '#ffffff', w: 2 },
        { t: 'circle', cx: 200, cy: 150, r: 58, c: '#f6cf46' },
        { t: 'circle', cx: 148, cy: 178, r: 42, c: '#e86fa8' },
        { t: 'circle', cx: 252, cy: 178, r: 42, c: '#8b5cc7' },
        { t: 'circle', cx: 200, cy: 96, r: 17, c: '#e8484f', w: 3 },
        { t: 'path', d: 'M200,80 Q198,66 210,62', c: '#ffffff', w: 3 }
      ]
    },
    {
      name: 'Cat',
      shapes: [
        { t: 'path', d: 'M118,158 L112,78 L184,128 Z', c: '#f2913c' },
        { t: 'path', d: 'M282,158 L288,78 L216,128 Z', c: '#f2913c' },
        { t: 'circle', cx: 200, cy: 205, r: 92, c: '#f6cf46' },
        { t: 'ellipse', cx: 168, cy: 195, rx: 15, ry: 19, c: '#ffffff' },
        { t: 'ellipse', cx: 232, cy: 195, rx: 15, ry: 19, c: '#ffffff' },
        { t: 'circle', cx: 168, cy: 197, r: 5, c: '#25313b', w: 2 },
        { t: 'circle', cx: 232, cy: 197, r: 5, c: '#25313b', w: 2 },
        { t: 'path', d: 'M188,228 L212,228 L200,242 Z', c: '#e86fa8', w: 3 },
        { t: 'path', d: 'M200,244 Q188,262 172,250 M200,244 Q212,262 228,250', c: '#ffffff', w: 3 },
        { t: 'path', d: 'M132,232 L92,222 M132,244 L94,250 M268,232 L308,222 M268,244 L306,250', c: '#ffffff', w: 2 },
        { t: 'ellipse', cx: 200, cy: 352, rx: 66, ry: 46, c: '#f6cf46' }
      ]
    },
    {
      name: 'Rainbow',
      shapes: [
        { t: 'path', d: 'M50,320 A150,150 0 0 1 350,320 L310,320 A110,110 0 0 0 90,320 Z', c: '#e8484f' },
        { t: 'path', d: 'M90,320 A110,110 0 0 1 310,320 L278,320 A78,78 0 0 0 122,320 Z', c: '#f2913c' },
        { t: 'path', d: 'M122,320 A78,78 0 0 1 278,320 L246,320 A46,46 0 0 0 154,320 Z', c: '#f6cf46' },
        { t: 'path', d: 'M154,320 A46,46 0 0 1 246,320 L246,288 A46,46 0 0 0 154,288 Z', c: '#5bbd6e' },
        { t: 'ellipse', cx: 88, cy: 332, rx: 44, ry: 24, c: '#ffffff' },
        { t: 'ellipse', cx: 124, cy: 322, rx: 34, ry: 28, c: '#ffffff' },
        { t: 'ellipse', cx: 312, cy: 332, rx: 44, ry: 24, c: '#ffffff' },
        { t: 'ellipse', cx: 278, cy: 322, rx: 34, ry: 28, c: '#ffffff' },
        { t: 'circle', cx: 200, cy: 92, r: 34, c: '#f6cf46' },
        { t: 'path', d: 'M200,40 L200,26 M200,158 L200,144 M148,92 L134,92 M266,92 L252,92 M162,54 L152,44 M238,54 L248,44', c: '#f6cf46', w: 4 }
      ]
    },
    {
      name: 'Rocket',
      shapes: [
        { t: 'path', d: 'M200,44 Q252,112 252,232 L148,232 Q148,112 200,44 Z', c: '#dbeaf2' },
        { t: 'circle', cx: 200, cy: 152, r: 32, c: '#3fa9c9' },
        { t: 'circle', cx: 200, cy: 152, r: 18, c: '#ffffff', w: 3 },
        { t: 'path', d: 'M148,182 L96,268 L148,244 Z', c: '#e8484f' },
        { t: 'path', d: 'M252,182 L304,268 L252,244 Z', c: '#e8484f' },
        { t: 'rect', x: 148, y: 232, w2: 104, h: 16, rad: 4, c: '#8a96a1' },
        { t: 'path', d: 'M166,248 L200,336 L234,248 Z', c: '#f2913c' },
        { t: 'path', d: 'M182,252 L200,306 L218,252 Z', c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 128, cy: 100, r: 7, c: '#f6cf46', w: 2 },
        { t: 'circle', cx: 288, cy: 130, r: 5, c: '#f6cf46', w: 2 }
      ]
    },
    {
      name: 'Butterfly',
      shapes: [
        { t: 'path', d: 'M192,196 Q120,80 54,132 Q34,200 192,208 Z', c: '#8b5cc7' },
        { t: 'path', d: 'M208,196 Q280,80 346,132 Q366,200 208,208 Z', c: '#8b5cc7' },
        { t: 'path', d: 'M192,214 Q124,268 84,318 Q154,348 192,224 Z', c: '#e86fa8' },
        { t: 'path', d: 'M208,214 Q276,268 316,318 Q246,348 208,224 Z', c: '#e86fa8' },
        { t: 'circle', cx: 100, cy: 158, r: 16, c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 300, cy: 158, r: 16, c: '#f6cf46', w: 3 },
        { t: 'ellipse', cx: 200, cy: 238, rx: 13, ry: 74, c: '#25313b' },
        { t: 'circle', cx: 200, cy: 156, r: 20, c: '#25313b' },
        { t: 'path', d: 'M190,140 Q176,110 156,106 M210,140 Q224,110 244,106', c: '#25313b', w: 4 }
      ]
    },
    {
      name: 'Christmas Tree',
      shapes: [
        { t: 'path', d: 'M200,58 L262,164 L138,164 Z', c: '#5bbd6e' },
        { t: 'path', d: 'M200,120 L288,244 L112,244 Z', c: '#5bbd6e' },
        { t: 'path', d: 'M200,192 L312,324 L88,324 Z', c: '#5bbd6e' },
        { t: 'rect', x: 180, y: 322, w2: 40, h: 48, rad: 3, c: '#8a5a3b' },
        { t: 'path', d: 'M200,26 L209,46 L231,48 L214,62 L219,84 L200,72 L181,84 L186,62 L169,48 L191,46 Z', c: '#f6cf46' },
        { t: 'circle', cx: 200, cy: 138, r: 10, c: '#e8484f', w: 2 },
        { t: 'circle', cx: 160, cy: 210, r: 10, c: '#f6cf46', w: 2 },
        { t: 'circle', cx: 240, cy: 210, r: 10, c: '#e8484f', w: 2 },
        { t: 'circle', cx: 200, cy: 262, r: 11, c: '#3fa9c9', w: 2 },
        { t: 'circle', cx: 132, cy: 300, r: 9, c: '#e8484f', w: 2 },
        { t: 'circle', cx: 268, cy: 300, r: 9, c: '#f6cf46', w: 2 }
      ]
    },
    {
      name: 'Pumpkin',
      shapes: [
        { t: 'ellipse', cx: 200, cy: 232, rx: 118, ry: 88, c: '#f2913c' },
        { t: 'ellipse', cx: 200, cy: 232, rx: 66, ry: 88, c: '#f2913c', w: 3 },
        { t: 'rect', x: 190, y: 122, w2: 22, h: 42, rad: 5, c: '#5bbd6e' },
        { t: 'path', d: 'M148,206 L186,206 L168,236 Z', c: '#25313b', w: 3 },
        { t: 'path', d: 'M252,206 L214,206 L232,236 Z', c: '#25313b', w: 3 },
        { t: 'path', d: 'M200,238 L184,258 L216,258 Z', c: '#25313b', w: 3 },
        { t: 'path', d: 'M138,278 Q200,326 262,278 Q200,298 138,278 Z', c: '#25313b', w: 3 },
        { t: 'path', d: 'M140,280 L146,268 M158,292 L162,278 M200,300 L200,286 M242,292 L238,278 M260,280 L254,268', c: '#ffffff', w: 2 }
      ]
    },
    {
      name: 'Happy Fish',
      shapes: [
        { t: 'ellipse', cx: 186, cy: 216, rx: 92, ry: 62, c: '#3fa9c9' },
        { t: 'path', d: 'M272,216 L352,152 L352,280 Z', c: '#5bbd6e' },
        { t: 'path', d: 'M170,158 L200,104 L232,158 Z', c: '#3fa9c9' },
        { t: 'path', d: 'M170,276 L200,318 L232,276 Z', c: '#3fa9c9' },
        { t: 'circle', cx: 138, cy: 202, r: 14, c: '#ffffff' },
        { t: 'circle', cx: 136, cy: 202, r: 5, c: '#25313b', w: 2 },
        { t: 'path', d: 'M112,234 Q128,248 146,234', c: '#e86fa8', w: 3 },
        { t: 'path', d: 'M186,156 Q210,176 186,196 Q162,176 186,156 Z', c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 92, cy: 128, r: 10, c: '#ffffff', w: 2 },
        { t: 'circle', cx: 66, cy: 100, r: 6, c: '#ffffff', w: 2 }
      ]
    },
    {
      name: 'Flower',
      shapes: [
        { t: 'ellipse', cx: 200, cy: 104, rx: 34, ry: 52, c: '#e86fa8' },
        { t: 'ellipse', cx: 200, cy: 224, rx: 34, ry: 52, c: '#e86fa8' },
        { t: 'ellipse', cx: 140, cy: 164, rx: 52, ry: 34, c: '#e86fa8' },
        { t: 'ellipse', cx: 260, cy: 164, rx: 52, ry: 34, c: '#e86fa8' },
        { t: 'ellipse', cx: 158, cy: 122, rx: 46, ry: 34, rot: -45, c: '#8b5cc7' },
        { t: 'ellipse', cx: 242, cy: 122, rx: 46, ry: 34, rot: 45, c: '#8b5cc7' },
        { t: 'ellipse', cx: 158, cy: 206, rx: 46, ry: 34, rot: 45, c: '#8b5cc7' },
        { t: 'ellipse', cx: 242, cy: 206, rx: 46, ry: 34, rot: -45, c: '#8b5cc7' },
        { t: 'circle', cx: 200, cy: 164, r: 44, c: '#f6cf46' },
        { t: 'circle', cx: 186, cy: 152, r: 5, c: '#8a5a3b', w: 2 },
        { t: 'circle', cx: 214, cy: 152, r: 5, c: '#8a5a3b', w: 2 },
        { t: 'path', d: 'M200,208 L200,352', c: '#ffffff', w: 10 },
        { t: 'ellipse', cx: 160, cy: 280, rx: 40, ry: 20, rot: -25, c: '#5bbd6e' },
        { t: 'ellipse', cx: 240, cy: 310, rx: 40, ry: 20, rot: 25, c: '#5bbd6e' }
      ]
    },
    {
      name: 'Donut',
      shapes: [
        { t: 'path', d: 'M200,60 A140,140 0 1 1 199,60 Z M200,140 A60,60 0 1 0 199,140 Z', c: '#e9bd7a' },
        { t: 'path', d: 'M200,76 A124,124 0 1 1 199,76 Z M200,132 A68,68 0 1 0 199,132 Z', c: '#e86fa8', w: 3 },
        { t: 'path', d: 'M118,150 L140,144 M172,108 L180,128 M232,116 L226,136 M282,158 L262,152 M246,232 L238,210 M158,236 L166,214 M96,214 L118,204', c: '#f6cf46', w: 6 },
        { t: 'path', d: 'M148,188 L166,196 M200,272 L200,250 M256,190 L240,198 M140,108 L156,118', c: '#3fa9c9', w: 6 },
        { t: 'path', d: 'M210,90 L226,80 M270,206 L254,198 M130,206 L146,198', c: '#5bbd6e', w: 6 }
      ]
    },
    {
      name: 'House',
      shapes: [
        { t: 'rect', x: 110, y: 178, w2: 180, h: 158, c: '#f6cf46' },
        { t: 'path', d: 'M88,182 L200,88 L312,182 Z', c: '#e8484f' },
        { t: 'rect', x: 250, y: 104, w2: 28, h: 52, rad: 2, c: '#8a5a3b' },
        { t: 'rect', x: 180, y: 250, w2: 46, h: 86, rad: 3, c: '#8a5a3b' },
        { t: 'circle', cx: 216, cy: 292, r: 4, c: '#f6cf46', w: 2 },
        { t: 'rect', x: 128, y: 214, w2: 42, h: 42, rad: 3, c: '#3fa9c9' },
        { t: 'rect', x: 230, y: 214, w2: 42, h: 42, rad: 3, c: '#3fa9c9' },
        { t: 'path', d: 'M149,214 L149,256 M128,235 L170,235 M251,214 L251,256 M230,235 L272,235', c: '#ffffff', w: 2 },
        { t: 'circle', cx: 200, cy: 196, r: 10, c: '#ffffff', w: 2 },
        { t: 'path', d: 'M92,340 L308,340', c: '#5bbd6e', w: 8 }
      ]
    },
    /* ---- Vehicles ---- */
    {
      name: 'Train',
      shapes: [
        { t: 'rect', x: 20, y: 330, w2: 360, h: 8, rad: 2, c: '#8a5a3b' },
        { t: 'path', d: 'M50,350 L70,330 M130,350 L150,330 M210,350 L230,330 M290,350 L310,330', c: 'none', w: 4 },
        { t: 'rect', x: 228, y: 132, w2: 30, h: 56, rad: 3, c: '#8a96a1' },
        { t: 'circle', cx: 243, cy: 112, r: 14, c: '#ffffff' },
        { t: 'circle', cx: 258, cy: 84, r: 18, c: '#ffffff' },
        { t: 'circle', cx: 284, cy: 58, r: 22, c: '#ffffff' },
        { t: 'path', d: 'M88,122 L184,122 L184,204 L88,204 Z', c: '#e8484f' },
        { t: 'path', d: 'M82,122 L190,122 L178,106 L96,106 Z', c: '#e8484f' },
        { t: 'rect', x: 104, y: 138, w2: 42, h: 36, rad: 3, c: '#8ed1ec' },
        { t: 'path', d: 'M180,176 L250,176 Q280,176 280,206 L280,264 L180,264 Z', c: '#e8484f' },
        { t: 'path', d: 'M194,204 L268,204 M194,232 L268,232', c: 'none', w: 3 },
        { t: 'circle', cx: 262, cy: 220, r: 12, c: '#f6cf46', w: 3 },
        { t: 'path', d: 'M280,242 L316,242', c: 'none', w: 5 },
        { t: 'rect', x: 316, y: 180, w2: 66, h: 88, rad: 4, c: '#3fa9c9' },
        { t: 'rect', x: 324, y: 194, w2: 22, h: 24, rad: 2, c: '#ffffff' },
        { t: 'rect', x: 352, y: 194, w2: 22, h: 24, rad: 2, c: '#ffffff' },
        { t: 'rect', x: 324, y: 228, w2: 50, h: 22, rad: 2, c: '#ffffff' },
        { t: 'circle', cx: 120, cy: 296, r: 34, c: '#4a4a4a' },
        { t: 'circle', cx: 120, cy: 296, r: 12, c: '#ffffff', w: 3 },
        { t: 'circle', cx: 216, cy: 300, r: 26, c: '#4a4a4a' },
        { t: 'circle', cx: 216, cy: 300, r: 9, c: '#ffffff', w: 3 },
        { t: 'circle', cx: 334, cy: 296, r: 18, c: '#4a4a4a', w: 3 },
        { t: 'circle', cx: 334, cy: 296, r: 6, c: '#ffffff', w: 2 },
        { t: 'circle', cx: 364, cy: 296, r: 18, c: '#4a4a4a', w: 3 },
        { t: 'circle', cx: 364, cy: 296, r: 6, c: '#ffffff', w: 2 }
      ]
    },
    {
      name: 'Ship',
      shapes: [
        { t: 'path', d: 'M48,244 L352,244 L312,316 L88,316 Z', c: '#e8484f' },
        { t: 'path', d: 'M88,316 L312,316 L296,334 L104,334 Z', c: '#8a5a3b' },
        { t: 'rect', x: 96, y: 196, w2: 208, h: 48, rad: 3, c: '#f2ece0' },
        { t: 'rect', x: 120, y: 156, w2: 64, h: 40, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 200, y: 150, w2: 72, h: 46, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 150, y: 104, w2: 22, h: 52, rad: 2, c: '#4a4a4a' },
        { t: 'rect', x: 232, y: 104, w2: 22, h: 52, rad: 2, c: '#4a4a4a' },
        { t: 'circle', cx: 161, cy: 86, r: 14, c: '#ffffff' },
        { t: 'circle', cx: 243, cy: 86, r: 14, c: '#ffffff' },
        { t: 'path', d: 'M256,92 L256,150', c: 'none', w: 4 },
        { t: 'path', d: 'M256,96 L310,110 L256,124 Z', c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 120, cy: 274, r: 14, c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 200, cy: 274, r: 14, c: '#f6cf46', w: 3 },
        { t: 'circle', cx: 280, cy: 274, r: 14, c: '#f6cf46', w: 3 },
        { t: 'path', d: 'M40,350 Q70,334 100,350 T160,350 T220,350 T280,350 T340,350', c: 'none', w: 5 },
        { t: 'path', d: 'M20,372 Q50,356 80,372 T140,372 T200,372 T260,372 T320,372 T380,372', c: 'none', w: 5 }
      ]
    },
    {
      name: 'Car',
      shapes: [
        { t: 'path', d: 'M52,238 L84,176 Q90,164 108,164 L292,164 Q310,164 316,176 L348,238 L348,286 L52,286 Z', c: '#e8484f' },
        { t: 'path', d: 'M108,176 L180,176 L164,224 L88,224 Z', c: '#8ed1ec' },
        { t: 'path', d: 'M196,176 L284,176 L312,224 L200,224 Z', c: '#8ed1ec' },
        { t: 'path', d: 'M52,238 L348,238', c: 'none', w: 3 },
        { t: 'rect', x: 60, y: 248, w2: 24, h: 16, rad: 4, c: '#f6cf46' },
        { t: 'rect', x: 316, y: 248, w2: 24, h: 16, rad: 4, c: '#f6cf46' },
        { t: 'circle', cx: 122, cy: 286, r: 32, c: '#4a4a4a' },
        { t: 'circle', cx: 122, cy: 286, r: 12, c: '#ffffff', w: 3 },
        { t: 'circle', cx: 278, cy: 286, r: 32, c: '#4a4a4a' },
        { t: 'circle', cx: 278, cy: 286, r: 12, c: '#ffffff', w: 3 },
        { t: 'path', d: 'M40,320 L360,320', c: 'none', w: 6 }
      ]
    },
    {
      name: 'Bus',
      shapes: [
        { t: 'path', d: 'M46,132 Q46,116 62,116 L338,116 Q354,116 354,132 L354,282 L46,282 Z', c: '#f6cf46' },
        { t: 'rect', x: 62, y: 136, w2: 52, h: 40, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 128, y: 136, w2: 52, h: 40, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 194, y: 136, w2: 52, h: 40, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 260, y: 136, w2: 30, h: 40, rad: 3, c: '#8ed1ec' },
        { t: 'rect', x: 300, y: 184, w2: 40, h: 76, rad: 3, c: '#ffffff' },
        { t: 'path', d: 'M320,184 L320,260', c: 'none', w: 3 },
        { t: 'rect', x: 62, y: 232, w2: 50, h: 18, rad: 3, c: '#e8484f' },
        { t: 'rect', x: 46, y: 262, w2: 16, h: 12, rad: 3, c: '#f2913c' },
        { t: 'circle', cx: 112, cy: 282, r: 30, c: '#4a4a4a' },
        { t: 'circle', cx: 112, cy: 282, r: 10, c: '#ffffff', w: 3 },
        { t: 'circle', cx: 288, cy: 282, r: 30, c: '#4a4a4a' },
        { t: 'circle', cx: 288, cy: 282, r: 10, c: '#ffffff', w: 3 },
        { t: 'path', d: 'M30,314 L370,314', c: 'none', w: 6 }
      ]
    },
    {
      name: 'Airplane',
      shapes: [
        { t: 'path', d: 'M200,40 Q214,40 216,72 L222,150 L200,168 L178,150 L184,72 Q186,40 200,40 Z', c: '#dbeaf2' },
        { t: 'path', d: 'M178,140 L46,206 L46,232 L178,200 Z', c: '#3fa9c9' },
        { t: 'path', d: 'M222,140 L354,206 L354,232 L222,200 Z', c: '#3fa9c9' },
        { t: 'path', d: 'M186,250 L160,324 L188,316 L200,270 L212,316 L240,324 L214,250 Z', c: '#3fa9c9' },
        { t: 'circle', cx: 200, cy: 92, r: 10, c: '#8ed1ec', w: 3 },
        { t: 'circle', cx: 200, cy: 124, r: 10, c: '#8ed1ec', w: 3 },
        { t: 'path', d: 'M200,168 L200,250', c: 'none', w: 3 },
        { t: 'path', d: 'M60,90 Q76,74 92,90 M104,72 Q120,56 136,72 M268,88 Q284,72 300,88', c: 'none', w: 4 }
      ]
    },
    {
      name: 'Bicycle',
      shapes: [
        { t: 'circle', cx: 104, cy: 264, r: 56, c: 'none', w: 5 },
        { t: 'circle', cx: 104, cy: 264, r: 8, c: '#4a4a4a', w: 2 },
        { t: 'circle', cx: 296, cy: 264, r: 56, c: 'none', w: 5 },
        { t: 'circle', cx: 296, cy: 264, r: 8, c: '#4a4a4a', w: 2 },
        { t: 'path', d: 'M104,264 L176,180 L226,264 L104,264 Z', c: 'none', w: 5 },
        { t: 'path', d: 'M226,264 L262,180 L176,180', c: 'none', w: 5 },
        { t: 'path', d: 'M262,180 L286,168', c: 'none', w: 5 },
        { t: 'path', d: 'M168,176 L186,176', c: 'none', w: 7 },
        { t: 'circle', cx: 226, cy: 264, r: 12, c: '#f6cf46', w: 3 },
        { t: 'path', d: 'M32,336 L368,336', c: 'none', w: 6 }
      ]
    },
    {
      name: 'Truck',
      shapes: [
        { t: 'rect', x: 40, y: 168, w2: 210, h: 118, rad: 3, c: '#3fa9c9' },
        { t: 'path', d: 'M250,208 L316,208 L350,244 L350,286 L250,286 Z', c: '#e8484f' },
        { t: 'rect', x: 266, y: 218, w2: 44, h: 32, rad: 3, c: '#8ed1ec' },
        { t: 'path', d: 'M76,200 L214,200 M76,230 L214,230', c: 'none', w: 3 },
        { t: 'rect', x: 338, y: 252, w2: 12, h: 14, rad: 3, c: '#f6cf46' },
        { t: 'circle', cx: 106, cy: 290, r: 28, c: '#4a4a4a' },
        { t: 'circle', cx: 106, cy: 290, r: 9, c: '#ffffff', w: 2 },
        { t: 'circle', cx: 306, cy: 290, r: 28, c: '#4a4a4a' },
        { t: 'circle', cx: 306, cy: 290, r: 9, c: '#ffffff', w: 2 },
        { t: 'path', d: 'M24,322 L376,322', c: 'none', w: 6 }
      ]
    },
    {
      name: 'Helicopter',
      shapes: [
        { t: 'ellipse', cx: 200, cy: 210, rx: 96, ry: 58, c: '#e8484f' },
        { t: 'path', d: 'M278,196 L344,196 L364,212 L344,228 L278,228 Z', c: '#e8484f' },
        { t: 'path', d: 'M348,178 L372,160 L372,244 L348,226 Z', c: '#3fa9c9' },
        { t: 'path', d: 'M104,108 L296,108', c: 'none', w: 8 },
        { t: 'path', d: 'M200,108 L200,154', c: 'none', w: 6 },
        { t: 'rect', x: 140, y: 186, w2: 50, h: 36, rad: 8, c: '#8ed1ec' },
        { t: 'rect', x: 206, y: 186, w2: 50, h: 36, rad: 8, c: '#8ed1ec' },
        { t: 'circle', cx: 330, cy: 210, r: 16, c: '#3fa9c9', w: 3 },
        { t: 'path', d: 'M160,268 L160,300 M240,268 L240,300 M132,300 L268,300', c: 'none', w: 5 }
      ]
    },
    /* ---- Playground ---- */
    {
      name: 'Playground',
      shapes: [
        { t: 'rect', x: 16, y: 330, w2: 368, h: 16, rad: 4, c: '#5bbd6e' },
        { t: 'circle', cx: 60, cy: 66, r: 26, c: '#f6cf46', w: 3 },
        { t: 'path', d: 'M60,26 L60,14 M60,118 L60,106 M20,66 L8,66 M112,66 L100,66 M32,38 L24,30 M88,38 L96,30 M32,94 L24,102 M88,94 L96,102', c: 'none', w: 3 },
        { t: 'path', d: 'M236,96 Q252,80 268,96 Q284,80 300,96', c: 'none', w: 4 },
        { t: 'rect', x: 44, y: 206, w2: 70, h: 8, rad: 3, c: '#c68a4a' },
        { t: 'path', d: 'M46,214 L46,330 M112,214 L112,330 M46,252 L112,252 M46,290 L112,290', c: 'none', w: 5 },
        { t: 'rect', x: 38, y: 184, w2: 12, h: 22, rad: 3, c: '#c68a4a' },
        { t: 'rect', x: 108, y: 184, w2: 12, h: 22, rad: 3, c: '#c68a4a' },
        { t: 'path', d: 'M114,212 Q160,216 196,330 L166,330 Q140,246 114,234 Z', c: '#e8484f' },
        { t: 'path', d: 'M240,132 L210,330 M330,132 L360,330 M240,132 L330,132', c: 'none', w: 6 },
        { t: 'path', d: 'M266,132 L266,238 M304,132 L304,238', c: 'none', w: 3 },
        { t: 'rect', x: 256, y: 238, w2: 58, h: 10, rad: 3, c: '#f2913c' },
        { t: 'path', d: 'M148,330 Q176,306 204,330 Z', c: '#e9bd7a', w: 3 }
      ]
    },
    {
      name: 'Ferris wheel',
      shapes: [
        { t: 'circle', cx: 200, cy: 186, r: 112, c: 'none', w: 6 },
        { t: 'path', d: 'M200,74 L200,298 M88,186 L312,186 M121,107 L279,265 M279,107 L121,265', c: 'none', w: 3 },
        { t: 'circle', cx: 200, cy: 186, r: 18, c: '#f6cf46', w: 4 },
        { t: 'path', d: 'M200,186 L128,338 M200,186 L272,338 M108,338 L292,338', c: 'none', w: 7 },
        { t: 'path', d: 'M190,58 L210,58 L214,78 L186,78 Z', c: '#e8484f', w: 3 },
        { t: 'path', d: 'M278,96 L298,100 L296,120 L274,116 Z', c: '#f2913c', w: 3 },
        { t: 'rect', x: 312, y: 176, w2: 20, h: 20, rad: 3, c: '#3fa9c9', w: 3 },
        { t: 'path', d: 'M278,252 L298,248 L296,268 L274,272 Z', c: '#8b5cc7', w: 3 },
        { t: 'path', d: 'M190,294 L210,294 L214,314 L186,314 Z', c: '#5bbd6e', w: 3 },
        { t: 'path', d: 'M102,252 L122,248 L126,268 L104,272 Z', c: '#e86fa8', w: 3 },
        { t: 'rect', x: 68, y: 176, w2: 20, h: 20, rad: 3, c: '#f6cf46', w: 3 },
        { t: 'path', d: 'M102,96 L122,100 L126,120 L104,116 Z', c: '#3fa9c9', w: 3 }
      ]
    }
  ];

  window.COLORING_TEMPLATES = T;
})();
