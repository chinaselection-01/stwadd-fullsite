/* =====================================================================
 * STWADD — Real product cup silhouettes as SVG vectors
 * Drawn from the 6 best-selling cup shapes on stwadd.com.
 * Each shape: full standalone SVG (gradient body + lid + print area)
 * Used by cup-vectors.html (gallery + download) and customizer.html.
 *
 * NOTE: These are illustrative vector outlines based on product photos,
 * NOT engineering drawings. Print area is indicative — confirm with a
 * physical sample before production.
 * ===================================================================== */
(function () {
  'use strict';

  // Shared gradient definitions generator — unique ids per shape so several
  // SVGs can live on one page without id collisions.
  function defs(p) {
    return `<defs>
      <linearGradient id="${p}-body" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#a9b1ba"/>
        <stop offset="0.14" stop-color="#e9edf1"/>
        <stop offset="0.36" stop-color="#ccd3da"/>
        <stop offset="0.54" stop-color="#f3f6f8"/>
        <stop offset="0.76" stop-color="#c0c7cf"/>
        <stop offset="1" stop-color="#8a929c"/>
      </linearGradient>
      <linearGradient id="${p}-lid" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#171b1f"/>
        <stop offset="0.45" stop-color="#3d444b"/>
        <stop offset="1" stop-color="#121619"/>
      </linearGradient>
      <linearGradient id="${p}-metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#9aa2aa"/>
        <stop offset="0.5" stop-color="#f0f3f5"/>
        <stop offset="1" stop-color="#979fa8"/>
      </linearGradient>
      <linearGradient id="${p}-light" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>`;
  }

  function svgWrap(p, content) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560" role="img">${defs(p)}${content}</svg>`;
  }

  const SHAPES = [
    {
      id: 'straight-flask-720',
      name: '720ml Straight Flask', short: 'Straight 720',
      zh: '720ml 直筒翻盖保温瓶',
      cap: '720ml',
      desc: 'Tall straight body, flip-top lid with carry loop. Slim cylindrical silhouette.',
      printArea: { x: 148, y: 212, w: 104, h: 268 },
      svg: svgWrap('sf', `
        <path d="M132,152 L132,484 Q132,514 150,517 L250,517 Q268,514 268,484 L268,152 Z" fill="url(#sf-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M148,166 L148,478 Q148,498 157,504 L166,504 L166,166 Z" fill="url(#sf-light)" opacity="0.5"/>
        <path d="M245,166 L245,478 Q245,498 238,504 L234,504 L234,166 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="152" rx="68" ry="11" fill="#bfc7cf" stroke="#828b95" stroke-width="1.2"/>
        <path d="M130,152 L130,120 Q200,108 270,120 L270,152 Q200,164 130,152 Z" fill="url(#sf-lid)"/>
        <path d="M158,120 Q158,94 200,92 Q242,94 242,120 Z" fill="#2b3137" stroke="#0d1013" stroke-width="1"/>
        <rect x="178" y="76" width="44" height="15" rx="7.5" fill="none" stroke="#23282d" stroke-width="7"/>
        <rect x="188" y="140" width="24" height="9" rx="3" fill="#aeb6be" stroke="#6e767e" stroke-width="0.8"/>
        <path d="M150,517 Q200,524 250,517" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="148" y="212" width="104" height="268" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'sport-flask-800',
      name: '800ml Sport Flask', short: 'Sport 800',
      zh: '800ml 宽口运动水壶',
      cap: '800ml',
      desc: 'Wide straight body, stainless steel collar and square carry-loop lid.',
      printArea: { x: 140, y: 215, w: 120, h: 270 },
      svg: svgWrap('sp', `
        <path d="M120,158 L120,486 Q120,516 142,518 L258,518 Q280,516 280,486 L280,158 Z" fill="url(#sp-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M140,172 L140,480 Q140,500 149,506 L158,506 L158,172 Z" fill="url(#sp-light)" opacity="0.5"/>
        <path d="M256,172 L256,480 Q256,500 248,506 L244,506 L244,172 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="158" rx="80" ry="12" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M116,158 L116,136 Q200,124 284,136 L284,158 Q200,170 116,158 Z" fill="url(#sp-metal)" stroke="#8b939b" stroke-width="1"/>
        <path d="M152,136 L152,110 Q200,102 248,110 L248,136 Q200,144 152,136 Z" fill="url(#sp-lid)"/>
        <rect x="168" y="84" width="64" height="17" rx="6" fill="none" stroke="#1d2226" stroke-width="8"/>
        <rect x="182" y="126" width="36" height="7" rx="3" fill="#9aa2aa"/>
        <path d="M142,518 Q200,525 258,518" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="140" y="215" width="120" height="270" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'space-flask',
      name: 'Space Flask 500 / 1000 / 1200ml', short: 'Space Flask',
      zh: '太空壶 500 / 1000 / 1200ml',
      cap: '500–1200ml',
      desc: 'Wide-mouth straight-body sport flask with ribbed screw cap and carry-loop lid. Three lid options: round handle, flip-up spout, side loop.',
      printArea: { x: 160, y: 214, w: 80, h: 274 },
      svg: svgWrap('fl', `
        <!-- bottle body: wide straight cylinder, rounded base -->
        <path d="M146,168 L146,488 Q146,516 160,520 L240,520 Q254,516 254,488 L254,168 Z" fill="url(#fl-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M158,180 L158,484 Q159,502 166,508 L172,508 L172,180 Z" fill="url(#fl-light)" opacity="0.5"/>
        <path d="M242,180 L242,484 Q241,502 234,508 L228,508 L228,180 Z" fill="#000" opacity="0.05"/>
        <!-- neck step / shoulder -->
        <path d="M150,168 L150,156 Q200,150 250,156 L250,168 Z" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <!-- ribbed screw collar -->
        <path d="M145,156 L145,132 Q200,124 255,132 L255,156 Q200,166 145,156 Z" fill="url(#fl-metal)" stroke="#828b95" stroke-width="1.1"/>
        <g stroke="#9aa2aa" stroke-width="1" opacity="0.7">
          <path d="M152,135 L152,155"/><path d="M160,134 L160,156"/><path d="M168,133 L168,157"/><path d="M176,133 L176,158"/>
          <path d="M184,132 L184,158"/><path d="M192,132 L192,159"/><path d="M200,132 L200,159"/><path d="M208,132 L208,159"/>
          <path d="M216,132 L216,158"/><path d="M224,133 L224,158"/><path d="M232,133 L232,157"/><path d="M240,134 L240,156"/><path d="M248,135 L248,155"/>
        </g>
        <!-- top raised boss (small ribbed cylinder) -->
        <path d="M180,132 L180,104 Q200,99 220,104 L220,132 Z" fill="url(#fl-metal)" stroke="#828b95" stroke-width="1"/>
        <g stroke="#9aa2aa" stroke-width="1" opacity="0.7">
          <path d="M187,106 L187,130"/><path d="M194,105 L194,131"/><path d="M200,104 L200,131"/><path d="M206,105 L206,131"/><path d="M213,106 L213,130"/>
        </g>
        <ellipse cx="200" cy="104" rx="20" ry="5" fill="#e9edf1" stroke="#828b95" stroke-width="1"/>
        <!-- big round carry handle (view 1) -->
        <circle cx="200" cy="62" r="34" fill="none" stroke="#2b3137" stroke-width="11"/>
        <circle cx="200" cy="62" r="34" fill="none" stroke="#5b636b" stroke-width="1.5"/>
        <path d="M186,93 L186,104 Q200,100 214,104 L214,93 Z" fill="#3d444b"/>
        <!-- print guide -->
        <rect class="print-guide" x="160" y="214" width="80" height="274" rx="5" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'milk-coffee-360',
      name: '360ml Milk Coffee Tumbler', short: 'Coffee 360',
      zh: '360ml 牛奶咖啡杯',
      cap: '360ml',
      desc: 'Near-straight tumbler, only slightly narrower at the base. Flat press lid.',
      printArea: { x: 140, y: 220, w: 120, h: 264 },
      svg: svgWrap('mk', `
        <path d="M118,162 L124,492 Q126,512 142,515 L258,515 Q274,512 276,492 L282,162 Z" fill="url(#mk-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M138,176 L144,486 Q146,500 154,505 L162,505 L150,176 Z" fill="url(#mk-light)" opacity="0.5"/>
        <path d="M262,176 L256,486 Q254,500 246,505 L238,505 L250,176 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="162" rx="82" ry="13" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M114,162 L114,138 Q200,126 286,138 L286,162 Q200,174 114,162 Z" fill="url(#mk-lid)"/>
        <ellipse cx="200" cy="137" rx="70" ry="10" fill="#2b3137" stroke="#0d1013" stroke-width="1"/>
        <rect x="182" y="130" width="36" height="8" rx="4" fill="#6b737b"/>
        <path d="M142,515 Q200,522 258,515" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="140" y="220" width="120" height="264" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'dual-drink-400',
      name: '400ml Dual-Drink Coffee Cup', short: 'Dual-Drink 400',
      zh: '400ml 双饮咖啡杯',
      cap: '400ml',
      desc: 'Gently barrelled coffee cup — mouth and base nearly equal width, not a cone. Flip lid, carry loop and colour lock button.',
      printArea: { x: 145, y: 222, w: 110, h: 258 },
      svg: svgWrap('dd', `
        <path d="M120,168 C116,290 120,410 132,492 Q136,510 152,512 L248,512 Q264,510 268,492 C280,410 284,290 280,168 Z" fill="url(#dd-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M138,182 C134,290 138,405 148,492 L161,492 C151,405 148,290 151,182 Z" fill="url(#dd-light)" opacity="0.5"/>
        <path d="M262,182 C266,290 262,405 252,492 L239,492 C249,405 252,290 249,182 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="168" rx="80" ry="12" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M116,168 L116,140 Q200,128 284,140 L284,168 Q200,180 116,168 Z" fill="url(#dd-lid)"/>
        <path d="M156,140 Q156,116 200,114 Q244,116 244,140 Z" fill="#2b3137" stroke="#0d1013" stroke-width="1"/>
        <rect x="178" y="100" width="44" height="12" rx="6" fill="none" stroke="#23282d" stroke-width="6"/>
        <rect x="187" y="158" width="26" height="9" rx="3" fill="#c0392b" stroke="#7d2418" stroke-width="0.8"/>
        <path d="M152,512 Q200,518 248,512" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="145" y="222" width="110" height="258" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'dual-drink-600',
      name: '600ml Dual-Drink Flip Straw Cup', short: 'Dual-Drink 600',
      zh: '600ml 双饮翻盖吸管杯',
      cap: '600ml',
      desc: 'Wide short straight body, large flip lid with straw port and handle.',
      printArea: { x: 130, y: 245, w: 140, h: 250 },
      svg: svgWrap('ds', `
        <path d="M108,182 L108,490 Q108,516 130,518 L270,518 Q292,516 292,490 L292,182 Z" fill="url(#ds-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M130,198 L130,484 Q130,504 140,509 L150,509 L150,198 Z" fill="url(#ds-light)" opacity="0.5"/>
        <path d="M271,198 L271,484 Q271,504 262,509 L257,509 L257,198 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="182" rx="92" ry="15" fill="#cbd2d9" stroke="#828b95" stroke-width="1.2"/>
        <path d="M104,182 L104,148 Q200,134 296,148 L296,182 Q200,196 104,182 Z" fill="#d6dbe0" stroke="#9aa2aa" stroke-width="1.2"/>
        <path d="M138,148 Q138,118 200,116 Q262,118 262,148 Z" fill="#e4e8ec" stroke="#aeb6be" stroke-width="1"/>
        <path d="M158,126 L196,126 L192,146 L162,146 Z" fill="#b9764f" stroke="#8a5233" stroke-width="0.8"/>
        <path d="M204,126 L226,126 L226,143 L204,143 Z" fill="#c98b63" stroke="#8a5233" stroke-width="0.8"/>
        <path d="M232,124 Q262,118 276,140" fill="none" stroke="#9aa2aa" stroke-width="7" stroke-linecap="round"/>
        <rect x="186" y="170" width="28" height="8" rx="3" fill="#b9764f"/>
        <path d="M130,518 Q200,526 270,518" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="130" y="245" width="140" height="250" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'tumbler-40oz',
      name: '40oz Quencher Tumbler', short: '40oz Tumbler',
      zh: '40oz 大肚吸管杯',
      cap: '40oz / 1200ml',
      desc: 'Stanley-style quencher: wide tapered body narrowing to a cup-holder base, large D-shaped side handle, wide rotating straw lid with flip tab.',
      printArea: { x: 128, y: 220, w: 144, h: 250 },
      svg: svgWrap('40z', `
        <path d="M112,168 L116,352 C120,412 130,452 138,480 L138,496 Q138,516 156,520 L244,520 Q262,516 262,496 L262,480 C270,452 280,412 284,352 L288,168 Z" fill="url(#40z-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M130,178 L133,352 C137,412 146,452 152,480 L152,492 Q153,504 160,508 L168,508 L158,178 Z" fill="url(#40z-light)" opacity="0.5"/>
        <path d="M270,178 L267,352 C263,412 254,452 248,480 L248,492 Q247,504 240,508 L232,508 L242,178 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="168" rx="90" ry="14" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M106,168 L106,142 Q200,128 294,142 L294,168 Q200,184 106,168 Z" fill="url(#40z-lid)" stroke="#0d1013" stroke-width="0.8"/>
        <ellipse cx="200" cy="142" rx="86" ry="13" fill="#343b42" stroke="#0d1013" stroke-width="1"/>
        <path d="M172,138 L228,138 L222,122 L178,122 Z" fill="#4a525a" stroke="#0d1013" stroke-width="0.8"/>
        <rect x="146" y="116" width="10" height="22" rx="5" fill="#8a929c" transform="rotate(-8 151 127)"/>
        <path d="M292,196 Q332,196 332,238 L332,318 Q332,356 292,356" fill="none" stroke="url(#40z-metal)" stroke-width="15" stroke-linecap="round"/>
        <path d="M292,196 Q332,196 332,238 L332,318 Q332,356 292,356" fill="none" stroke="#828b95" stroke-width="1" opacity="0.5"/>
        <path d="M156,520 Q200,527 244,520" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="128" y="220" width="144" height="250" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'narrow-bottle-500',
      name: '500ml Narrow-Mouth Bottle', short: 'Narrow 500',
      zh: '500ml 小口瓶',
      cap: '500ml',
      desc: 'Classic narrow-mouth bottle: slim straight body, rounded shoulder into a short neck, stainless screw cap with a small carry ring.',
      printArea: { x: 152, y: 232, w: 96, h: 262 },
      svg: svgWrap('nb', `
        <path d="M146,222 C146,200 166,186 182,182 L182,164 L218,164 L218,182 C234,186 254,200 254,222 L254,492 Q254,516 238,520 L162,520 Q146,516 146,492 Z" fill="url(#nb-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M162,224 C162,204 178,192 188,190 L188,490 Q189,504 194,508 L174,508 L162,224 Z" fill="url(#nb-light)" opacity="0.5"/>
        <path d="M238,224 C238,204 222,192 212,190 L212,490 Q211,504 206,508 L226,508 L238,224 Z" fill="#000" opacity="0.05"/>
        <rect x="176" y="142" width="48" height="26" rx="3" fill="url(#nb-metal)" stroke="#8b939b" stroke-width="1"/>
        <path d="M171,142 Q171,132 200,130 Q229,132 229,142 L229,145 Q200,137 171,145 Z" fill="#f0f3f5" stroke="#8b939b" stroke-width="0.8"/>
        <path d="M222,138 Q244,133 249,150" fill="none" stroke="#9aa2aa" stroke-width="5" stroke-linecap="round"/>
        <path d="M164,520 Q200,527 236,520" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="152" y="232" width="96" height="262" rx="5" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    }
  ];

  // Strip the red print guide so a clean vector can be downloaded.
  function cleanSVG(shape) {
    return shape.svg.replace(/<rect class="print-guide"[^>]*\/>/g, '');
  }

  window.CUP_VECTOR_SHAPES = SHAPES;
  window.cupVectorCleanSVG = cleanSVG;
})();
