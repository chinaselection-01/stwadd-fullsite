/* =====================================================================
 * STWADD — Free AI Mockup Request
 * Lets a buyer pick a real cup shape, upload their logo, leave contact
 * details, and ask us to render an AI logo-on-cup mockup for them.
 *
 * Pipeline (reuses the exact same tables as the AI chat widget so the
 * owner sees everything in inbox.html):
 *   - stwadd_leads        : one row per request, tagged product_interest
 *   - stwadd_messages     : one readable summary row for the inbox thread
 *   - stwadd_attachments  : compressed logo images (data_url)
 *   - NetEase requestClue : visitor identification / lead capture
 *
 * No backend of our own: Cloud SDK is loaded from the same CDN as the
 * chat widget; images are compressed client-side before insert.
 * ===================================================================== */
(function () {
  'use strict';

  var CFG = {
    endpoint: 'https://stwadd-chat.app.workbuddy.host',
    publishableKey: 'wbpk_J6ky3EWeJsnmORWHsXGmDY_PLHjgvRuyhmQKeU6NLyw3btiPQ40q3cy',
    sdkUrl: 'https://cdn.jsdelivr.net/npm/@tencent-ai/workbuddy-cloud-sdk@dev/lib/index.global.js'
  };

  var cloud = null, sdkLoading = false, sdkWaiters = [];

  function loadSDK(cb) {
    if (cloud) return cb(true);
    sdkWaiters.push(cb);
    if (sdkLoading) return;
    sdkLoading = true;
    var s = document.createElement('script');
    s.src = CFG.sdkUrl;
    s.onload = function () {
      try { cloud = WorkBuddyCloud.createWorkBuddyCloud(CFG); } catch (e) {}
      sdkWaiters.splice(0).forEach(function (f) { f(!!cloud); });
    };
    s.onerror = function () { sdkWaiters.splice(0).forEach(function (f) { f(false); }); };
    document.head.appendChild(s);
  }

  // Compress uploaded images to <=1000px JPEG so they store cleanly as data URLs.
  function readImages(fileList, done) {
    var files = Array.prototype.slice.call(fileList || []).slice(0, 3);
    var out = [], left = files.length;
    if (!left) return done(out);
    files.forEach(function (file) {
      var bad = function () { if (!--left) done(out); };
      if (!/^image\//.test(file.type) || file.size > 8 * 1024 * 1024) return bad();
      var r = new FileReader();
      r.onload = function (e) {
        var im = new Image();
        im.onload = function () {
          var max = 1000, w = im.width, h = im.height;
          if (w > max || h > max) { var sc = Math.min(max / w, max / h); w = Math.round(w * sc); h = Math.round(h * sc); }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(im, 0, 0, w, h);
          var du = c.toDataURL('image/jpeg', 0.72);
          out.push({ name: file.name || 'logo.jpg', mime: 'image/jpeg', size: Math.round(du.length * 0.75), dataUrl: du });
          bad();
        };
        im.onerror = bad;
        im.src = e.target.result;
      };
      r.onerror = bad;
      r.readAsDataURL(file);
    });
  }

  function neteaseClue(data) {
    var tries = 0;
    (function attempt() {
      try {
        var sdk = window.__siteSDK__;
        if (sdk && typeof sdk.requestClue === 'function') {
          sdk.requestClue({ name: data.name || '', company: data.company || '', mail: data.email });
          return;
        }
      } catch (e) {}
      if (++tries < 30) setTimeout(attempt, 200);
    })();
  }

  function submit(data, images, cb) {
    loadSDK(function (ok) {
      if (!ok) return cb(false, 'sdk');
      var sid = 'mockup-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
      var summary = [
        '[AI MOCKUP REQUEST]',
        'Cup shape: ' + data.shape,
        'Name: ' + data.name,
        'Email: ' + data.email,
        'Company: ' + (data.company || '-'),
        'WhatsApp: ' + (data.whatsapp || '-'),
        'Est. quantity: ' + (data.quantity || '-'),
        'Placement / notes: ' + (data.message || '-'),
        'Uploaded logo files: ' + images.length
      ].join('\n');

      var leadInsert;
      try {
        leadInsert = cloud.database.from('stwadd_leads').insert({
          session_id: sid, name: data.name, email: data.email,
          company: data.company || null, country: null, city: null,
          whatsapp: data.whatsapp || null,
          product_interest: 'AI Mockup Request — ' + data.shape,
          quantity: data.quantity || null, target_port: null,
          message: data.message || null, page_url: location.href, lang: 'en'
        });
      } catch (e) { return cb(false, 'insert'); }

      // Secondary rows: fire-and-forget (same as the chat widget).
      try {
        cloud.database.from('stwadd_messages').insert({ session_id: sid, role: 'user', content: summary }).then(function () {}, function () {});
      } catch (e) {}
      images.forEach(function (f) {
        try {
          cloud.database.from('stwadd_attachments').insert({
            session_id: sid, filename: f.name, mime: f.mime, size_bytes: f.size, data_url: f.dataUrl
          }).then(function () {}, function () {});
        } catch (e) {}
      });
      neteaseClue(data);

      // Only confirm success once the lead row is actually accepted.
      try {
        Promise.resolve(leadInsert).then(function () { cb(true, sid); }, function () { cb(false, 'insert'); });
      } catch (e) { cb(true, sid); }
    });
  }

  // Public init: page supplies the form element + a <select> to fill with shapes.
  window.STWADD_MOCKUP = {
    fillShapes: function (select, shapes) {
      if (!select) return;
      shapes.forEach(function (s) {
        var o = document.createElement('option');
        o.value = s.name; o.textContent = s.name + ' (' + s.cap + ')';
        select.appendChild(o);
      });
      var other = document.createElement('option');
      other.value = 'Not sure — help me choose'; other.textContent = 'Not sure — help me choose';
      select.appendChild(other);
    },
    pickShape: function (select, name) {
      if (!select) return;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === name) { select.selectedIndex = i; break; }
      }
    },
    submit: submit,
    readImages: readImages
  };
})();
