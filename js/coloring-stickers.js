/* =====================================================================
 * STWADD — Colouring Studio stickers
 * Small SVG line-art stickers kids can tap onto the canvas, recolour,
 * move and resize. All shapes are closed paths so every region can be
 * filled with a colour by tapping it. Coordinate box: 0 0 100 100.
 * Fields per shape: t (path|circle|ellipse|rect), geometry, c (default
 * fill), w (stroke width).
 * ===================================================================== */
(function () {
  'use strict';

  var S = [
    { name: 'Sun', icon: '☀️', shapes: [
      { t: 'circle', cx: 50, cy: 50, r: 24, c: '#f6cf46' },
      { t: 'path', d: 'M46,8 L54,8 L56,22 L44,22 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M46,78 L54,78 L56,92 L44,92 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M8,46 L8,54 L22,56 L22,44 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M78,46 L78,54 L92,56 L92,44 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M19,16 L25,11 L35,21 L29,27 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M65,73 L71,67 L81,77 L75,83 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M75,16 L81,22 L71,32 L65,26 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M29,68 L35,74 L25,84 L19,78 Z', c: '#f6cf46', w: 2 },
      { t: 'circle', cx: 42, cy: 46, r: 3, c: '#25313b', w: 1 },
      { t: 'circle', cx: 58, cy: 46, r: 3, c: '#25313b', w: 1 },
      { t: 'path', d: 'M42,58 Q50,66 58,58 Q50,62 42,58 Z', c: '#e8484f', w: 1 }
    ] },
    { name: 'Moon', icon: '🌙', shapes: [
      { t: 'path', d: 'M62,10 A40,40 0 1 0 88,76 A32,32 0 1 1 62,10 Z', c: '#f6cf46' },
      { t: 'path', d: 'M22,20 L25,27 L32,30 L25,33 L22,40 L19,33 L12,30 L19,27 Z', c: '#f6cf46', w: 1 },
      { t: 'path', d: 'M78,16 L80,21 L85,23 L80,25 L78,30 L76,25 L71,23 L76,21 Z', c: '#f6cf46', w: 1 }
    ] },
    { name: 'Star', icon: '⭐', shapes: [
      { t: 'path', d: 'M50,8 L62,38 L94,38 L68,57 L78,88 L50,69 L22,88 L32,57 L6,38 L38,38 Z', c: '#f6cf46' },
      { t: 'circle', cx: 42, cy: 44, r: 3, c: '#25313b', w: 1 },
      { t: 'circle', cx: 58, cy: 44, r: 3, c: '#25313b', w: 1 },
      { t: 'path', d: 'M42,54 Q50,62 58,54 Q50,58 42,54 Z', c: '#e86fa8', w: 1 }
    ] },
    { name: 'Heart', icon: '❤️', shapes: [
      { t: 'path', d: 'M50,88 C8,60 14,22 36,22 C45,22 50,30 50,36 C50,30 55,22 64,22 C86,22 92,60 50,88 Z', c: '#e8484f' },
      { t: 'path', d: 'M28,34 Q34,26 42,32', c: '#ffffff', w: 3 }
    ] },
    { name: 'Lightning', icon: '⚡', shapes: [
      { t: 'path', d: 'M58,6 L22,56 L46,56 L34,94 L80,40 L54,40 Z', c: '#f6cf46' }
    ] },
    { name: 'Cat face', icon: '🐱', shapes: [
      { t: 'path', d: 'M12,46 L16,8 L44,32 Z', c: '#f2913c' },
      { t: 'path', d: 'M88,46 L84,8 L56,32 Z', c: '#f2913c' },
      { t: 'circle', cx: 50, cy: 56, r: 36, c: '#f6cf46' },
      { t: 'ellipse', cx: 37, cy: 50, rx: 8, ry: 10, c: '#ffffff' },
      { t: 'ellipse', cx: 63, cy: 50, rx: 8, ry: 10, c: '#ffffff' },
      { t: 'circle', cx: 37, cy: 51, r: 3, c: '#25313b', w: 1 },
      { t: 'circle', cx: 63, cy: 51, r: 3, c: '#25313b', w: 1 },
      { t: 'path', d: 'M45,62 L55,62 L50,68 Z', c: '#e86fa8', w: 1 },
      { t: 'path', d: 'M50,68 Q42,76 34,70 M50,68 Q58,76 66,70', c: '#ffffff', w: 1 }
    ] },
    { name: 'Mountains', icon: '⛰️', shapes: [
      { t: 'path', d: 'M4,84 L38,26 L70,84 Z', c: '#8b96a1' },
      { t: 'path', d: 'M38,26 L50,44 L38,40 L26,44 Z', c: '#ffffff', w: 1 },
      { t: 'path', d: 'M52,84 L78,40 L98,84 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M78,40 L86,52 L78,50 L70,52 Z', c: '#ffffff', w: 1 },
      { t: 'rect', x: 4, y: 84, w2: 94, h: 6, rad: 2, c: '#5bbd6e' }
    ] },
    { name: 'River', icon: '🌊', shapes: [
      { t: 'path', d: 'M6,34 Q20,24 34,34 T62,34 T90,34 L90,42 Q76,32 62,42 T34,42 T6,42 Z', c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M6,54 Q20,44 34,54 T62,54 T90,54 L90,62 Q76,52 62,62 T34,62 T6,62 Z', c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M6,74 Q20,64 34,74 T62,74 T90,74 L90,82 Q76,72 62,82 T34,82 T6,82 Z', c: '#3fa9c9', w: 2 }
    ] },
    { name: 'House', icon: '🏠', shapes: [
      { t: 'rect', x: 20, y: 46, w2: 60, h: 44, c: '#f6cf46' },
      { t: 'path', d: 'M12,48 L50,16 L88,48 Z', c: '#e8484f' },
      { t: 'rect', x: 43, y: 62, w2: 16, h: 28, rad: 2, c: '#8a5a3b' },
      { t: 'rect', x: 26, y: 56, w2: 12, h: 12, rad: 1, c: '#3fa9c9' },
      { t: 'rect', x: 62, y: 56, w2: 12, h: 12, rad: 1, c: '#3fa9c9' }
    ] },
    { name: 'Ice cream', icon: '🍦', shapes: [
      { t: 'path', d: 'M34,50 L66,50 L50,94 Z', c: '#e9bd7a' },
      { t: 'path', d: 'M36,62 L64,62 M40,74 L60,74', c: '#ffffff', w: 2 },
      { t: 'circle', cx: 38, cy: 44, r: 15, c: '#e86fa8' },
      { t: 'circle', cx: 62, cy: 44, r: 15, c: '#8b5cc7' },
      { t: 'circle', cx: 50, cy: 30, r: 17, c: '#f6cf46' },
      { t: 'circle', cx: 50, cy: 12, r: 6, c: '#e8484f', w: 2 }
    ] },
    { name: 'Cloud', icon: '☁️', shapes: [
      { t: 'path', d: 'M24,72 C8,72 8,50 26,48 C30,28 58,26 64,46 C82,42 88,72 68,72 Z', c: '#ffffff' }
    ] },
    { name: 'Rainbow', icon: '🌈', shapes: [
      { t: 'path', d: 'M10,76 A40,40 0 0 1 90,76 L78,76 A28,28 0 0 0 22,76 Z', c: '#e8484f' },
      { t: 'path', d: 'M22,76 A28,28 0 0 1 78,76 L66,76 A16,16 0 0 0 34,76 Z', c: '#f2913c' },
      { t: 'path', d: 'M34,76 A16,16 0 0 1 66,76 L58,76 A8,8 0 0 0 42,76 Z', c: '#f6cf46' }
    ] },
    { name: 'Balloon', icon: '🎈', shapes: [
      { t: 'ellipse', cx: 50, cy: 36, rx: 23, ry: 29, c: '#e8484f' },
      { t: 'path', d: 'M46,63 L54,63 L50,70 Z', c: '#e8484f', w: 1 },
      { t: 'path', d: 'M50,70 Q42,84 50,96', c: '#25313b', w: 2 },
      { t: 'ellipse', cx: 42, cy: 26, rx: 5, ry: 8, rot: -20, c: '#ffffff' }
    ] },
    { name: 'Gift', icon: '🎁', shapes: [
      { t: 'rect', x: 18, y: 44, w2: 64, h: 42, rad: 3, c: '#e8484f' },
      { t: 'rect', x: 44, y: 44, w2: 12, h: 42, c: '#f6cf46' },
      { t: 'rect', x: 18, y: 60, w2: 64, h: 10, c: '#f6cf46' },
      { t: 'path', d: 'M50,44 C34,44 28,30 38,26 C46,24 50,34 50,44 Z', c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M50,44 C66,44 72,30 62,26 C54,24 50,34 50,44 Z', c: '#f6cf46', w: 2 }
    ] },
    { name: 'Flower', icon: '🌸', shapes: [
      { t: 'ellipse', cx: 50, cy: 22, rx: 13, ry: 18, c: '#e86fa8' },
      { t: 'ellipse', cx: 50, cy: 62, rx: 13, ry: 18, c: '#e86fa8' },
      { t: 'ellipse', cx: 30, cy: 42, rx: 18, ry: 13, c: '#e86fa8' },
      { t: 'ellipse', cx: 70, cy: 42, rx: 18, ry: 13, c: '#e86fa8' },
      { t: 'circle', cx: 50, cy: 42, r: 13, c: '#f6cf46' }
    ] },
    { name: 'Fish', icon: '🐟', shapes: [
      { t: 'ellipse', cx: 44, cy: 52, rx: 30, ry: 20, c: '#3fa9c9' },
      { t: 'path', d: 'M70,52 L96,34 L96,70 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M32,36 L44,20 L56,36 Z', c: '#3fa9c9' },
      { t: 'circle', cx: 28, cy: 48, r: 5, c: '#ffffff' },
      { t: 'circle', cx: 27, cy: 48, r: 2, c: '#25313b', w: 1 }
    ] },
    { name: 'Tree', icon: '🌳', shapes: [
      { t: 'rect', x: 44, y: 60, w2: 12, h: 30, rad: 2, c: '#8a5a3b' },
      { t: 'circle', cx: 50, cy: 40, r: 26, c: '#5bbd6e' },
      { t: 'circle', cx: 32, cy: 52, r: 18, c: '#5bbd6e' },
      { t: 'circle', cx: 68, cy: 52, r: 18, c: '#5bbd6e' }
    ] },
    { name: 'Xmas tree', icon: '🎄', shapes: [
      { t: 'path', d: 'M50,8 L70,40 L30,40 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M50,28 L80,66 L20,66 Z', c: '#5bbd6e' },
      { t: 'rect', x: 44, y: 64, w2: 12, h: 24, rad: 2, c: '#8a5a3b' },
      { t: 'path', d: 'M50,4 L54,10 L61,11 L56,16 L57,23 L50,20 L43,23 L44,16 L39,11 L46,10 Z', c: '#f6cf46', w: 1 },
      { t: 'circle', cx: 50, cy: 38, r: 4, c: '#e8484f', w: 1 },
      { t: 'circle', cx: 38, cy: 58, r: 4, c: '#f6cf46', w: 1 },
      { t: 'circle', cx: 62, cy: 58, r: 4, c: '#e8484f', w: 1 }
    ] }
  ];

  window.COLORING_STICKERS = S;
})();
