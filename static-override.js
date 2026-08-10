/**
 * STWADD Static Site - Form Override + Nav Fix
 * v20260810: Minimal CSS - only enlarges header nav text.
 * Original site uses html{font-size:10px} making nav ~12px; we bump to ~16px.
 * Does NOT modify html root, banner, or any other element.
 */
(function() {
  'use strict';

  var INQUIRY_EMAIL = 'sales1@stwadd.com';
  var INQUIRY_CC = 'bob@stwadd.com';

  /* ── Nav: enlarge text only (original site 10px base makes it too small) ── */
  function fixNavFontSize() {
    var id = 'stwadd-nav-fix';
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = [
      '@media (min-width: 992px) {',
      /* Only target the actual nav link text inside the header */
      '  .unit-header-nav .unit-header-nav__item-link {',
      '    font-size: 16px !important;',
      '    font-weight: 600 !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(s);
  }

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

  // Also intercept any dynamic form creation
  document.addEventListener('submit', function(e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('inquiry')) {
      handleFormSubmit(e);
    }
  }, true);
})();
