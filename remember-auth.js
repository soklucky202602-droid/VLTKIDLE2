/* Remember login session for VLTKIDLE2.
   When "Nhớ mật khẩu" is checked, Supabase auth survives browser restarts.
   The password itself is never stored; only the Supabase session tokens are persisted. */
(function () {
  'use strict';
  var FLAG = 'jxidle_remember_login';
  var SESSION_KEY = 'jxidle_auth';
  var PERSIST_KEY = 'jxidle_auth_remember';

  function remembered() {
    try { return localStorage.getItem(FLAG) === '1'; } catch (_) { return false; }
  }
  function setRemember(v) {
    try {
      if (v) localStorage.setItem(FLAG, '1');
      else {
        localStorage.removeItem(FLAG);
        localStorage.removeItem(PERSIST_KEY);
      }
    } catch (_) {}
  }

  var storage = {
    getItem: function (key) {
      try {
        var v = window.sessionStorage.getItem(key);
        if (v != null) return v;
        if (remembered()) return window.localStorage.getItem(PERSIST_KEY);
      } catch (_) {}
      return null;
    },
    setItem: function (key, value) {
      try { window.sessionStorage.setItem(key, value); } catch (_) {}
      if (remembered()) {
        try { window.localStorage.setItem(PERSIST_KEY, value); } catch (_) {}
      }
    },
    removeItem: function (key) {
      try { window.sessionStorage.removeItem(key); } catch (_) {}
      try { window.localStorage.removeItem(PERSIST_KEY); } catch (_) {}
    }
  };

  function patchSupabase() {
    if (!window.supabase || !window.supabase.createClient || window.supabase.createClient.__rememberPatched) return false;
    var originalCreate = window.supabase.createClient;
    var wrapped = function (url, key, options) {
      options = options || {};
      var auth = Object.assign({}, options.auth || {}, {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: SESSION_KEY,
        storage: storage
      });
      return originalCreate.call(this, url, key, Object.assign({}, options, { auth: auth }));
    };
    wrapped.__rememberPatched = true;
    window.supabase.createClient = wrapped;
    return true;
  }

  // app.js loads Supabase lazily, so catch the library when its script is added.
  var nativeAppend = document.head.appendChild.bind(document.head);
  document.head.appendChild = function (node) {
    try {
      if (node && node.tagName === 'SCRIPT' && /supabase\.js/i.test(node.src || '')) {
        var oldLoad = node.onload;
        node.onload = function (e) {
          patchSupabase();
          if (typeof oldLoad === 'function') return oldLoad.call(this, e);
        };
      }
    } catch (_) {}
    var result = nativeAppend(node);
    patchSupabase();
    return result;
  };
  patchSupabase();

  function addRememberBox() {
    var password = document.getElementById('naP');
    if (!password || document.getElementById('naRemember')) return;
    var row = password.closest('.row');
    if (!row) row = password.parentElement;
    if (!row) return;
    var wrap = document.createElement('label');
    wrap.id = 'naRemember';
    wrap.className = 'small';
    wrap.style.cssText = 'display:flex;align-items:center;gap:7px;margin:8px 0;cursor:pointer;';
    wrap.innerHTML = '<input type="checkbox" id="naRememberChk"> <span>Nhớ mật khẩu</span>';
    row.parentNode.insertBefore(wrap, row.nextSibling);
    var cb = document.getElementById('naRememberChk');
    cb.checked = remembered();
    cb.onchange = function () { setRemember(cb.checked); };
  }

  var observer = new MutationObserver(addRememberBox);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addRememberBox();
})();