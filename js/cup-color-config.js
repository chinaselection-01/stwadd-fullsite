/* =====================================================================
 * STWADD — Cup Color Studio configuration
 * Defines independently colourable parts for each real cup shape.
 * The body is a single path that can be split into 1/2/3 horizontal
 * zones (either solid colour blocks or a smooth gradient) via a clipPath.
 * Other parts (lid, mouthpiece/spout, carry loop, collar, button) are
 * plain SVG shapes whose fill/stroke the user can change by clicking.
 *
 * Consumed by cup-color-studio.html. Silhouettes match cup-vector-shapes.js.
 * These are illustrative outlines, not engineering drawings.
 * ===================================================================== */
(function () {
  'use strict';

  var VIEWBOX = '0 0 400 560';

  var CUPS = [
    {
      id: 'straight-flask-720', name: '720ml Straight Flask', zh: '720ml 直筒翻盖瓶',
      body: { path: 'M132,152 L132,484 Q132,514 150,517 L250,517 Q268,514 268,484 L268,152 Z', top: 152, bottom: 517 },
      decor: [
        { t: 'path', d: 'M148,166 L148,478 Q148,498 157,504 L166,504 L166,166 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M245,166 L245,478 Q245,498 238,504 L234,504 L234,166 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Rim / Collar', zh: '杯口圈', kind: 'fill', shapes: [{ t: 'ellipse', cx: 200, cy: 152, rx: 68, ry: 11 }], color: '#c4ccd4', stroke: '#828b95', sw: 1.2 },
        { id: 'lid', label: 'Flip lid', zh: '翻盖', kind: 'fill', shapes: [{ t: 'path', d: 'M130,152 L130,120 Q200,108 270,120 L270,152 Q200,164 130,152 Z' }], color: '#2b3137' },
        { id: 'loop', label: 'Carry loop', zh: '提环', kind: 'stroke', sw: 7, shapes: [{ t: 'rect', x: 178, y: 76, w: 44, h: 15, r: 7.5 }], color: '#23282d' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [{ t: 'ellipse', cx: 200, cy: 136, rx: 13, ry: 4.5 }], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'sport-flask-800', name: '800ml Sport Flask', zh: '800ml 宽口运动壶',
      body: { path: 'M120,158 L120,486 Q120,516 142,518 L258,518 Q280,516 280,486 L280,158 Z', top: 158, bottom: 518 },
      decor: [
        { t: 'path', d: 'M140,172 L140,480 Q140,500 149,506 L158,506 L158,172 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M256,172 L256,480 Q256,500 248,506 L244,506 L244,172 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Steel collar', zh: '钢圈', kind: 'fill', shapes: [
            { t: 'path', d: 'M116,158 L116,136 Q200,124 284,136 L284,158 Q200,170 116,158 Z' },
            { t: 'ellipse', cx: 200, cy: 158, rx: 80, ry: 12 }
          ], color: '#c4ccd4', stroke: '#8b939b', sw: 1 },
        { id: 'lid', label: 'Cap', zh: '盖子', kind: 'fill', shapes: [{ t: 'path', d: 'M152,136 L152,110 Q200,102 248,110 L248,136 Q200,144 152,136 Z' }], color: '#2b3137' },
        { id: 'loop', label: 'Square loop', zh: '方提环', kind: 'stroke', sw: 8, shapes: [{ t: 'rect', x: 168, y: 84, w: 64, h: 17, r: 6 }], color: '#1d2226' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [{ t: 'ellipse', cx: 200, cy: 130, rx: 16, ry: 5 }], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'space-flask', name: 'Space Flask', zh: '太空壶',
      body: { path: 'M150,155 L150,490 Q150,516 165,518 L235,518 Q250,516 250,490 L250,155 Z', top: 155, bottom: 518 },
      decor: [
        { t: 'path', d: 'M162,168 L162,484 Q162,502 169,507 L175,507 L175,168 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M238,168 L238,484 Q238,502 232,507 L228,507 L228,168 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Rim', zh: '杯口圈', kind: 'fill', shapes: [{ t: 'ellipse', cx: 200, cy: 155, rx: 50, ry: 9 }], color: '#c4ccd4', stroke: '#828b95', sw: 1.2 },
        { id: 'lid', label: 'Loop lid', zh: '提环盖', kind: 'fill', shapes: [{ t: 'path', d: 'M148,155 L148,128 Q200,118 252,128 L252,155 Q200,165 148,155 Z' }], color: '#2b3137' },
        { id: 'loop', label: 'Carry loop', zh: '提环', kind: 'stroke', sw: 6, shapes: [{ t: 'rect', x: 180, y: 98, w: 40, h: 12, r: 6 }], color: '#23282d' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [{ t: 'ellipse', cx: 200, cy: 133, rx: 12, ry: 4.5 }], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'milk-coffee-360', name: '360ml Milk Coffee', zh: '360ml 牛奶咖啡杯',
      body: { path: 'M118,162 L124,492 Q126,512 142,515 L258,515 Q274,512 276,492 L282,162 Z', top: 162, bottom: 515 },
      decor: [
        { t: 'path', d: 'M138,176 L144,486 Q146,500 154,505 L162,505 L150,176 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M262,176 L256,486 Q254,500 246,505 L238,505 L250,176 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Rim', zh: '杯口圈', kind: 'fill', shapes: [{ t: 'ellipse', cx: 200, cy: 162, rx: 82, ry: 13 }], color: '#c4ccd4', stroke: '#828b95', sw: 1.2 },
        { id: 'lid', label: 'Press lid', zh: '平盖', kind: 'fill', shapes: [{ t: 'path', d: 'M114,162 L114,138 Q200,126 286,138 L286,162 Q200,174 114,162 Z' }], color: '#2b3137' },
        { id: 'mouth', label: 'Drinking opening', zh: '饮口', kind: 'fill', isMouth: true, shapes: [{ t: 'ellipse', cx: 200, cy: 137, rx: 20, ry: 6 }], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'dual-drink-400', name: '400ml Dual-Drink', zh: '400ml 双饮咖啡杯',
      body: { path: 'M120,168 C116,290 120,410 132,492 Q136,510 152,512 L248,512 Q264,510 268,492 C280,410 284,290 280,168 Z', top: 168, bottom: 512 },
      decor: [
        { t: 'path', d: 'M138,182 C134,290 138,405 148,492 L161,492 C151,405 148,290 151,182 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M262,182 C266,290 262,405 252,492 L239,492 C249,405 252,290 249,182 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Rim', zh: '杯口圈', kind: 'fill', shapes: [{ t: 'ellipse', cx: 200, cy: 168, rx: 80, ry: 12 }], color: '#c4ccd4', stroke: '#828b95', sw: 1.2 },
        { id: 'lid', label: 'Flip lid', zh: '翻盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M116,168 L116,140 Q200,128 284,140 L284,168 Q200,180 116,168 Z' },
            { t: 'path', d: 'M156,140 Q156,116 200,114 Q244,116 244,140 Z' }
          ], color: '#2b3137' },
        { id: 'loop', label: 'Carry loop', zh: '提环', kind: 'stroke', sw: 6, shapes: [{ t: 'rect', x: 178, y: 100, w: 44, h: 12, r: 6 }], color: '#23282d' },
        { id: 'button', label: 'Lock button', zh: '锁扣', kind: 'fill', shapes: [{ t: 'rect', x: 187, y: 158, w: 26, h: 9, r: 3 }], color: '#c0392b' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [{ t: 'ellipse', cx: 200, cy: 134, rx: 14, ry: 5 }], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'dual-drink-600', name: '600ml Dual-Drink Straw', zh: '600ml 双饮吸管杯',
      body: { path: 'M108,182 L108,490 Q108,516 130,518 L270,518 Q292,516 292,490 L292,182 Z', top: 182, bottom: 518 },
      decor: [
        { t: 'path', d: 'M130,198 L130,484 Q130,504 140,509 L150,509 L150,198 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M271,198 L271,484 Q271,504 262,509 L257,509 L257,198 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'collar', label: 'Lid base', zh: '盖座', kind: 'fill', shapes: [{ t: 'path', d: 'M104,182 L104,148 Q200,134 296,148 L296,182 Q200,196 104,182 Z' }], color: '#d6dbe0', stroke: '#9aa2aa', sw: 1.2 },
        { id: 'lid', label: 'Flip cover', zh: '翻盖', kind: 'fill', shapes: [{ t: 'path', d: 'M138,148 Q138,118 200,116 Q262,118 262,148 Z' }], color: '#e4e8ec', stroke: '#aeb6be', sw: 1 },
        { id: 'loop', label: 'Side loop', zh: '侧提环', kind: 'stroke', sw: 7, shapes: [{ t: 'path', d: 'M232,124 Q262,118 276,140' }], color: '#9aa2aa' },
        { id: 'mouth', label: 'Straw ports', zh: '吸管口', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M158,126 L196,126 L192,146 L162,146 Z' },
            { t: 'path', d: 'M204,126 L226,126 L226,143 L204,143 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    }
  ];

  window.CUP_COLOR_CONFIG = { viewBox: VIEWBOX, cups: CUPS };
})();
