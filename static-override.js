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
    if (banner.getAttribute('data-hero-replaced') === '1') return;

    var inner = banner.querySelector('.unit-list.module-banner-3-unit-1');
    if (inner) {
      inner.removeAttribute('id');
      inner.classList.remove('is-swiper');
    }

    banner.setAttribute('data-hero-replaced', '1');

    banner.innerHTML = ''
      + '<a class="hero-banner" href="/product.html" aria-label="Browse products">'
      + '  <img class="hero-banner__img" src="/assets/images/hero-banner.jpg" alt="STWADD Premium Insulated Bottle Manufacturer" loading="eager" fetchpriority="high">'
      + '  <span class="hero-banner__cta">Read More</span>'
      + '</a>';

    injectHeroBannerCSS();
  }

  function injectHeroBannerCSS() {
    var id = 'static-hero-banner-css';
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = [
      '/* Hero banner replacement (local image, no external CDN) */',
      '#unit-FItKpYZGSP { padding: 0 !important; margin: 0 !important; }',
      '#unit-FItKpYZGSP .hero-banner {',
      '  position: relative;',
      '  display: block;',
      '  width: 100%;',
      '  max-width: 1920px;',
      '  margin: 0 auto;',
      '  overflow: hidden;',
      '  background: #f5f5f5;',
      '  text-decoration: none;',
      '  cursor: pointer;',
      '}',
      '#unit-FItKpYZGSP .hero-banner__img {',
      '  display: block;',
      '  width: 100%;',
      '  height: auto;',
      '  max-height: 800px;',
      '  object-fit: cover;',
      '  object-position: center;',
      '}',
      '#unit-FItKpYZGSP .hero-banner__cta {',
      '  position: absolute;',
      '  left: 5%;',
      '  bottom: 9%;',
      '  padding: 14px 38px;',
      '  background: #ffffff;',
      '  color: #b46e1e;',
      '  font-size: 22px;',
      '  font-weight: 600;',
      '  border-radius: 30px;',
      '  box-shadow: 0 4px 18px rgba(0,0,0,.18);',
      '  transition: transform .2s ease, box-shadow .2s ease;',
      '  pointer-events: none;',
      '}',
      '#unit-FItKpYZGSP .hero-banner:hover .hero-banner__cta {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 6px 22px rgba(0,0,0,.25);',
      '}',
      '@media (max-width: 768px) {',
      '  #unit-FItKpYZGSP .hero-banner__cta {',
      '    font-size: 14px;',
      '    padding: 8px 22px;',
      '    bottom: 6%;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
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
