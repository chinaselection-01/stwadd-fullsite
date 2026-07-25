/**
 * STWADD Static Site - Form Override
 * Replaces the weyescloud API inquiry forms with mailto: functionality
 */
(function() {
  'use strict';

  var INQUIRY_EMAIL = 'sales1@stwadd.com';
  var INQUIRY_CC = 'bob@stwadd.com';

  function getFormType(form) {
    var id = form.id || '';
    if (id.indexOf('customized') > -1) return 'Customized Product Inquiry';
    if (id.indexOf('widgetSocialMediaChat') > -1) return 'Quick Inquiry';
    return 'Product Inquiry';
  }

  function getProductName() {
    var title = document.title || 'STWADD Product';
    return title;
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

    var subject = getFormType() + ' - ' + getProductName();
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

    // Show feedback
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
