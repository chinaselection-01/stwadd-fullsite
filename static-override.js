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

  function injectNavFix() {
    var id = 'static-nav-fix';
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = [
      '/* Nav fix: only target header nav items, do NOT change root html font-size */',
      '@media (min-width: 992px) {',
      '  .unit-header-nav .swiper-container {',
      '    overflow: visible !important;',
      '  }',
      '  .unit-header-nav .swiper-wrapper {',
      '    display: flex !important;',
      '    transform: none !important;',
      '    width: auto !important;',
      '  }',
      '  .unit-header-nav .swiper-slide {',
      '    width: auto !important;',
      '    margin-right: 0 !important;',
      '  }',
      '  .unit-header-nav .swiper-button-prev,',
      '  .unit-header-nav .swiper-button-next {',
      '    display: none !important;',
      '  }',
      '  .unit-header-nav__item {',
      '    padding: 14px 18px !important;',
      '  }',
      '  .unit-header-nav__item-link,',
      '  .unit-header-nav__item-link span,',
      '  .unit-header-nav__item a {',
      '    font-size: 18px !important;',
      '    font-weight: 600 !important;',
      '    letter-spacing: 0.5px !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function replaceHeroBanner() {
    var banner = document.getElementById('unit-FItKpYZGSP');
    if (!banner) return;
    if (banner.getAttribute('data-hero-fixed') === '1') return;
    banner.setAttribute('data-hero-fixed', '1');

    var BANNER_IMGS = [
      '/assets/images/banner-slide-1.jpg',
      '/assets/images/banner-slide-2.jpg',
      '/assets/images/banner-slide-3.jpg'
    ];

    // Replace all banner images
    var imgs = banner.querySelectorAll('img[from="banner_list"]');
    for (var i = 0; i < imgs.length; i++) {
      if (i < BANNER_IMGS.length) {
        imgs[i].src = BANNER_IMGS[i];
        imgs[i].setAttribute('lazy-src', BANNER_IMGS[i]);
        imgs[i].removeAttribute('data-hidden');
      }
    }

    // Remove external picture sources (Slide 1 has a <picture> with yfisher webp sources)
    var pictures = banner.querySelectorAll('picture');
    for (var j = 0; j < pictures.length; j++) {
      var sources = pictures[j].querySelectorAll('source');
      for (var k = 0; k < sources.length; k++) {
        sources[k].remove();
      }
    }
  }

  function init() {
    injectNavFix();
    replaceHeroBanner();
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
