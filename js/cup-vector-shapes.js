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
      desc: 'Extra-slim tall bottle with small loop lid. Three capacities, one silhouette.',
      printArea: { x: 162, y: 210, w: 76, h: 282 },
      svg: svgWrap('fl', `
        <path d="M150,155 L150,490 Q150,516 165,518 L235,518 Q250,516 250,490 L250,155 Z" fill="url(#fl-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M162,168 L162,484 Q162,502 169,507 L175,507 L175,168 Z" fill="url(#fl-light)" opacity="0.5"/>
        <path d="M238,168 L238,484 Q238,502 232,507 L228,507 L228,168 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="155" rx="50" ry="9" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M148,155 L148,128 Q200,118 252,128 L252,155 Q200,165 148,155 Z" fill="url(#fl-lid)"/>
        <path d="M172,128 Q172,108 200,106 Q228,108 228,128 Z" fill="#2b3137"/>
        <rect x="180" y="98" width="40" height="12" rx="6" fill="none" stroke="#23282d" stroke-width="6"/>
        <rect x="188" y="145" width="24" height="7" rx="3" fill="#aeb6be"/>
        <path d="M165,518 Q200,524 235,518" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="162" y="210" width="76" height="282" rx="5" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
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
        <path d="M112,168 C112,250 128,360 138,436 L138,492 Q138,516 156,520 L244,520 Q262,516 262,492 L262,436 C272,360 288,250 288,168 Z" fill="url(#40z-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M130,178 C130,255 144,360 152,436 L152,488 Q153,502 160,508 L168,508 L158,178 Z" fill="url(#40z-light)" opacity="0.5"/>
        <path d="M270,178 C270,255 256,360 248,436 L248,488 Q247,502 240,508 L232,508 L242,178 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="168" rx="88" ry="14" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M108,168 L108,146 Q200,134 292,146 L292,168 Q200,182 108,168 Z" fill="url(#40z-lid)" stroke="#0d1013" stroke-width="0.8"/>
        <ellipse cx="200" cy="146" rx="76" ry="11" fill="#343b42" stroke="#0d1013" stroke-width="1"/>
        <path d="M182,142 L218,142 L214,132 L186,132 Z" fill="#4a525a" stroke="#0d1013" stroke-width="0.8"/>
        <rect x="170" y="112" width="12" height="26" rx="6" fill="#8a929c" transform="rotate(-8 176 125)"/>
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
        <path d="M148,214 C148,196 168,184 184,180 L184,166 L216,166 L216,180 C232,184 252,196 252,214 L252,492 Q252,516 236,520 L164,520 Q148,516 148,492 Z" fill="url(#nb-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M164,216 C164,202 180,192 190,189 L190,490 Q191,504 196,508 L176,508 L164,216 Z" fill="url(#nb-light)" opacity="0.5"/>
        <path d="M236,216 C236,202 220,192 210,189 L210,490 Q209,504 204,508 L224,508 L236,216 Z" fill="#000" opacity="0.05"/>
        <rect x="182" y="150" width="36" height="20" rx="3" fill="url(#nb-metal)" stroke="#8b939b" stroke-width="1"/>
        <path d="M178,150 Q178,142 200,140 Q222,142 222,150 L222,152 Q200,146 178,152 Z" fill="#f0f3f5" stroke="#8b939b" stroke-width="0.8"/>
        <path d="M214,146 Q232,142 236,158" fill="none" stroke="#9aa2aa" stroke-width="5" stroke-linecap="round"/>
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
