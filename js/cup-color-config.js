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
      body: { path: 'M146,168 L146,488 Q146,516 160,520 L240,520 Q254,516 254,488 L254,168 Z', top: 168, bottom: 520 },
      decor: [
        { t: 'path', d: 'M158,180 L158,484 Q159,502 166,508 L172,508 L172,180 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M242,180 L242,484 Q241,502 234,508 L228,508 L228,180 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Ribbed screw cap', zh: '螺纹盖圈', kind: 'fill', shapes: [
            { t: 'path', d: 'M145,156 L145,132 Q200,124 255,132 L255,156 Q200,166 145,156 Z' },
            { t: 'path', d: 'M180,132 L180,104 Q200,99 220,104 L220,132 Z' },
            { t: 'ellipse', cx: 200, cy: 104, rx: 20, ry: 5 }
          ], color: '#c4ccd4', stroke: '#9aa2aa', sw: 1 },
        { id: 'loop', label: 'Round carry handle', zh: '圆环提手', kind: 'stroke', sw: 11, shapes: [
            { t: 'path', d: 'M166,62 A34,34 0 1,1 234,62 A34,34 0 1,1 166,62 Z' }
          ], color: '#2b3137' },
        { id: 'mouth', label: 'Drinking spout', zh: '饮嘴', kind: 'fill', isMouth: true, shapes: [
            { t: 'path', d: 'M191,104 L209,104 L207,94 L193,94 Z' }
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
      body: { path: 'M112,168 L116,352 C120,412 130,452 138,480 L138,496 Q138,516 156,520 L244,520 Q262,516 262,496 L262,480 C270,452 280,412 284,352 L288,168 Z', top: 168, bottom: 520 },
      decor: [
        { t: 'path', d: 'M130,178 L133,352 C137,412 146,452 152,480 L152,492 Q153,504 160,508 L168,508 L158,178 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M270,178 L267,352 C263,412 254,452 248,480 L248,492 Q247,504 240,508 L232,508 L242,178 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Straw lid', zh: '吸管盖', kind: 'fill', shapes: [
            { t: 'path', d: 'M106,168 L106,142 Q200,128 294,142 L294,168 Q200,184 106,168 Z' },
            { t: 'ellipse', cx: 200, cy: 142, rx: 86, ry: 13 },
            { t: 'path', d: 'M172,138 L228,138 L222,122 L178,122 Z' }
          ], color: '#2b3137' },
        { id: 'handle', label: 'Side handle', zh: '侧面手柄', kind: 'stroke', sw: 15, shapes: [
            { t: 'path', d: 'M292,196 Q332,196 332,238 L332,318 Q332,356 292,356' }
          ], color: '#b9c0c7' },
        { id: 'mouth', label: 'Straw', zh: '吸管', kind: 'fill', isMouth: true, shapes: [
            { t: 'rect', x: 146, y: 116, w: 10, h: 22, r: 5 }
          ], color: '#d9e2ea', opacity: 0.55 }
      ]
    },
    {
      id: 'narrow-bottle-500', name: '500ml Narrow-Mouth Bottle', zh: '500ml 小口瓶',
      body: { path: 'M146,222 C146,200 166,186 182,182 L182,164 L218,164 L218,182 C234,186 254,200 254,222 L254,492 Q254,516 238,520 L162,520 Q146,516 146,492 Z', top: 164, bottom: 520 },
      decor: [
        { t: 'path', d: 'M162,224 C162,204 178,192 188,190 L188,490 Q189,504 194,508 L174,508 L162,224 Z', fill: '#ffffff', op: 0.18 },
        { t: 'path', d: 'M238,224 C238,204 222,192 212,190 L212,490 Q211,504 206,508 L226,508 L238,224 Z', fill: '#000000', op: 0.06 }
      ],
      parts: [
        { id: 'lid', label: 'Screw cap', zh: '螺旋盖', kind: 'fill', shapes: [
            { t: 'rect', x: 176, y: 142, w: 48, h: 26, r: 3 },
            { t: 'path', d: 'M171,142 Q171,132 200,130 Q229,132 229,142 L229,145 Q200,137 171,145 Z' }
          ], color: '#c4ccd4', stroke: '#8b939b', sw: 1 },
        { id: 'loop', label: 'Cap ring', zh: '盖提环', kind: 'stroke', sw: 5, shapes: [
            { t: 'path', d: 'M222,138 Q244,133 249,150' }
          ], color: '#9aa2aa' }
      ]
    }
  ];

  window.CUP_COLOR_CONFIG = { viewBox: VIEWBOX, cups: CUPS };
})();
