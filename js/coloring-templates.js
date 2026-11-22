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
    }
  ];

  window.COLORING_TEMPLATES = T;
})();
