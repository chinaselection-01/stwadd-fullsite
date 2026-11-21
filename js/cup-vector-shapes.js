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
      desc: 'Tapered tumbler, wide top narrowing to base. Flat press lid.',
      printArea: { x: 150, y: 220, w: 100, h: 264 },
      svg: svgWrap('mk', `
        <path d="M118,162 L152,500 Q155,514 168,516 L232,516 Q245,514 248,500 L282,162 Z" fill="url(#mk-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M138,176 L167,494 Q169,504 175,508 L181,508 L154,176 Z" fill="url(#mk-light)" opacity="0.5"/>
        <path d="M262,176 L234,494 Q232,504 227,508 L222,508 L246,176 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="162" rx="82" ry="13" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M114,162 L114,138 Q200,126 286,138 L286,162 Q200,174 114,162 Z" fill="url(#mk-lid)"/>
        <ellipse cx="200" cy="137" rx="70" ry="10" fill="#2b3137" stroke="#0d1013" stroke-width="1"/>
        <rect x="182" y="130" width="36" height="8" rx="4" fill="#6b737b"/>
        <path d="M168,516 Q200,522 232,516" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="150" y="220" width="100" height="264" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
      `)
    },
    {
      id: 'dual-drink-400',
      name: '400ml Dual-Drink Coffee Cup', short: 'Dual-Drink 400',
      zh: '400ml 双饮咖啡杯',
      cap: '400ml',
      desc: 'Tapered coffee cup with flip lid, carry loop and colour lock button.',
      printArea: { x: 150, y: 222, w: 100, h: 258 },
      svg: svgWrap('dd', `
        <path d="M122,168 L152,498 Q155,512 168,514 L232,514 Q245,512 248,498 L278,168 Z" fill="url(#dd-body)" stroke="#828b95" stroke-width="1.3"/>
        <path d="M140,182 L168,492 Q170,502 176,506 L182,506 L156,182 Z" fill="url(#dd-light)" opacity="0.5"/>
        <path d="M260,182 L233,492 Q231,502 226,506 L221,506 L245,182 Z" fill="#000" opacity="0.05"/>
        <ellipse cx="200" cy="168" rx="78" ry="12" fill="#c4ccd4" stroke="#828b95" stroke-width="1.2"/>
        <path d="M118,168 L118,140 Q200,128 282,140 L282,168 Q200,180 118,168 Z" fill="url(#dd-lid)"/>
        <path d="M156,140 Q156,116 200,114 Q244,116 244,140 Z" fill="#2b3137" stroke="#0d1013" stroke-width="1"/>
        <rect x="178" y="100" width="44" height="12" rx="6" fill="none" stroke="#23282d" stroke-width="6"/>
        <rect x="187" y="158" width="26" height="9" rx="3" fill="#c0392b" stroke="#7d2418" stroke-width="0.8"/>
        <path d="M168,514 Q200,520 232,514" fill="none" stroke="#6f7882" stroke-width="1" opacity="0.6"/>
        <rect class="print-guide" x="150" y="222" width="100" height="258" rx="6" fill="none" stroke="#e11d48" stroke-width="1.7" stroke-dasharray="7 5"/>
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
    }
  ];

  // Strip the red print guide so a clean vector can be downloaded.
  function cleanSVG(shape) {
    return shape.svg.replace(/<rect class="print-guide"[^>]*\/>/g, '');
  }

  window.CUP_VECTOR_SHAPES = SHAPES;
  window.cupVectorCleanSVG = cleanSVG;
})();
