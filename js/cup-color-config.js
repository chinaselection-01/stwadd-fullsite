/* =====================================================================
 * STWADD — Cup Color Studio configuration
 * Defines independently colourable parts for each real cup shape.
 * The body is a single path that can be split into 1/2/3 horizontal
 * zones (either solid colour blocks or a smooth gradient) via a clipPath.
 * Other parts (lid, mouthpiece/spout, carry loop, button) are plain SVG
 * shapes whose fill/stroke the user can change by clicking.
 *
 * v2 (2026-11-21): lids redrawn 1:1 against the real product photos —
 *   cylindrical / stepped / flip-cap lids with proper top faces instead of
 *   the old flat "olive" arc. The separate rim/collar part was removed
 *   (buyer confirmed it is not needed). Body bases widened to near-straight
 *   rounded bottoms to match the physical cups (no more pointed taper).
 *
 * Consumed by cup-color-studio.html. Silhouettes match cup-vector-shapes.js.
 * These are illustrative outlines, not engineering drawings.
 * ===================================================================== */
(function () {
  'use strict';

  var VIEWBOX = '0 0 400 560';

  var CUPS = [
    {
      id: 'straight-flask-720', name: '720ml Straight Flask', zh: '720ml 直筒弹跳盖瓶',
      body: { path: 'M132,152 L132,504 Q132,520 146,520 L254,520 Q268,520 268,504 L268,152 Z', top: 152, bottom: 520 },
      decor: [
        { t: 'path', d: 'M148,166 L148,488 Q149,502 156,508 L164,508 L164,166 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M245,166 L245,488 Q244,502 237,508 L232,508 L232,166 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Flip lid', zh: '弹跳盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M128,152 L128,126 Q128,116 200,114 Q272,116 272,126 L272,152 Q200,164 128,152 Z' },
            { t: 'ellipse', cx: 200, cy: 126, rx: 70, ry: 9 }
          ], color: '#2b3137' },
        { id: 'button', label: 'Release button', zh: '开锁按钮', kind: 'fill', shapes: [
            { t: 'rect', x: 180, y: 133, w: 40, h: 15, r: 4 }
          ], color: '#c9d0d7', stroke: '#9aa2aa', sw: 1 },
        { id: 'mouth', label: 'Drinking port', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M178,124 Q178,104 200,103 Q222,104 222,124 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'sport-flask-800', name: '800ml Sport Flask', zh: '800ml 宽口运动壶',
      body: { path: 'M120,158 L120,504 Q120,520 134,520 L266,520 Q280,520 280,504 L280,158 Z', top: 158, bottom: 520 },
      decor: [
        { t: 'path', d: 'M140,172 L140,490 Q141,504 149,509 L158,509 L158,172 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M256,172 L256,490 Q255,504 248,509 L244,509 L244,172 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Cap', zh: '圆角方盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M116,158 L116,124 Q116,110 200,108 Q284,110 284,124 L284,158 Q200,172 116,158 Z' },
            { t: 'ellipse', cx: 200, cy: 124, rx: 82, ry: 12 }
          ], color: '#2b3137' },
        { id: 'loop', label: 'Square loop', zh: '方提环', kind: 'stroke', sw: 9, shapes: [
            { t: 'rect', x: 150, y: 118, w: 100, h: 36, r: 9 }
          ], color: '#b9c0c7' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [
            { t: 'ellipse', cx: 200, cy: 122, rx: 18, ry: 5 }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'space-flask', name: 'Space Flask', zh: '太空壶',
      body: { path: 'M150,155 L150,506 Q150,520 162,520 L238,520 Q250,520 250,506 L250,155 Z', top: 155, bottom: 520 },
      decor: [
        { t: 'path', d: 'M162,168 L162,492 Q163,505 170,510 L176,510 L176,168 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M238,168 L238,492 Q237,505 231,510 L226,510 L226,168 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Loop lid', zh: '提环盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M144,155 L144,130 Q144,120 200,118 Q256,120 256,130 L256,155 Q200,165 144,155 Z' },
            { t: 'ellipse', cx: 200, cy: 130, rx: 55, ry: 9 },
            { t: 'rect', x: 192, y: 118, w: 16, h: 12, r: 3 }
          ], color: '#2b3137' },
        { id: 'loop', label: 'Carry loop', zh: 'D 形提环', kind: 'stroke', sw: 8, shapes: [
            { t: 'rect', x: 164, y: 100, w: 72, h: 26, r: 13 }
          ], color: '#23282d' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M191,120 L209,120 L207,110 L193,110 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'milk-coffee-360', name: '360ml Milk Coffee', zh: '360ml 牛奶咖啡杯',
      body: { path: 'M118,162 L119,504 Q119,520 133,520 L267,520 Q281,520 281,504 L282,162 Z', top: 162, bottom: 520 },
      decor: [
        { t: 'path', d: 'M138,176 L139,492 Q140,506 148,511 L156,511 L150,176 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M262,176 L261,492 Q260,506 252,511 L244,511 L250,176 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Stepped lid', zh: '双层平盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M112,162 L112,140 Q200,128 288,140 L288,162 Q200,176 112,162 Z' },
            { t: 'path', d: 'M150,140 L150,122 Q200,114 250,122 L250,140 Q200,148 150,140 Z' },
            { t: 'ellipse', cx: 200, cy: 122, rx: 50, ry: 8 }
          ], color: '#2b3137' },
        { id: 'mouth', label: 'Drinking tab', zh: '饮嘴拨片', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M176,120 L224,120 L218,108 L182,108 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'dual-drink-400', name: '400ml Dual-Drink', zh: '400ml 双饮咖啡杯',
      body: { path: 'M120,168 C116,290 120,410 132,490 Q134,510 148,514 L252,514 Q266,510 268,490 C280,410 284,290 280,168 Z', top: 168, bottom: 514 },
      decor: [
        { t: 'path', d: 'M138,182 C134,290 138,405 148,488 L161,488 C151,405 148,290 151,182 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M262,182 C266,290 262,405 252,488 L239,488 C249,405 252,290 249,182 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Flip lid', zh: '翻盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M116,168 L116,142 Q200,130 284,142 L284,168 Q200,180 116,168 Z' },
            { t: 'path', d: 'M158,142 L158,126 Q200,118 242,126 L242,142 Q200,150 158,142 Z' },
            { t: 'ellipse', cx: 200, cy: 126, rx: 42, ry: 7 }
          ], color: '#2b3137' },
        { id: 'loop', label: 'Carry loop', zh: '提环', kind: 'stroke', sw: 6, shapes: [
            { t: 'rect', x: 184, y: 104, w: 32, h: 12, r: 6 }
          ], color: '#23282d' },
        { id: 'button', label: 'Lock button', zh: '锁扣', kind: 'fill', shapes: [
            { t: 'rect', x: 184, y: 148, w: 32, h: 14, r: 5 }
          ], color: '#2c8a8a' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M186,130 L214,130 L212,141 L188,141 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'dual-drink-600', name: '600ml Dual-Drink Straw', zh: '600ml 双饮吸管杯',
      body: { path: 'M108,182 L108,504 Q108,520 124,520 L276,520 Q292,520 292,504 L292,182 Z', top: 182, bottom: 520 },
      decor: [
        { t: 'path', d: 'M130,198 L130,488 Q131,503 141,509 L150,509 L150,198 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M271,198 L271,488 Q270,503 261,509 L257,509 L257,198 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Flip cover', zh: '大翻盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M104,182 L104,150 Q200,136 296,150 L296,182 Q200,198 104,182 Z' },
            { t: 'ellipse', cx: 200, cy: 150, rx: 92, ry: 14 },
            { t: 'path', d: 'M138,148 L138,124 Q200,112 262,124 L262,148 Q200,160 138,148 Z' }
          ], color: '#e4e8ec', stroke: '#aeb6be', sw: 1 },
        { id: 'loop', label: 'Side loop', zh: '侧提环', kind: 'stroke', sw: 7, shapes: [
            { t: 'path', d: 'M268,152 Q292,148 296,170' }
          ], color: '#9aa2aa' },
        { id: 'mouth', label: 'Straw ports', zh: '吸管口', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M158,142 L198,142 L194,158 L162,158 Z' },
            { t: 'path', d: 'M206,142 L230,142 L230,156 L206,156 Z' }
          ], color: '#d9e2ea', opacity: 0.35 }
      ]
    },
    {
      id: 'tumbler-40oz', name: '40oz Quencher Tumbler', zh: '40oz 大肚吸管杯',
      body: { path: 'M112,168 C112,250 128,360 138,436 L138,492 Q138,516 156,520 L244,520 Q262,516 262,492 L262,436 C272,360 288,250 288,168 Z', top: 168, bottom: 520 },
      decor: [
        { t: 'path', d: 'M130,178 C130,255 144,360 152,436 L152,488 Q153,502 160,508 L168,508 L158,178 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M270,178 C270,255 256,360 248,436 L248,488 Q247,502 240,508 L232,508 L242,178 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Straw lid', zh: '吸管盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M108,168 L108,146 Q200,134 292,146 L292,168 Q200,182 108,168 Z' },
            { t: 'ellipse', cx: 200, cy: 146, rx: 76, ry: 11 },
            { t: 'path', d: 'M182,142 L218,142 L214,132 L186,132 Z' }
          ], color: '#2b3137' },
        { id: 'handle', label: 'Side handle', zh: '侧面手柄', kind: 'stroke', sw: 15, shapes: [
            { t: 'path', d: 'M292,196 Q332,196 332,238 L332,318 Q332,356 292,356' }
          ], color: '#b9c0c7' },
        { id: 'mouth', label: 'Straw', zh: '吸管', kind: 'fill', isMouth: true, shapes: [
            { t: 'rect', x: 170, y: 112, w: 12, h: 26, r: 6 }
          ], color: '#d9e2ea', opacity: 0.55 }
      ]
    },
    {
      id: 'narrow-bottle-500', name: '500ml Narrow-Mouth Bottle', zh: '500ml 小口瓶',
      body: { path: 'M148,214 C148,196 168,184 184,180 L184,166 L216,166 L216,180 C232,184 252,196 252,214 L252,492 Q252,516 236,520 L164,520 Q148,516 148,492 Z', top: 166, bottom: 520 },
      decor: [
        { t: 'path', d: 'M164,216 C164,202 180,192 190,189 L190,490 Q191,504 196,508 L176,508 L164,216 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M236,216 C236,202 220,192 210,189 L210,490 Q209,504 204,508 L224,508 L236,216 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Screw cap', zh: '螺旋盖', kind: 'fill', shapes: [
            { t: 'rect', x: 182, y: 150, w: 36, h: 20, r: 3 },
            { t: 'path', d: 'M178,150 Q178,142 200,140 Q222,142 222,150 L222,152 Q200,146 178,152 Z' }
          ], color: '#c4ccd4', stroke: '#8b939b', sw: 1 },
        { id: 'loop', label: 'Cap ring', zh: '盖提环', kind: 'stroke', sw: 5, shapes: [
            { t: 'path', d: 'M214,146 Q232,142 236,158' }
          ], color: '#9aa2aa' }
      ]
    }
  ];

  window.CUP_COLOR_CONFIG = { viewBox: VIEWBOX, cups: CUPS };
})();
