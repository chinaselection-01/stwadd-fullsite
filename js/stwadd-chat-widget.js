/*!
 * STWADD AI Online Reception — floating widget
 * Self-contained: injects a floating button + chat panel on any page.
 * Backend: WorkBuddy Cloud SDK. No sharecode / no password gate.
 */
(function () {
  "use strict";

  var PUBLIC_CONFIG = {
    endpoint: "https://stwadd-chat.app.workbuddy.host",
    oauthRelayBaseUrl: "https://www.workbuddy.cn/v2/as/genie-baas/oauth",
    publishableKey: "wbpk_J6ky3EWeJsnmORWHsXGmDY_PLHjgvRuyhmQKeU6NLyw3btiPQ40q3cy"
  };

  var SYSTEM_PROMPT = [
    "You are STWADD AI, the online reception and pre-sales assistant of Yongkang STWADD Houseware Co., Ltd. — a professional drinkware factory in Yongkang, Zhejiang, China serving buyers worldwide. You are embedded in the company's website and speak with importers, brand owners, wholesalers, supermarket buying teams, distributors and online sellers.",
    "",
    "HOW TO DESCRIBE THE COMPANY (use these, never the others):",
    "- \"Your factory in Yongkang\" / \"the factory that makes your bottles\" / \"we run the factory for you\".",
    "- STWADD is a factory-backed drinkware supply company: production is done to the buyer's specification by audited partner factories in Yongkang, with STWADD's own QC team stationed on the line, its own tooling control, its own scheduling and AQL 2.5 inspection before the container is sealed.",
    "- NEVER say STWADD owns the factory, owns production lines, or is \"not a trading company\". If a buyer asks directly, answer warmly and honestly: we do not own the plant, we qualify it, staff it and take responsibility for the container — and invite them to visit or audit the factory.",
    "",
    "PRODUCT RANGE:",
    "- Insulated stainless steel bottles, vacuum flasks, 20oz and 40oz tumblers (with handle and straw), car cups, coffee mugs, travel mugs, wine flasks, beer growlers, ice buckets / champagne coolers, kids bottles, BPA-free Tritan plastic bottles, sports and shaker bottles. 192 models in the 2026 catalogue.",
    "- Materials: food-grade 304 and 316 stainless steel, lead-free, PFAS-free, BPA-free Tritan, RCS-certified recycled 316 available.",
    "- Decoration: laser engraving, silk screen, UV print, heat transfer, spray paint, full-colour printing; retail gift-box packaging; NDA on the buyer's artwork; over 50 new designs a year.",
    "- Patent-safe OEM alternatives in the style of Stanley, Owala and Hydro Flask.",
    "",
    "FREE SAMPLES — this is a key selling point, mention it proactively:",
    "- The sample itself is FREE. The buyer pays ONLY the courier (DHL / FedEx / UPS account, or we calculate the freight to their address). No deposit, no advance payment, no obligation to order.",
    "- Any model from the 2026 catalogue can be sampled. Stock-model samples ship in 1-3 days; custom-printed samples 7-10 days.",
    "- A custom-tooling sample carries the mould cost (quoted separately), then the sample itself is free.",
    "- Suggest this whenever a buyer is hesitant, is comparing suppliers, asks about quality, or says the MOQ feels risky.",
    "",
    "REAL NUMBERS YOU MAY QUOTE (these are our published figures — quote them exactly):",
    "- Sample from ready stock: 1-3 days.",
    "- Custom sample: 7-10 days.",
    "- Bulk production: 25-30 days.",
    "- Ready stock dispatch: 7-15 days including preparation and packing.",
    "- MOQ for custom printing on existing models: 10-500 pieces. MOQ for a new shape with new tooling: 3,000 pieces.",
    "- Colour customisation setup on plastic products: USD 50. Spray-paint colour customisation: USD 30.",
    "- Tooling: stainless steel outer-shell mould USD 1,000; full stainless steel mould USD 2,000; plastic part mould USD 2,000. Once paid, the mould belongs to the buyer.",
    "",
    "CERTIFICATIONS AND TESTING:",
    "- ISO 9001 quality management; SGS and TUV food-contact testing; LFGB; products are tested to US FDA food-contact requirements.",
    "- NEVER say \"FDA certified\" — FDA sets food-contact requirements and does not certify products.",
    "- NEVER claim BSCI or Sedex is held. Say: social-compliance audits (BSCI, SGS, TUV, BV, Intertek) can be arranged on request before the buyer commits.",
    "",
    "ALSO AVAILABLE — China buying office for retail chains: 12 non-food categories (kitchenware, home storage, cleaning, pet supplies, toys and kids, textiles, beauty tools, garden, electronics, hardware, seasonal), supplier matching, RFQ handling, AQL 2.5 inspection, private label, and multi-supplier container consolidation at a transparent 3-5% commission.",
    "",
    "KIDS, FAMILY AND SCHOOL QUESTIONS — answer these, they are common and profitable:",
    "- School and kids bottles: recommend 350-500ml light-weight stainless or Tritan bottles with a straw lid or flip lid, BPA-free, non-slip base, sized for a school bag or a bike bottle cage.",
    "- Sports and outdoor: 500-750ml vacuum tumblers with handles and car holders, or 800ml sports flasks for cycling and gym.",
    "- Family trips and camping: 1-1.5L flasks plus matching 500ml tumblers in the same colourway so a family set looks coherent.",
    "- Toddler and stroller use: 250-350ml Tritan plastic bottles, wide mouth, easy-grip handles.",
    "- If a visitor asks for parenting, family education or child-development advice, be warm but brief: you can only help with the drinkware and product side (what to choose for a child's age, bottle safety materials, school-day use). Do not give parenting, education or medical advice.",
    "",
    "RULES — follow strictly:",
    "1. NEVER quote a unit price or a price range for goods. Only the setup/tooling figures listed above may be quoted. Unit prices are made per order from quantity, specification and destination port.",
    "2. NEVER invent certifications, customers, factory names, capacity figures, market data or test results. If you do not know, say the team will confirm in writing.",
    "3. Keep answers short: 2-5 sentences or a short bullet list. This is a chat widget, not an essay.",
    "4. Be concrete and helpful, never pushy. End every answer with the next step: ask for capacity and quantity, or invite them to leave an email for a written quotation.",
    "5. Collect lead details early: if the visitor has not given an email after 4-6 exchanges, gently suggest the \"Get a quotation\" button so the sales manager can send a real factory-direct quote.",
    "6. If a visitor uploads a photo, acknowledge it and say the team will review it and come back with matching models and a quotation.",
    "7. Answer in the language the visitor writes in.",
    "8. If asked about something unrelated to drinkware, sourcing or the buying office, say briefly that you can only help with STWADD's products and sourcing services."
  ].join("\n");

  var QUICK = [
    { t: "What is your MOQ?", s: "What is your minimum order quantity for custom logo printing?" },
    { t: "Lead times?", s: "How long do samples, bulk production and ready-stock dispatch take?" },
    { t: "Mould & tooling cost?", s: "How much does a new mould cost for a stainless steel or plastic product? What is the MOQ for a new shape?" },
    { t: "Colour customisation cost?", s: "What does colour customisation cost for plastic products and for spray paint?" },
    { t: "Free samples?", s: "Can I get a free sample before I place an order? What exactly do I pay for?" },
    { t: "Ready stock?", s: "Do you have ready stock and how fast can you dispatch?" },
    { t: "Bottle for my kids", s: "Which bottle would you recommend for a child going to school or for sports? I want something safe and easy to carry." },
    { t: "Recommend a product", s: "Please recommend the right bottle for my use case and quantity." },
    { t: "Send me a quotation", s: "Please send me a quotation. I will leave my contact details." },
    { t: "Are you the factory?", s: "Are you the factory or a trading company?" }
  ];

  // language
  var lang = (document.documentElement.lang || navigator.language || "en").toLowerCase();
  var isZh = lang.indexOf("zh") === 0;

  // ----- build styles -----
  var CSS = [
    "#stwaddBubble{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:58px;height:58px;border:0;border-radius:50%;",
    "background:#c41e3a;color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(196,30,58,.45);display:flex;align-items:center;justify-content:center;transition:transform .15s ease}",
    "#stwaddBubble:hover{transform:scale(1.06)}",
    "#stwaddBubble svg{width:28px;height:28px;fill:#fff}",
    "#stwaddBubble .badge{position:absolute;top:-2px;right:-2px;background:#3ddc84;color:#06351a;font-size:10px;font-weight:700;border-radius:10px;padding:1px 5px;line-height:1.4;display:none}",
    "#stwaddPanel{position:fixed;right:20px;bottom:90px;z-index:2147483000;width:380px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 110px);",
    "background:#fff;border-radius:16px;box-shadow:0 18px 60px rgba(10,16,24,.28);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Helvetica Neue',Arial,sans-serif}",
    "#stwaddPanel.open{display:flex}",
    "#stwaddPanel .hd{background:#141b26;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px;flex:0 0 auto}",
    "#stwaddPanel .hd .av{width:34px;height:34px;border-radius:8px;background:#c41e3a;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex:0 0 auto}",
    "#stwaddPanel .hd h1{margin:0;font-size:14px;font-weight:600}",
    "#stwaddPanel .hd .sub{font-size:11.5px;color:#9fb0c3;margin-top:1px;display:flex;align-items:center;gap:5px}",
    "#stwaddPanel .hd .dot{width:7px;height:7px;border-radius:50%;background:#3ddc84;display:inline-block}",
    "#stwaddPanel .hd .sp{flex:1}",
    "#stwaddPanel .hd button{background:rgba(255,255,255,.12);border:0;color:#fff;border-radius:6px;padding:6px 10px;font-size:16px;cursor:pointer}",
    "#stwaddPanel #log{flex:1 1 auto;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f6f8fa}",
    "#stwaddPanel .msg{max-width:86%;padding:9px 12px;border-radius:12px;font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word}",
    "#stwaddPanel .msg.bot{background:#fff;border:1px solid #e4e8ec;align-self:flex-start;border-bottom-left-radius:4px}",
    "#stwaddPanel .msg.me{background:#c41e3a;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}",
    "#stwaddPanel .msg.sys{align-self:center;background:#eef1f4;color:#5b6b7a;font-size:12px;max-width:94%;text-align:center;border-radius:8px}",
    "#stwaddPanel .typing{align-self:flex-start;background:#fff;border:1px solid #e4e8ec;border-radius:12px;padding:10px 13px;display:flex;gap:4px}",
    "#stwaddPanel .typing i{width:6px;height:6px;border-radius:50%;background:#9aa8b5;animation:stwbl 1.1s infinite}",
    "#stwaddPanel .typing i:nth-child(2){animation-delay:.18s}#stwaddPanel .typing i:nth-child(3){animation-delay:.36s}",
    "@keyframes stwbl{0%,60%,100%{opacity:.28;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}",
    "#stwaddPanel .thumbs{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}",
    "#stwaddPanel .thumbs img{width:62px;height:62px;object-fit:cover;border-radius:8px;border:1px solid rgba(255,255,255,.5)}",
    "#stwaddPanel .chips{flex:0 0 auto;display:flex;gap:7px;overflow-x:auto;padding:9px 12px;background:#fff;border-top:1px solid #eef1f4;scrollbar-width:none}",
    "#stwaddPanel .chips::-webkit-scrollbar{display:none}",
    "#stwaddPanel .chip{flex:0 0 auto;background:#f2f5f8;border:1px solid #e2e8ee;color:#33475b;font-size:12.5px;padding:7px 12px;border-radius:16px;cursor:pointer;white-space:nowrap;font-family:inherit}",
    "#stwaddPanel .chip:hover{background:#e7edf3}",
    "#stwaddPanel .composer{flex:0 0 auto;background:#fff;border-top:1px solid #e4e8ec;padding:9px 10px;display:flex;gap:8px;align-items:flex-end}",
    "#stwaddPanel #fileBtn{width:38px;height:38px;border-radius:9px;border:1px solid #e2e8ee;background:#f7f9fb;color:#33475b;font-size:17px;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center}",
    "#stwaddPanel #sendBtn{width:38px;height:38px;border-radius:9px;border:0;background:#c41e3a;color:#fff;font-size:15px;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center}",
    "#stwaddPanel #sendBtn:disabled{opacity:.45;cursor:default}",
    "#stwaddPanel #input{flex:1 1 auto;border:1px solid #dde3e9;border-radius:9px;padding:9px 11px;font-size:14px;resize:none;max-height:96px;min-height:38px;font-family:inherit;color:#1f2933;outline:none}",
    "#stwaddPanel #input:focus{border-color:#c41e3a}",
    "#stwaddPanel .attachbar{display:none;gap:6px;padding:0 12px 8px;background:#fff;flex-wrap:wrap}",
    "#stwaddPanel .attachbar.on{display:flex}",
    "#stwaddPanel .att{position:relative;width:52px;height:52px;border-radius:8px;overflow:hidden;border:1px solid #e2e8ee}",
    "#stwaddPanel .att img{width:100%;height:100%;object-fit:cover}",
    "#stwaddPanel .att b{position:absolute;top:1px;right:1px;background:rgba(0,0,0,.62);color:#fff;border-radius:50%;width:17px;height:17px;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:400}",
    "#stwaddMask{position:fixed;inset:0;background:rgba(10,16,24,.46);display:none;align-items:flex-end;justify-content:center;z-index:2147483001}",
    "#stwaddMask.on{display:flex}",
    "#stwaddMask .sheet{background:#fff;width:100%;max-width:560px;border-radius:16px 16px 0 0;padding:18px 16px 20px;max-height:88vh;overflow-y:auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Helvetica Neue',Arial,sans-serif}",
    "#stwaddMask h2{margin:0 0 4px;font-size:16px}",
    "#stwaddMask p.tip{margin:0 0 14px;font-size:12.5px;color:#5b6b7a}",
    "#stwaddMask .fld{margin-bottom:11px}",
    "#stwaddMask .fld label{display:block;font-size:12px;color:#48596b;margin-bottom:4px;font-weight:500}",
    "#stwaddMask .fld input,#stwaddMask .fld select{width:100%;border:1px solid #dde3e9;border-radius:8px;padding:9px 10px;font-size:14px;font-family:inherit;color:#1f2933;outline:none;background:#fff}",
    "#stwaddMask .fld input:focus,#stwaddMask .fld select:focus{border-color:#c41e3a}",
    "#stwaddMask .fld .req{color:#c41e3a}",
    "#stwaddMask .row2{display:grid;grid-template-columns:1fr 1fr;gap:11px}",
    "#stwaddMask .acts{display:flex;gap:10px;margin-top:6px}",
    "#stwaddMask .acts button{flex:1;border:0;border-radius:9px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}",
    "#stwaddMask .acts .go{background:#c41e3a;color:#fff}",
    "#stwaddMask .acts .skip{background:#eef1f4;color:#5b6b7a}",
    "#stwaddMask .done{text-align:center;padding:22px 10px 10px}",
    "#stwaddMask .done .ok{width:52px;height:52px;border-radius:50%;background:#e6f6ec;color:#1a7f43;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 12px}",
    "#stwaddMask .done h3{margin:0 0 6px;font-size:16px}",
    "#stwaddMask .done p{margin:0 0 14px;font-size:13px;color:#5b6b7a;line-height:1.6}",
    "#stwaddMask .wa{display:inline-flex;align-items:center;gap:7px;background:#25d366;color:#fff;text-decoration:none;padding:11px 18px;border-radius:9px;font-weight:600;font-size:14px}",
    "#stwaddMask .note9{font-size:11.5px;color:#8b98a5;margin-top:12px;line-height:1.5}",
    "@media (max-width:480px){#stwaddPanel{right:8px;left:8px;width:auto;bottom:84px}}"
  ].join("");

  // ----- build DOM -----
  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var bubble = document.createElement("button");
  bubble.id = "stwaddBubble";
  bubble.setAttribute("aria-label", "Chat with STWADD AI");
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.7 2 11c0 2.3 1.2 4.4 3.1 5.8L4 21l4.6-2.1c1 .3 2.1.4 3.4.4 5.5 0 10-3.7 10-8.3S17.5 3 12 3z"/></svg><span class="badge" id="stwaddBadge">' + (isZh ? "AI" : "AI") + "</span>";
  document.body.appendChild(bubble);

  var panel = document.createElement("div");
  panel.id = "stwaddPanel";
  panel.innerHTML =
    '<div class="hd"><div class="av">STW</div><div><h1>' + (isZh ? "圣瓦达 · AI 在线接待" : "STWADD · Online Reception") + '</h1>' +
    '<div class="sub"><span class="dot"></span><span id="stwaddStatus">' + (isZh ? "秒回 · 7×24 小时" : "Instant answers · 7/24") + '</span></div></div>' +
    '<div class="sp"></div><button id="stwaddClose" title="Close">×</button></div>' +
    '<div id="log"></div>' +
    '<div class="chips" id="chips"></div>' +
    '<div class="attachbar" id="attachBar"></div>' +
    '<div class="composer"><button id="fileBtn" title="Send a photo">📎</button>' +
    '<input type="file" id="file" accept="image/*" multiple style="display:none">' +
    '<textarea id="input" rows="1" placeholder="' + (isZh ? "问起订量、交期、样品、定制…" : "Ask about MOQ, lead time, samples, custom logo…") + '"></textarea>' +
    '<button id="sendBtn" title="Send">➤</button></div>';

  document.body.appendChild(panel);

  var mask = document.createElement("div");
  mask.id = "stwaddMask";
  mask.innerHTML =
    '<div class="sheet"><div id="formWrap"><h2>' + (isZh ? "获取报价" : "Get a quotation") + '</h2>' +
    '<p class="tip">' + (isZh ? "留个联系方式，销售经理一个工作日内发你工厂价。" : "Leave your details and our sales manager replies with a factory-direct quote — usually within one working day.") + '</p>' +
    '<div class="row2"><div class="fld"><label>' + (isZh ? "姓名" : "Name") + ' <span class="req">*</span></label><input id="fName" autocomplete="name"></div>' +
    '<div class="fld"><label>Email <span class="req">*</span></label><input id="fEmail" type="email" autocomplete="email"></div></div>' +
    '<div class="fld"><label>' + (isZh ? "公司" : "Company") + '</label><input id="fCompany" autocomplete="organization"></div>' +
    '<div class="row2"><div class="fld"><label>' + (isZh ? "国家" : "Country") + '</label><input id="fCountry" autocomplete="country-name"></div>' +
    '<div class="fld"><label>' + (isZh ? "城市" : "City") + '</label><input id="fCity"></div></div>' +
    '<div class="row2"><div class="fld"><label>WhatsApp / ' + (isZh ? "电话" : "Phone") + '</label><input id="fWa"></div>' +
    '<div class="fld"><label>' + (isZh ? "数量(件)" : "Quantity (pcs)") + '</label><input id="fQty" inputmode="numeric"></div></div>' +
    '<div class="row2"><div class="fld"><label>' + (isZh ? "产品意向" : "Product interest") + '</label>' +
    '<select id="fProduct"><option>' + (isZh ? "保温杯/水壶" : "Insulated bottle / flask") + '</option><option>' + (isZh ? "直饮杯/车载杯" : "Tumbler / car cup") + '</option><option>' + (isZh ? "咖啡杯/旅行杯" : "Coffee mug / travel mug") + '</option><option>' + (isZh ? "冰桶/酒壶" : "Ice bucket / wine flask") + '</option><option>Tritan ' + (isZh ? "塑料瓶" : "plastic bottle") + '</option><option>' + (isZh ? "中国买办(多品类)" : "China buying office (multi-category)") + '</option><option>OEM / ODM ' + (isZh ? "贴牌" : "private label") + '</option><option>Other</option></select></div>' +
    '<div class="fld"><label>' + (isZh ? "目的港" : "Destination port") + '</label><input id="fPort"></div></div>' +
    '<div class="fld"><label>Message</label><input id="fMsg" placeholder="' + (isZh ? "如：5000 个 750ml 瓶，logo+礼盒" : "e.g. 5000 pcs 750ml bottle, logo + gift box") + '"></div>' +
    '<div class="acts"><button class="skip" id="skipBtn">' + (isZh ? "继续聊天" : "Continue chatting") + '</button><button class="go" id="submitBtn">' + (isZh ? "提交我的信息" : "Send my details") + '</button></div>' +
    '<p class="note9">' + (isZh ? "我们仅用这些信息准备报价，不会提供给第三方。" : "We use these details only to prepare your quotation. Nothing is shared with third parties.") + '</p>' +
    '</div><div id="doneWrap" style="display:none"></div></div>';
  document.body.appendChild(mask);

  // ----- state -----
  var logEl = document.getElementById("log");
  var input = document.getElementById("input");
  var sendBtn = document.getElementById("sendBtn");
  var fileInput = document.getElementById("file");
  var attachBar = document.getElementById("attachBar");
  var statusEl = document.getElementById("stwaddStatus");
  var pageUrl = location.href;

  var cloud = null, modelId = null;
  var history = [];
  var aiCalls = 0, MAX_AI = 10;
  var leadSaved = false, pendingFiles = [], busy = false, opened = false;
  var sessionId = (function () {
    try {
      var k = "stw_chat_sid"; var v = localStorage.getItem(k);
      if (!v) { v = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()); localStorage.setItem(k, v); }
      return v;
    } catch (e) { return String(Date.now()) + Math.random(); }
  })();
  var convId = "conv_" + sessionId;

  function scroll() { logEl.scrollTop = logEl.scrollHeight; }
  function push(role, text, files) {
    var d = document.createElement("div");
    d.className = "msg " + (role === "me" ? "me" : role === "sys" ? "sys" : "bot");
    d.textContent = text;
    if (files && files.length) {
      var w = document.createElement("div"); w.className = "thumbs";
      files.forEach(function (f) { var im = document.createElement("img"); im.src = f.dataUrl; im.alt = f.name; w.appendChild(im); });
      d.appendChild(w);
    }
    logEl.appendChild(d); scroll(); return d;
  }
  function notice(t) { push("sys", t); }
  function setStatus(t) { statusEl.textContent = t; }

  // ----- persistence (insert-only) -----
  function save(role, content) {
    if (!cloud) return;
    try { cloud.database.from("stwadd_messages").insert({ session_id: sessionId, role: role, content: String(content).slice(0, 8000) }).then(function () {}, function () {}); } catch (e) {}
  }
  function saveAttachment(f) {
    if (!cloud) return;
    try { cloud.database.from("stwadd_attachments").insert({ session_id: sessionId, filename: f.name, mime: f.mime, size_bytes: f.size, data_url: f.dataUrl }).then(function () {}, function () {}); } catch (e) {}
  }
  function saveLead(data) {
    return cloud.database.from("stwadd_leads").insert({
      session_id: sessionId, name: data.name || null, email: data.email || null, company: data.company || null,
      country: data.country || null, city: data.city || null, whatsapp: data.whatsapp || null,
      product_interest: data.product || null, quantity: data.quantity || null,
      target_port: data.port || null, message: data.msg || null, page_url: pageUrl || null, lang: lang || null
    });
  }

  // ----- AI -----
  function initCloud() {
    try { cloud = WorkBuddyCloud.createWorkBuddyCloud(PUBLIC_CONFIG); setStatus(isZh ? "秒回 · 7×24 小时" : "Instant answers · 7/24"); }
    catch (e) { setStatus(isZh ? "离线 · 请留联系方式" : "Offline — leave your details below"); }
  }
  function loadModel(cb) {
    if (!cloud) return cb(false);
    try {
      cloud.llm.models.list().then(function (models) {
        var m = (models || []).find(function (x) { return x.disabled !== true; });
        if (!m) return cb(false);
        modelId = m.id; cb(true);
      }).catch(function () { cb(false); });
    } catch (e) { cb(false); }
  }
  function ask(text) {
    if (busy) return; busy = true; sendBtn.disabled = true;
    var typing = document.createElement("div");
    typing.className = "typing"; typing.innerHTML = "<i></i><i></i><i></i>";
    logEl.appendChild(typing); scroll();

    history.push({ role: "user", content: text });
    if (history.length > 12) history.splice(0, history.length - 12);
    save("user", text);

    if (!cloud || !modelId || aiCalls >= MAX_AI) {
      typing.remove();
      push("bot", isZh ? "我们的 AI 助手暂时繁忙。请留邮箱和数量，我马上人工给你报工厂价。" : "Our AI assistant is busy right now. Leave your email and quantity and our sales manager will send a factory-direct quote personally.");
      setStatus(isZh ? "留信息给人工" : "Leaving details for a human");
      openForm();
      busy = false; sendBtn.disabled = false;
      return;
    }
    aiCalls++;
    var messages = [{ role: "system", content: SYSTEM_PROMPT }].concat(history);
    var bubbleOut = push("bot", "");
    var out = "";
    (async function () {
      try {
        for await (var chunk of cloud.llm.chat.completions.create({ model: modelId, messages: messages, stream: true, conversationId: convId, temperature: 1 })) {
          var c = chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content;
          if (c) { out += c; bubbleOut.textContent = out; scroll(); }
        }
        bubbleOut.textContent = out || (isZh ? "请留下联系方式，我马上给你报价。" : "Please leave your contact details and I will get you a quote.");
        save("assistant", out);
        history.push({ role: "assistant", content: out });
        if (history.length > 12) history.splice(0, history.length - 12);
      } catch (e) {
        bubbleOut.textContent = isZh ? "网络有点问题，你可以直接留下邮箱，我人工回复。" : "Something went wrong on my side. Leave your email and our team will reply directly.";
        openForm();
      } finally { typing.remove(); busy = false; sendBtn.disabled = false; scroll(); }
    })();
  }

  // ----- images -----
  function handleFiles(files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;
    if (pendingFiles.length + list.length > 4) notice(isZh ? "每次最多发 4 张图，可分多次发。" : "Up to 4 photos per chat — send them in separate messages.");
    list.slice(0, Math.max(0, 4 - pendingFiles.length)).forEach(function (file) {
      if (!/^image\//.test(file.type)) { notice(isZh ? "只能发图片(JPG/PNG/WEBP)。" : "Only image files (JPG / PNG / WEBP) can be sent."); return; }
      if (file.size > 8 * 1024 * 1024) { notice(isZh ? "图片超过 8MB，请发小一点的图。" : "That file is over 8MB — please send a smaller photo."); return; }
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          var max = 1000, w = img.width, h = img.height;
          if (w > max || h > max) { var s = Math.min(max / w, max / h); w = Math.round(w * s); h = Math.round(h * s); }
          var c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          var dataUrl = c.toDataURL("image/jpeg", 0.72);
          pendingFiles.push({ name: file.name || "photo.jpg", mime: "image/jpeg", size: Math.round(dataUrl.length * 0.75), dataUrl: dataUrl });
          renderAtt();
        };
        img.onerror = function () { notice(isZh ? "图片读不出来，换一张试试。" : "That image could not be read. Try another file."); };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function renderAtt() {
    attachBar.innerHTML = "";
    pendingFiles.forEach(function (f, i) {
      var d = document.createElement("div"); d.className = "att";
      var im = document.createElement("img"); im.src = f.dataUrl; d.appendChild(im);
      var b = document.createElement("b"); b.textContent = "×";
      b.onclick = function () { pendingFiles.splice(i, 1); renderAtt(); };
      d.appendChild(b); attachBar.appendChild(d);
    });
    attachBar.classList.toggle("on", pendingFiles.length > 0);
  }

  // ----- lead form -----
  function openForm() { mask.classList.add("on"); setTimeout(function () { try { document.getElementById("fName").focus(); } catch (e) {} }, 60); }
  function closeForm() { mask.classList.remove("on"); }
  document.getElementById("skipBtn").onclick = function () {
    closeForm();
    push("bot", isZh ? "好，随时找我。要报价就点下面的按钮留邮箱。" : "No problem — ask me anything. Use \"Get a quotation\" whenever you want a real price.");
  };
  document.getElementById("submitBtn").onclick = function () {
    var name = document.getElementById("fName").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      notice(isZh ? "请填写姓名和有效邮箱。" : "Please fill in your name and a valid email address.");
      return;
    }
    var data = {
      name: name, email: email,
      company: document.getElementById("fCompany").value.trim(),
      country: document.getElementById("fCountry").value.trim(),
      city: document.getElementById("fCity").value.trim(),
      whatsapp: document.getElementById("fWa").value.trim(),
      quantity: document.getElementById("fQty").value.trim(),
      product: document.getElementById("fProduct").value,
      port: document.getElementById("fPort").value.trim(),
      msg: document.getElementById("fMsg").value.trim()
    };
    pendingFiles.forEach(saveAttachment);
    if (!cloud) {
      document.getElementById("formWrap").style.display = "none";
      document.getElementById("doneWrap").style.display = "block";
      document.getElementById("doneWrap").innerHTML = doneHtml();
      return;
    }
    var msg = "Inquiry from website chat" + (data.product ? " — " + data.product : "") +
      (data.quantity ? ", quantity " + data.quantity : "") + (data.port ? ", port " + data.port : "");
    save("lead", msg);
    saveLead(data).then(function (res) {
      if (res && res.error) { notice(isZh ? "提交失败，请直接发邮件给我们。" : "Something went wrong — please email us directly."); return; }
      leadSaved = true; closeForm();
      push("bot", isZh ? "收到，" + name + "！需求已转给销售经理，工厂价会在一个工作日内发到 " + email + "。急的话直接 WhatsApp 我们。" : "Thank you, " + name + ". Your request is with our sales manager — the factory-direct quotation will reach " + email + " within one working day. In a hurry? WhatsApp us and we will start now.");
      document.getElementById("formWrap").style.display = "none";
      document.getElementById("doneWrap").style.display = "block";
      document.getElementById("doneWrap").innerHTML = doneHtml();
    });
  };
  function doneHtml() {
    return '<div class="done"><div class="ok">✓</div><h3>' + (isZh ? "已收到您的需求" : "We have your request") + '</h3>' +
      '<p>' + (isZh ? "销售经理会在一个工作日内把工厂报价发到您的邮箱。" : "Our sales manager will send the factory-direct quote to your email within one working day.") + '</p>' +
      '<a class="wa" href="https://wa.me/8615088228843" target="_blank" rel="noopener">WhatsApp +86 150 8822 8843</a>' +
      '<div style="margin-top:14px"><a class="chip" href="mailto:bob@stwadd.com">bob@stwadd.com</a></div>' +
      '<p class="note9">' + (isZh ? "我们仅使用这些信息准备报价，不会提供给第三方。" : "We use these details only to prepare your quotation, and never share them with third parties.") + '</p></div>';
  }

  // ----- wiring -----
  document.getElementById("fileBtn").onclick = function () { fileInput.click(); };
  fileInput.onchange = function () { handleFiles(fileInput.files); fileInput.value = ""; };
  document.getElementById("stwaddClose").onclick = function () { panel.classList.remove("open"); };
  function send() {
    var t = input.value.trim();
    if (!t && !pendingFiles.length) return;
    var files = pendingFiles.slice(); pendingFiles = []; renderAtt();
    if (t) { push("me", t, files); ask(t); }
    else { push("me", "(photo)", files); ask("The visitor uploaded a photo. Acknowledge it briefly and ask what product or specification it is."); }
    input.value = ""; input.style.height = "auto";
  }
  sendBtn.onclick = send;
  input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 96) + "px"; });

  var chips = document.getElementById("chips");
  QUICK.forEach(function (q) {
    var b = document.createElement("button");
    b.className = "chip"; b.textContent = isZh ? q.t : q.t;
    b.onclick = function () { input.value = q.s; send(); };
    chips.appendChild(b);
  });
  var quoteChip = document.createElement("button");
  quoteChip.className = "chip"; quoteChip.style.background = "#c41e3a"; quoteChip.style.color = "#fff"; quoteChip.style.borderColor = "#c41e3a";
  quoteChip.textContent = isZh ? "获取报价" : "Get a quotation";
  quoteChip.onclick = openForm;
  chips.appendChild(quoteChip);

  function greet() {
    push("bot", isZh
      ? "你好，我是圣瓦达 AI 在线接待，7×24 小时秒回。起订量、交期、模具费、颜色定制费、现货、定制样品——都能问；也可以告诉我使用场景，我帮你推荐型号；要正式报价，点「获取报价」，销售经理一个工作日内回复。"
      : "Hi — I'm STWADD AI, your online reception, online 24/7. Ask me about MOQ, lead times, mould costs, ready stock, custom colours, or tell me what you need the bottle for and I'll recommend the right model. For a written factory-direct quote, use \"Get a quotation\" and our sales manager replies within one working day.");
  }

  function openPanel() {
    panel.classList.add("open");
    document.getElementById("stwaddBadge").style.display = "none";
    if (!opened) {
      opened = true;
      initCloud();
      loadModel(function (ok) { if (!ok) setStatus(isZh ? "留信息给人工" : "Leave your details for a personal quote"); });
      greet();
    }
    setTimeout(scroll, 50);
  }
  bubble.onclick = openPanel;

  // load SDK, then expose cloud when opened
  (function loadSDK() {
    if (window.WorkBuddyCloud) { initCloudOnReady(); return; }
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@tencent-ai/workbuddy-cloud-sdk@dev/lib/index.global.js";
    s.onload = initCloudOnReady;
    s.onerror = function () { setStatus(isZh ? "离线 · 请留联系方式" : "Offline — leave your details below"); };
    document.head.appendChild(s);
    function initCloudOnReady() { /* cloud is created when panel first opens */ }
  })();
})();
