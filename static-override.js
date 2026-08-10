/**
 * STWADD Static Site - Form Override + Nav Fix + Layout Guard
 * v20260810: CSS guards + JS fix with MutationObserver for sticky wrappers.
 * Original site uses html{font-size:10px} making nav ~12px; we bump to ~16px.
 * Does NOT modify html root or banner.
 *
 * KEY FINDING: position:sticky anonymous divs inserted by the framework
 * between .col-* cells and module __wrapper elements IGNORE width:100%.
 * The framework's layout JS also RESETS widths after page load.
 * Must use setAttribute('style',...) + MutationObserver to persist fixes.
 */
(function() {
  'use strict';

  var INQUIRY_EMAIL = 'sales1@stwadd.com';
  var INQUIRY_CC = 'bob@stwadd.com';

  /* ── Nav: enlarge text only ── */
  function fixNavFontSize() {
    var id = 'stwadd-nav-fix';
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = [
      '@media (min-width: 992px) {',
      '  .unit-header-nav .unit-header-nav__item-link {',
      '    font-size: 16px !important;',
      '    font-weight: 600 !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── Text layout guard (CSS) ── */
  function fixTextLayoutCSS() {
    var id = 'stwadd-text-layout-guard';
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = [
      '.row { flex-wrap: wrap !important; }',
      '.col { flex-shrink: 1 !important; }',
      '.unit-text { width: 100% !important; max-width: 100% !important; }',
      '.unit-text__item {',
      '  width: 100% !important; max-width: 100% !important;',
      '  word-break: normal !important; overflow-wrap: break-word !important;',
      '  white-space: normal !important;',
      '}',
      '[class*="__wrapper"] { width: 100% !important; display: block !important; }',
      '[tinymce] { width: 100% !important; word-break: normal !important; }',
      '[tinymce] > div { display: block !important; width: 100% !important; }',
      '[package-type="text"] { width: 100% !important; }',
      '[package-unit-type="text"] { width: 100% !important; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── Text layout guard (JS): force pixel widths on sticky wrappers ── */
  /*
   * Framework inserts anonymous DIVs with position:sticky between .col-*
   * cells and module __wrapper elements. These shrink to content width,
   * ignore CSS width:100%, and get RESET by framework's layout JS.
   *
   * We use setAttribute('style',...) which has higher precedence than
   * element.style, plus MutationObserver to catch framework resets.
   */
  var _wrapperFixObserver = null;

  function forceWrapperWidths() {
    var cells = document.querySelectorAll('.col');
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var cellW = cell.getBoundingClientRect().width;
      if (cellW < 50) continue;

      var children = cell.children;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        if (child.tagName !== 'DIV') continue;

        var cs = getComputedStyle(child);
        var childW = child.getBoundingClientRect().width;

        var isAnonymous = (!child.id || child.id === '') &&
          (!child.className || String(child.className).trim().length === 0);
        var isStickyOrRelative = cs.position === 'sticky' || cs.position === 'relative';
        var isCollapsed = childW < cellW * 0.9;

        if (isAnonymous && isStickyOrRelative && isCollapsed) {
          /* setAttribute overrides element.style and resists framework resets */
          child.setAttribute('style',
            'width:' + Math.round(cellW) + 'px !important;' +
            'max-width:' + Math.round(cellW) + 'px !important;');
        }
      }
    }
  }

  function startWrapperObserver() {
    if (_wrapperFixObserver || !window.MutationObserver) return;
    try {
      _wrapperFixObserver = new MutationObserver(function(mutations) {
        var needsFix = false;
        for (var m = 0; m < mutations.length; m++) {
          if (mutations[m].type === 'attributes' &&
              mutations[m].attributeName === 'style') {
            needsFix = true;
            break;
          }
        }
        if (needsFix) forceWrapperWidths();
      });
      _wrapperFixObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style']
      });
    } catch(e) { /* observer not supported, rely on polling */ }
  }

  /* Main init: CSS first, then JS fixes with progressive delays */
  function fixTextLayout() {
    fixTextLayoutCSS();
    forceWrapperWidths();
    setTimeout(forceWrapperWidths, 100);
    setTimeout(forceWrapperWidths, 300);
    setTimeout(forceWrapperWidths, 800);
    setTimeout(forceWrapperWidths, 1500);
    setTimeout(forceWrapperWidths, 3000);
    setTimeout(forceWrapperWidths, 5000);
    setTimeout(startWrapperObserver, 1000);
    if (window.addEventListener) {
      window.addEventListener('resize', forceWrapperWidths);
      window.addEventListener('orientationchange', forceWrapperWidths);
    }
  }

  /* ── Form handling (unchanged) ── */

  function getFormType(form) {
    var id = form.id || '';
    if (id.indexOf('customized') > -1) return 'Customized Product Inquiry';
    if (id.indexOf('widgetSocialMediaChat') > -1) return 'Quick Inquiry';
    return 'Product Inquiry';
  }

  function getProductName() {
    return document.title || 'STWADD Product';
  }

  function getPageUrl() {
    return window.location.href;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    var form = e.target;
    if (!form.hasAttribute('inquiry')) return;

    var inputs = form.querySelectorAll('input, textarea, select');
    var data = {};
    var hasContent = false;

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') continue;
      var name = input.getAttribute('data-title') || input.name || input.placeholder || 'field';
      var value = input.value || '';
      if (value) {
        data[name] = value;
        hasContent = true;
      }
    }

    if (!hasContent) {
      alert('Please fill in the form fields before submitting.');
      return false;
    }

    var subject = getFormType(form) + ' - ' + getProductName();
    var body = 'Product: ' + getProductName() + '\n';
    body += 'Page URL: ' + getPageUrl() + '\n';
    body += '---\n\n';

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        body += key + ': ' + data[key] + '\n';
      }
    }

    body += '\n---\nSent from stwadd.com';

    var mailto = 'mailto:' + INQUIRY_EMAIL +
      '?cc=' + INQUIRY_CC +
      '&subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;

    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Opening email...';
      btn.disabled = true;
      setTimeout(function() {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }

    return false;
  }

  function init() {
    fixNavFontSize();
    fixTextLayout();
    var forms = document.querySelectorAll('form[inquiry]');
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', handleFormSubmit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('submit', function(e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('inquiry')) {
      handleFormSubmit(e);
    }
  }, true);
})();
