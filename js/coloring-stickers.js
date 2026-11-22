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
    ] },

    /* ---- Fruit ---- */
    { name: 'Apple', icon: '🍎', shapes: [
      { t: 'path', d: 'M50,30 C30,18 10,34 18,58 C24,80 40,90 50,84 C60,90 76,80 82,58 C90,34 70,18 50,30 Z', c: '#e8484f' },
      { t: 'rect', x: 48, y: 12, w2: 4, h: 20, rad: 2, c: '#8a5a3b' },
      { t: 'path', d: 'M50,28 Q56,12 74,14 Q70,30 50,28 Z', c: '#5bbd6e', w: 2 }
    ] },
    { name: 'Banana', icon: '🍌', shapes: [
      { t: 'path', d: 'M18,20 C14,54 40,88 82,84 C62,78 40,58 40,26 C32,18 24,16 18,20 Z', c: '#f6cf46' },
      { t: 'path', d: 'M78,80 L88,86 L82,72 Z', c: '#8a5a3b', w: 1 }
    ] },
    { name: 'Orange', icon: '🍊', shapes: [
      { t: 'circle', cx: 50, cy: 56, r: 32, c: '#f2913c' },
      { t: 'rect', x: 48, y: 10, w2: 4, h: 16, rad: 2, c: '#8a5a3b' },
      { t: 'path', d: 'M50,26 Q58,12 74,16 Q68,30 50,26 Z', c: '#5bbd6e', w: 2 }
    ] },
    { name: 'Strawberry', icon: '🍓', shapes: [
      { t: 'path', d: 'M50,38 C32,38 20,50 26,66 C32,84 44,92 50,94 C56,92 68,84 74,66 C80,50 68,38 50,38 Z', c: '#e8484f' },
      { t: 'path', d: 'M24,46 L34,32 L42,42 L50,28 L58,42 L66,32 L76,46 Q50,36 24,46 Z', c: '#5bbd6e', w: 2 },
      { t: 'ellipse', cx: 40, cy: 62, rx: 2.5, ry: 4, c: '#f6cf46', w: 1 },
      { t: 'ellipse', cx: 56, cy: 62, rx: 2.5, ry: 4, c: '#f6cf46', w: 1 },
      { t: 'ellipse', cx: 48, cy: 76, rx: 2.5, ry: 4, c: '#f6cf46', w: 1 }
    ] },
    { name: 'Grapes', icon: '🍇', shapes: [
      { t: 'rect', x: 48, y: 8, w2: 4, h: 18, rad: 2, c: '#8a5a3b' },
      { t: 'path', d: 'M50,20 Q62,8 78,14 Q70,28 50,20 Z', c: '#5bbd6e', w: 2 },
      { t: 'circle', cx: 50, cy: 36, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 36, cy: 48, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 64, cy: 48, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 50, cy: 56, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 28, cy: 64, r: 9, c: '#8b5cc7' },
      { t: 'circle', cx: 72, cy: 64, r: 9, c: '#8b5cc7' },
      { t: 'circle', cx: 42, cy: 72, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 58, cy: 72, r: 10, c: '#8b5cc7' },
      { t: 'circle', cx: 50, cy: 86, r: 8, c: '#8b5cc7' }
    ] },
    { name: 'Watermelon', icon: '🍉', shapes: [
      { t: 'path', d: 'M8,64 A42,42 0 0 1 92,64 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M16,64 A34,34 0 0 1 84,64 Z', c: '#f6cf46' },
      { t: 'path', d: 'M22,64 A28,28 0 0 1 78,64 Z', c: '#e8484f' },
      { t: 'ellipse', cx: 40, cy: 50, rx: 2.5, ry: 4, rot: 20, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 60, cy: 50, rx: 2.5, ry: 4, rot: -20, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 50, cy: 60, rx: 2.5, ry: 4, c: '#25313b', w: 1 }
    ] },
    { name: 'Pear', icon: '🍐', shapes: [
      { t: 'path', d: 'M50,24 C42,24 40,40 32,52 C18,72 24,90 50,90 C76,90 82,72 68,52 C60,40 58,24 50,24 Z', c: '#a8c94a' },
      { t: 'rect', x: 48, y: 10, w2: 4, h: 16, rad: 2, c: '#8a5a3b' },
      { t: 'path', d: 'M50,20 Q58,8 72,12 Q66,24 50,20 Z', c: '#5bbd6e', w: 2 }
    ] },
    { name: 'Pineapple', icon: '🍍', shapes: [
      { t: 'ellipse', cx: 50, cy: 60, rx: 24, ry: 30, c: '#f6cf46' },
      { t: 'path', d: 'M50,32 L36,8 L48,26 Z', c: '#5bbd6e', w: 1 },
      { t: 'path', d: 'M50,32 L50,4 L56,26 Z', c: '#5bbd6e', w: 1 },
      { t: 'path', d: 'M50,32 L64,8 L54,26 Z', c: '#5bbd6e', w: 1 },
      { t: 'path', d: 'M34,50 L66,50 M30,64 L70,64 M32,78 L68,78', c: '#e9bd7a', w: 2 }
    ] },
    { name: 'Cherry', icon: '🍒', shapes: [
      { t: 'path', d: 'M34,64 Q38,34 50,22 Q62,34 66,64', c: '#5bbd6e', w: 3 },
      { t: 'circle', cx: 34, cy: 72, r: 15, c: '#e8484f' },
      { t: 'circle', cx: 66, cy: 72, r: 15, c: '#e8484f' },
      { t: 'path', d: 'M50,22 Q60,10 74,16 Q68,28 50,22 Z', c: '#5bbd6e', w: 2 }
    ] },
    { name: 'Lemon', icon: '🍋', shapes: [
      { t: 'ellipse', cx: 50, cy: 56, rx: 34, ry: 24, rot: -12, c: '#f6cf46' },
      { t: 'path', d: 'M18,48 L8,44 L18,60 Z', c: '#f6cf46', w: 1 },
      { t: 'path', d: 'M82,64 L92,68 L82,52 Z', c: '#f6cf46', w: 1 }
    ] },
    { name: 'Peach', icon: '🍑', shapes: [
      { t: 'circle', cx: 50, cy: 56, r: 32, c: '#f2919c' },
      { t: 'path', d: 'M50,24 Q42,56 50,88', c: '#e8484f', w: 2 },
      { t: 'path', d: 'M50,28 Q60,14 76,18 Q70,32 50,28 Z', c: '#5bbd6e', w: 2 }
    ] },
    { name: 'Kiwi', icon: '🥝', shapes: [
      { t: 'circle', cx: 50, cy: 54, r: 34, c: '#8a5a3b' },
      { t: 'circle', cx: 50, cy: 54, r: 28, c: '#8fbf4a' },
      { t: 'circle', cx: 50, cy: 54, r: 10, c: '#f2f5e6' },
      { t: 'ellipse', cx: 50, cy: 34, rx: 2.5, ry: 4, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 64, cy: 40, rx: 2.5, ry: 4, rot: 45, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 70, cy: 54, rx: 4, ry: 2.5, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 64, cy: 68, rx: 2.5, ry: 4, rot: -45, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 50, cy: 74, rx: 2.5, ry: 4, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 36, cy: 68, rx: 2.5, ry: 4, rot: 45, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 30, cy: 54, rx: 4, ry: 2.5, c: '#25313b', w: 1 },
      { t: 'ellipse', cx: 36, cy: 40, rx: 2.5, ry: 4, rot: -45, c: '#25313b', w: 1 }
    ] },

    /* ---- Home & furniture ---- */
    { name: 'Table', icon: '🪑', shapes: [
      { t: 'rect', x: 8, y: 34, w2: 84, h: 10, rad: 3, c: '#c68a4a' },
      { t: 'rect', x: 14, y: 44, w2: 8, h: 44, rad: 2, c: '#8a5a3b' },
      { t: 'rect', x: 78, y: 44, w2: 8, h: 44, rad: 2, c: '#8a5a3b' }
    ] },
    { name: 'Chair', icon: '🪑', shapes: [
      { t: 'rect', x: 30, y: 10, w2: 40, h: 38, rad: 4, c: '#c68a4a' },
      { t: 'rect', x: 24, y: 46, w2: 52, h: 9, rad: 3, c: '#a9713a' },
      { t: 'rect', x: 28, y: 55, w2: 7, h: 35, rad: 2, c: '#8a5a3b' },
      { t: 'rect', x: 65, y: 55, w2: 7, h: 35, rad: 2, c: '#8a5a3b' }
    ] },
    { name: 'Sofa', icon: '🛋️', shapes: [
      { t: 'rect', x: 8, y: 32, w2: 84, h: 30, rad: 8, c: '#3f8fc9' },
      { t: 'rect', x: 4, y: 48, w2: 16, h: 30, rad: 6, c: '#2f72a8' },
      { t: 'rect', x: 80, y: 48, w2: 16, h: 30, rad: 6, c: '#2f72a8' },
      { t: 'rect', x: 20, y: 52, w2: 60, h: 24, rad: 4, c: '#6cb4e0' },
      { t: 'rect', x: 22, y: 34, w2: 27, h: 18, rad: 4, c: '#6cb4e0' },
      { t: 'rect', x: 51, y: 34, w2: 27, h: 18, rad: 4, c: '#6cb4e0' },
      { t: 'rect', x: 12, y: 76, w2: 7, h: 10, rad: 2, c: '#8a5a3b' },
      { t: 'rect', x: 81, y: 76, w2: 7, h: 10, rad: 2, c: '#8a5a3b' }
    ] },
    { name: 'TV', icon: '📺', shapes: [
      { t: 'rect', x: 6, y: 20, w2: 88, h: 54, rad: 5, c: '#2b3944' },
      { t: 'rect', x: 12, y: 26, w2: 76, h: 42, rad: 2, c: '#57b6d8' },
      { t: 'rect', x: 45, y: 74, w2: 10, h: 10, c: '#8b96a1' },
      { t: 'rect', x: 30, y: 84, w2: 40, h: 6, rad: 3, c: '#8b96a1' }
    ] },
    { name: 'Bed', icon: '🛏️', shapes: [
      { t: 'rect', x: 6, y: 26, w2: 10, h: 56, rad: 3, c: '#8a5a3b' },
      { t: 'rect', x: 16, y: 52, w2: 78, h: 26, rad: 3, c: '#f2ece0' },
      { t: 'path', d: 'M16,62 Q46,54 94,62 L94,78 L16,78 Z', c: '#4a90c2' },
      { t: 'ellipse', cx: 34, cy: 48, rx: 14, ry: 8, c: '#ffffff' },
      { t: 'rect', x: 20, y: 78, w2: 7, h: 10, c: '#8a5a3b' },
      { t: 'rect', x: 84, y: 78, w2: 7, h: 10, c: '#8a5a3b' }
    ] },
    { name: 'Lamp', icon: '💡', shapes: [
      { t: 'path', d: 'M30,44 L70,44 L80,70 L20,70 Z', c: '#f6cf46' },
      { t: 'rect', x: 47, y: 70, w2: 6, h: 18, c: '#8b96a1' },
      { t: 'ellipse', cx: 50, cy: 90, rx: 20, ry: 5, c: '#8b96a1' }
    ] },
    { name: 'Bookshelf', icon: '📚', shapes: [
      { t: 'rect', x: 16, y: 10, w2: 68, h: 80, rad: 2, c: '#c68a4a' },
      { t: 'rect', x: 22, y: 16, w2: 56, h: 20, c: '#f2ece0' },
      { t: 'rect', x: 22, y: 40, w2: 56, h: 20, c: '#f2ece0' },
      { t: 'rect', x: 22, y: 64, w2: 56, h: 20, c: '#f2ece0' },
      { t: 'rect', x: 24, y: 20, w2: 7, h: 16, c: '#e8484f' },
      { t: 'rect', x: 32, y: 24, w2: 7, h: 12, c: '#3fa9c9' },
      { t: 'rect', x: 40, y: 18, w2: 7, h: 18, c: '#5bbd6e' },
      { t: 'rect', x: 24, y: 44, w2: 7, h: 16, c: '#f6cf46' },
      { t: 'rect', x: 32, y: 48, w2: 7, h: 12, c: '#8b5cc7' },
      { t: 'rect', x: 24, y: 68, w2: 7, h: 16, c: '#3fa9c9' },
      { t: 'rect', x: 32, y: 72, w2: 7, h: 12, c: '#e8484f' }
    ] },
    { name: 'Rug', icon: '🟣', shapes: [
      { t: 'ellipse', cx: 50, cy: 56, rx: 44, ry: 28, c: '#e8484f' },
      { t: 'ellipse', cx: 50, cy: 56, rx: 34, ry: 20, c: '#f6cf46', w: 2 },
      { t: 'ellipse', cx: 50, cy: 56, rx: 20, ry: 11, c: '#8b5cc7', w: 2 }
    ] },
    { name: 'Window', icon: '🪟', shapes: [
      { t: 'rect', x: 14, y: 8, w2: 72, h: 76, rad: 2, c: '#c68a4a' },
      { t: 'rect', x: 20, y: 14, w2: 60, h: 64, c: '#8ed1ec' },
      { t: 'rect', x: 47, y: 14, w2: 6, h: 64, c: '#c68a4a' },
      { t: 'rect', x: 20, y: 44, w2: 60, h: 6, c: '#c68a4a' },
      { t: 'path', d: 'M24,32 Q34,22 44,32', c: '#ffffff', w: 2 }
    ] },
    { name: 'Door', icon: '🚪', shapes: [
      { t: 'rect', x: 22, y: 6, w2: 56, h: 88, rad: 2, c: '#8a5a3b' },
      { t: 'rect', x: 28, y: 12, w2: 44, h: 76, rad: 1, c: '#c68a4a' },
      { t: 'rect', x: 34, y: 20, w2: 32, h: 26, rad: 2, c: '#8ed1ec' },
      { t: 'circle', cx: 64, cy: 60, r: 4, c: '#f6cf46', w: 2 }
    ] },
    { name: 'Clock', icon: '🕐', shapes: [
      { t: 'circle', cx: 50, cy: 50, r: 36, c: '#c68a4a' },
      { t: 'circle', cx: 50, cy: 50, r: 30, c: '#f7f4ec' },
      { t: 'path', d: 'M50,50 L50,30 M50,50 L64,58', c: '#2b3944', w: 3 }
    ] },
    { name: 'Plant', icon: '🪴', shapes: [
      { t: 'path', d: 'M32,64 L68,64 L62,90 L38,90 Z', c: '#d98a5a' },
      { t: 'path', d: 'M50,64 C46,44 30,38 26,24 C42,28 50,42 50,64 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M50,64 C54,44 70,38 74,24 C58,28 50,42 50,64 Z', c: '#5bbd6e' },
      { t: 'path', d: 'M50,64 C50,40 46,26 50,12 C56,26 52,40 50,64 Z', c: '#4aab5c' }
    ] },

    /* ---- People & pets ---- */
    { name: 'Boy', icon: '👦', shapes: [
      { t: 'circle', cx: 50, cy: 26, r: 15, c: '#f0c49a' },
      { t: 'path', d: 'M35,24 Q36,8 50,8 Q64,8 65,24 Q58,16 50,18 Q42,16 35,24 Z', c: '#6b4a2f', w: 1 },
      { t: 'path', d: 'M36,44 Q50,38 64,44 L68,72 L32,72 Z', c: '#3f8fc9' },
      { t: 'rect', x: 36, y: 72, w2: 10, h: 22, rad: 3, c: '#2b3944' },
      { t: 'rect', x: 54, y: 72, w2: 10, h: 22, rad: 3, c: '#2b3944' },
      { t: 'circle', cx: 44, cy: 27, r: 2, c: '#25313b', w: 1 },
      { t: 'circle', cx: 56, cy: 27, r: 2, c: '#25313b', w: 1 }
    ] },
    { name: 'Girl', icon: '👧', shapes: [
      { t: 'path', d: 'M32,42 Q30,8 50,8 Q70,8 68,42 L64,46 L36,46 Z', c: '#8a5a3b', w: 1 },
      { t: 'circle', cx: 50, cy: 28, r: 15, c: '#f0c49a' },
      { t: 'path', d: 'M50,46 L26,84 L74,84 Z', c: '#e86fa8' },
      { t: 'rect', x: 42, y: 84, w2: 6, h: 12, rad: 2, c: '#f0c49a' },
      { t: 'rect', x: 52, y: 84, w2: 6, h: 12, rad: 2, c: '#f0c49a' },
      { t: 'circle', cx: 44, cy: 29, r: 2, c: '#25313b', w: 1 },
      { t: 'circle', cx: 56, cy: 29, r: 2, c: '#25313b', w: 1 }
    ] },
    { name: 'Dad', icon: '👨', shapes: [
      { t: 'circle', cx: 50, cy: 24, r: 15, c: '#e8b98f' },
      { t: 'path', d: 'M35,23 Q35,7 50,7 Q65,7 65,23 Q58,15 50,17 Q42,15 35,23 Z', c: '#3a2a20', w: 1 },
      { t: 'path', d: 'M34,42 Q50,36 66,42 L70,78 L30,78 Z', c: '#3a5f8a' },
      { t: 'path', d: 'M46,42 L54,42 L51,64 L50,68 L49,64 Z', c: '#e8484f', w: 1 },
      { t: 'rect', x: 36, y: 78, w2: 11, h: 18, rad: 3, c: '#25313b' },
      { t: 'rect', x: 53, y: 78, w2: 11, h: 18, rad: 3, c: '#25313b' }
    ] },
    { name: 'Mom', icon: '👩', shapes: [
      { t: 'path', d: 'M30,46 Q28,8 50,8 Q72,8 70,46 L64,50 L36,50 Z', c: '#6b4a2f', w: 1 },
      { t: 'circle', cx: 50, cy: 26, r: 15, c: '#f0c49a' },
      { t: 'path', d: 'M50,46 L26,82 L74,82 Z', c: '#8b5cc7' },
      { t: 'rect', x: 42, y: 82, w2: 6, h: 14, rad: 2, c: '#f0c49a' },
      { t: 'rect', x: 52, y: 82, w2: 6, h: 14, rad: 2, c: '#f0c49a' },
      { t: 'circle', cx: 44, cy: 27, r: 2, c: '#25313b', w: 1 },
      { t: 'circle', cx: 56, cy: 27, r: 2, c: '#25313b', w: 1 }
    ] },
    { name: 'Dog', icon: '🐶', shapes: [
      { t: 'ellipse', cx: 56, cy: 62, rx: 26, ry: 18, c: '#d9a05b' },
      { t: 'circle', cx: 32, cy: 44, r: 17, c: '#e9bd7a' },
      { t: 'path', d: 'M20,36 L12,20 L32,30 Z', c: '#a9713a', w: 1 },
      { t: 'path', d: 'M44,36 L52,20 L34,30 Z', c: '#a9713a', w: 1 },
      { t: 'ellipse', cx: 26, cy: 50, rx: 5, ry: 4, c: '#f2d9b0' },
      { t: 'circle', cx: 26, cy: 50, r: 2.5, c: '#25313b', w: 1 },
      { t: 'circle', cx: 40, cy: 43, r: 2, c: '#25313b', w: 1 },
      { t: 'path', d: 'M78,58 Q92,48 88,34', c: '#d9a05b', w: 4 },
      { t: 'rect', x: 38, y: 76, w2: 8, h: 12, rad: 2, c: '#d9a05b' },
      { t: 'rect', x: 66, y: 76, w2: 8, h: 12, rad: 2, c: '#d9a05b' }
    ] },
    { name: 'Cat', icon: '🐈', shapes: [
      { t: 'ellipse', cx: 56, cy: 64, rx: 24, ry: 18, c: '#8b96a1' },
      { t: 'path', d: 'M32,44 L26,24 L46,34 Z', c: '#8b96a1', w: 1 },
      { t: 'path', d: 'M46,34 L54,20 L60,40 Z', c: '#8b96a1', w: 1 },
      { t: 'circle', cx: 44, cy: 42, r: 16, c: '#a9b3bd' },
      { t: 'circle', cx: 38, cy: 40, r: 2.5, c: '#25313b', w: 1 },
      { t: 'circle', cx: 50, cy: 40, r: 2.5, c: '#25313b', w: 1 },
      { t: 'path', d: 'M42,48 L46,48 L44,51 Z', c: '#e86fa8', w: 1 },
      { t: 'path', d: 'M78,60 Q92,54 88,36', c: '#8b96a1', w: 4 }
    ] },
    { name: 'Baby', icon: '👶', shapes: [
      { t: 'circle', cx: 50, cy: 34, r: 18, c: '#f5d3b3' },
      { t: 'path', d: 'M34,28 Q40,12 50,14 Q60,12 66,28', c: '#c98a55', w: 3 },
      { t: 'ellipse', cx: 50, cy: 68, rx: 22, ry: 20, c: '#f6cf46' },
      { t: 'circle', cx: 43, cy: 34, r: 2.5, c: '#25313b', w: 1 },
      { t: 'circle', cx: 57, cy: 34, r: 2.5, c: '#25313b', w: 1 },
      { t: 'path', d: 'M45,42 Q50,47 55,42', c: '#e86fa8', w: 2 }
    ] },

    /* ---- Vehicles ---- */
    { name: 'Car', icon: '🚗', shapes: [
      { t: 'path', d: 'M8,54 L18,34 Q21,28 30,28 L70,28 Q79,28 82,34 L92,54 L92,70 L8,70 Z', c: '#e8484f', w: 2 },
      { t: 'path', d: 'M30,32 L46,32 L42,48 L22,48 Z', c: '#8ed1ec', w: 1.5 },
      { t: 'path', d: 'M52,32 L70,32 L78,48 L54,48 Z', c: '#8ed1ec', w: 1.5 },
      { t: 'circle', cx: 28, cy: 70, r: 11, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 72, cy: 70, r: 11, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 28, cy: 70, r: 4, c: '#ffffff', w: 1 },
      { t: 'circle', cx: 72, cy: 70, r: 4, c: '#ffffff', w: 1 }
    ] },
    { name: 'Bus', icon: '🚌', shapes: [
      { t: 'path', d: 'M8,22 Q8,16 14,16 L86,16 Q92,16 92,22 L92,74 L8,74 Z', c: '#f6cf46', w: 2 },
      { t: 'rect', x: 14, y: 24, w2: 16, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 34, y: 24, w2: 16, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 54, y: 24, w2: 16, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 76, y: 24, w2: 10, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 74, y: 44, w2: 14, h: 30, rad: 2, c: '#ffffff', w: 1.5 },
      { t: 'circle', cx: 28, cy: 74, r: 10, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 72, cy: 74, r: 10, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 28, cy: 74, r: 3.5, c: '#ffffff', w: 1 },
      { t: 'circle', cx: 72, cy: 74, r: 3.5, c: '#ffffff', w: 1 }
    ] },
    { name: 'Train', icon: '🚂', shapes: [
      { t: 'rect', x: 12, y: 44, w2: 54, h: 30, rad: 3, c: '#e8484f', w: 2 },
      { t: 'path', d: 'M66,50 L84,50 L94,62 L94,74 L66,74 Z', c: '#e8484f', w: 2 },
      { t: 'rect', x: 26, y: 20, w2: 26, h: 24, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 16, y: 34, w2: 10, h: 10, rad: 1, c: '#f6cf46', w: 1.5 },
      { t: 'rect', x: 38, y: 10, w2: 10, h: 12, rad: 2, c: '#8a96a1', w: 1.5 },
      { t: 'circle', cx: 43, cy: 8, r: 6, c: '#ffffff', w: 1.5 },
      { t: 'path', d: 'M20,86 L80,86', c: 'none', w: 3 },
      { t: 'circle', cx: 28, cy: 74, r: 11, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 54, cy: 74, r: 11, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 84, cy: 74, r: 8, c: '#4a4a4a', w: 2 }
    ] },
    { name: 'Truck', icon: '🚚', shapes: [
      { t: 'rect', x: 6, y: 28, w2: 56, h: 44, rad: 2, c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M62,42 L80,42 L92,54 L92,72 L62,72 Z', c: '#e8484f', w: 2 },
      { t: 'rect', x: 66, y: 46, w2: 14, h: 12, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'path', d: 'M16,50 L52,50', c: 'none', w: 2 },
      { t: 'circle', cx: 24, cy: 74, r: 10, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 76, cy: 74, r: 10, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 24, cy: 74, r: 3.5, c: '#ffffff', w: 1 },
      { t: 'circle', cx: 76, cy: 74, r: 3.5, c: '#ffffff', w: 1 }
    ] },
    { name: 'Ship', icon: '🚢', shapes: [
      { t: 'path', d: 'M10,58 L90,58 L78,82 L22,82 Z', c: '#e8484f', w: 2 },
      { t: 'rect', x: 24, y: 40, w2: 52, h: 18, rad: 2, c: '#f2ece0', w: 1.5 },
      { t: 'rect', x: 34, y: 26, w2: 14, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 56, y: 26, w2: 14, h: 14, rad: 2, c: '#8ed1ec', w: 1.5 },
      { t: 'rect', x: 44, y: 8, w2: 10, h: 18, rad: 2, c: '#8a96a1', w: 1.5 },
      { t: 'path', d: 'M54,12 L72,16 L54,20 Z', c: '#f6cf46', w: 1.5 },
      { t: 'path', d: 'M6,90 Q18,84 30,90 T54,90 T78,90 T96,90', c: 'none', w: 2 }
    ] },
    { name: 'Airplane', icon: '✈️', shapes: [
      { t: 'path', d: 'M50,6 Q56,6 57,20 L59,48 L50,54 L41,48 L43,20 Q44,6 50,6 Z', c: '#dbeaf2', w: 2 },
      { t: 'path', d: 'M41,42 L8,60 L8,68 L41,60 Z', c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M59,42 L92,60 L92,68 L59,60 Z', c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M45,56 L38,88 L46,84 L50,66 L54,84 L62,88 L55,56 Z', c: '#3fa9c9', w: 2 },
      { t: 'circle', cx: 50, cy: 26, r: 3, c: '#8ed1ec', w: 1 }
    ] },
    { name: 'Helicopter', icon: '🚁', shapes: [
      { t: 'ellipse', cx: 44, cy: 52, rx: 30, ry: 19, c: '#e8484f', w: 2 },
      { t: 'path', d: 'M70,46 L90,46 L96,52 L90,58 L70,58 Z', c: '#e8484f', w: 2 },
      { t: 'path', d: 'M88,38 L96,32 L96,72 L88,66 Z', c: '#3fa9c9', w: 2 },
      { t: 'path', d: 'M16,24 L72,24 M44,24 L44,34', c: 'none', w: 3 },
      { t: 'rect', x: 28, y: 44, w2: 18, h: 12, rad: 4, c: '#8ed1ec', w: 1.5 },
      { t: 'path', d: 'M28,72 L28,84 M60,72 L60,84 M22,84 L66,84', c: 'none', w: 2 }
    ] },
    { name: 'Bicycle', icon: '🚲', shapes: [
      { t: 'circle', cx: 24, cy: 66, r: 20, c: 'none', w: 3 },
      { t: 'circle', cx: 76, cy: 66, r: 20, c: 'none', w: 3 },
      { t: 'path', d: 'M24,66 L44,38 L58,66 L24,66 Z M58,66 L68,38 L44,38', c: 'none', w: 3 },
      { t: 'path', d: 'M68,38 L76,30 M40,36 L50,36', c: 'none', w: 3 },
      { t: 'circle', cx: 58, cy: 66, r: 5, c: '#f6cf46', w: 1.5 }
    ] },
    { name: 'Scooter', icon: '🛴', shapes: [
      { t: 'path', d: 'M16,72 L66,72 L74,62', c: '#3fa9c9', w: 6 },
      { t: 'path', d: 'M74,16 L74,62 M62,16 L86,16', c: '#4a4a4a', w: 5 },
      { t: 'circle', cx: 22, cy: 78, r: 12, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 76, cy: 78, r: 12, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 22, cy: 78, r: 4, c: '#ffffff', w: 1 },
      { t: 'circle', cx: 76, cy: 78, r: 4, c: '#ffffff', w: 1 }
    ] },
    { name: 'Traffic light', icon: '🚦', shapes: [
      { t: 'rect', x: 36, y: 6, w2: 28, h: 64, rad: 6, c: '#4a4a4a', w: 2 },
      { t: 'circle', cx: 50, cy: 20, r: 8, c: '#e8484f', w: 1.5 },
      { t: 'circle', cx: 50, cy: 38, r: 8, c: '#f6cf46', w: 1.5 },
      { t: 'circle', cx: 50, cy: 56, r: 8, c: '#5bbd6e', w: 1.5 },
      { t: 'rect', x: 47, y: 70, w2: 6, h: 24, c: '#8a96a1', w: 1.5 }
    ] },

    /* ---- Playground ---- */
    { name: 'Slide', icon: '🛝', shapes: [
      { t: 'rect', x: 10, y: 30, w2: 30, h: 6, rad: 2, c: '#c68a4a', w: 1.5 },
      { t: 'path', d: 'M12,36 L12,88 M38,36 L38,88 M12,52 L38,52 M12,70 L38,70', c: 'none', w: 3 },
      { t: 'path', d: 'M40,32 Q60,36 78,88 L62,88 Q50,48 40,44 Z', c: '#e8484f', w: 2 },
      { t: 'path', d: 'M8,92 L92,92', c: 'none', w: 4 }
    ] },
    { name: 'Swing', icon: '⛓️', shapes: [
      { t: 'path', d: 'M22,20 L8,90 M78,20 L92,90 M22,20 L78,20', c: '#8a5a3b', w: 4 },
      { t: 'path', d: 'M38,20 L38,66 M62,20 L62,66', c: '#4a4a4a', w: 2 },
      { t: 'rect', x: 32, y: 66, w2: 36, h: 8, rad: 2, c: '#f2913c', w: 2 },
      { t: 'path', d: 'M4,94 L96,94', c: 'none', w: 3 }
    ] },
    { name: 'Seesaw', icon: '🎢', shapes: [
      { t: 'path', d: 'M10,62 L90,44', c: '#c68a4a', w: 7 },
      { t: 'path', d: 'M44,88 L54,50 L64,88 Z', c: '#8a96a1', w: 2 },
      { t: 'path', d: 'M8,92 L92,92', c: 'none', w: 3 }
    ] },
    { name: 'Ferris wheel', icon: '🎡', shapes: [
      { t: 'circle', cx: 50, cy: 46, r: 34, c: 'none', w: 3 },
      { t: 'circle', cx: 50, cy: 46, r: 6, c: '#f6cf46', w: 2 },
      { t: 'path', d: 'M50,12 L50,80 M16,46 L84,46 M26,22 L74,70 M74,22 L26,70', c: 'none', w: 1.5 },
      { t: 'path', d: 'M50,46 L32,92 M50,46 L68,92 M20,92 L80,92', c: '#8a5a3b', w: 3 },
      { t: 'rect', x: 44, y: 10, w2: 12, h: 9, rad: 2, c: '#e8484f', w: 1.5 },
      { t: 'rect', x: 70, y: 40, w2: 12, h: 9, rad: 2, c: '#3fa9c9', w: 1.5 },
      { t: 'rect', x: 44, y: 74, w2: 12, h: 9, rad: 2, c: '#5bbd6e', w: 1.5 },
      { t: 'rect', x: 18, y: 40, w2: 12, h: 9, rad: 2, c: '#e86fa8', w: 1.5 }
    ] },
    { name: 'Carousel', icon: '🎠', shapes: [
      { t: 'path', d: 'M50,8 L88,34 L12,34 Z', c: '#e8484f', w: 2 },
      { t: 'path', d: 'M12,34 Q16,42 24,34 Q32,42 40,34 Q48,42 56,34 Q64,42 72,34 Q80,42 88,34', c: '#f6cf46', w: 2 },
      { t: 'rect', x: 47, y: 34, w2: 6, h: 52, c: '#c68a4a', w: 1.5 },
      { t: 'rect', x: 20, y: 62, w2: 22, h: 16, rad: 4, c: '#8b5cc7', w: 2 },
      { t: 'rect', x: 58, y: 62, w2: 22, h: 16, rad: 4, c: '#3fa9c9', w: 2 },
      { t: 'rect', x: 12, y: 86, w2: 76, h: 8, rad: 3, c: '#c68a4a', w: 1.5 }
    ] },
    { name: 'Trampoline', icon: '🟢', shapes: [
      { t: 'ellipse', cx: 50, cy: 52, rx: 42, ry: 16, c: '#3fa9c9', w: 2 },
      { t: 'ellipse', cx: 50, cy: 50, rx: 34, ry: 11, c: '#8ed1ec', w: 2 },
      { t: 'path', d: 'M18,62 L14,88 M82,62 L86,88 M50,68 L50,88', c: '#8a96a1', w: 3 }
    ] },
    { name: 'Ball pit', icon: '🔵', shapes: [
      { t: 'path', d: 'M8,52 Q50,38 92,52 L88,88 L12,88 Z', c: '#f6cf46', w: 2 },
      { t: 'circle', cx: 28, cy: 56, r: 11, c: '#e8484f', w: 2 },
      { t: 'circle', cx: 50, cy: 50, r: 11, c: '#3fa9c9', w: 2 },
      { t: 'circle', cx: 72, cy: 56, r: 11, c: '#8b5cc7', w: 2 },
      { t: 'circle', cx: 38, cy: 70, r: 11, c: '#5bbd6e', w: 2 },
      { t: 'circle', cx: 62, cy: 70, r: 11, c: '#e86fa8', w: 2 }
    ] },
    { name: 'Sandcastle', icon: '🏰', shapes: [
      { t: 'rect', x: 14, y: 52, w2: 72, h: 36, rad: 2, c: '#e9bd7a', w: 2 },
      { t: 'rect', x: 14, y: 34, w2: 20, h: 54, rad: 2, c: '#e9bd7a', w: 2 },
      { t: 'rect', x: 40, y: 24, w2: 20, h: 64, rad: 2, c: '#e9bd7a', w: 2 },
      { t: 'rect', x: 66, y: 34, w2: 20, h: 54, rad: 2, c: '#e9bd7a', w: 2 },
      { t: 'path', d: 'M40,24 L50,8 L60,24 Z', c: '#e8484f', w: 2 },
      { t: 'rect', x: 42, y: 66, w2: 16, h: 22, rad: 7, c: '#8a5a3b', w: 2 },
      { t: 'path', d: 'M8,92 L92,92', c: 'none', w: 3 }
    ] }
  ];

  window.COLORING_STICKERS = S;
})();
