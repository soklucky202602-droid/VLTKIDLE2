/* Rebirth bonus: cumulative +20 potential / +5 skill points per rebirth.
   CS1 = +20/+5, CS2 = +40/+10 ... CS10 = +200/+50.
   Loaded before app.js so both local saves and cloud saves receive the bonus. */
(function () {
  'use strict';

  const PREFIX = 'jx-idle-v1:';
  const seen = Object.create(null);
  const KEY_RE = /^jxidle(?:_\d+)?$/;

  function hash(str) {
    let n = 3735928559, t = 1103547991;
    const e = PREFIX + str;
    for (let a = 0; a < e.length; a++) {
      const i = e.charCodeAt(a);
      n = Math.imul(n ^ i, 2654435761);
      t = Math.imul(t ^ i, 1597334677);
    }
    n = Math.imul(n ^ (n >>> 16), 2246822507) ^ Math.imul(t ^ (t >>> 13), 3266489909);
    t = Math.imul(t ^ (t >>> 16), 2246822507) ^ Math.imul(n ^ (n >>> 13), 3266489909);
    return (4294967296 * (2097151 & t) + (n >>> 0)).toString(36);
  }

  function signState(state) {
    const d = JSON.stringify(state);
    return JSON.stringify({ d, h: hash(d) });
  }

  function parseSigned(value) {
    try {
      const outer = JSON.parse(value);
      if (!outer || typeof outer.d !== 'string' || typeof outer.h !== 'string') return null;
      const state = JSON.parse(outer.d);
      return hash(outer.d) === outer.h ? state : null;
    } catch (_) { return null; }
  }

  function prime() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !KEY_RE.test(key)) continue;
        const state = parseSigned(localStorage.getItem(key));
        if (state && state.stat) seen[key] = Math.max(0, state.stat.reborn | 0);
      }
    } catch (_) {}
  }

  prime();

  const nativeSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    try {
      key = String(key);
      if (KEY_RE.test(key)) {
        const state = parseSigned(String(value));
        if (state && state.stat) {
          const before = seen[key];
          const reborn = Math.max(0, Math.min(10, state.stat.reborn | 0));
          if (before != null && reborn > before) {
            state.attrPts = 20 * reborn + Math.max(0, state.bonusAtp | 0);
            state.skPts = 5 * reborn + Math.max(0, state.bonusSkp | 0);
            value = signState(state);
            const slot = key === 'jxidle' ? '0' : key.slice(7);
            seen['cloud:' + slot] = Math.max(0, reborn - 1);
          }
          seen[key] = reborn;
        }
      }
    } catch (_) {}
    return nativeSetItem.call(this, key, value);
  };

  const nativeFetch = window.fetch;
  window.fetch = async function (input, init) {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      if (method === 'POST' && /\/rest\/v1\/saves(?:\?|$)/.test(url)) {
        let body = init && init.body;
        if (typeof body === 'string') {
          const rows = JSON.parse(body);
          const list = Array.isArray(rows) ? rows : [rows];
          for (const row of list) {
            if (!row || typeof row.data !== 'string') continue;
            let cloud;
            try { cloud = JSON.parse(row.data); } catch (_) { continue; }
            if (!cloud || cloud.v !== 2 || typeof cloud.d !== 'string') continue;
            const state = parseSigned(cloud.d);
            if (!state || !state.stat) continue;
            const key = 'cloud:' + String(row.slot == null ? '' : row.slot);
            const before = seen[key];
            const reborn = Math.max(0, Math.min(10, state.stat.reborn | 0));
            if (before != null && reborn > before) {
              state.attrPts = 20 * reborn + Math.max(0, state.bonusAtp | 0);
              state.skPts = 5 * reborn + Math.max(0, state.bonusSkp | 0);
              cloud.d = signState(state);
              row.data = JSON.stringify(cloud);
            }
            seen[key] = reborn;
          }
          body = JSON.stringify(Array.isArray(rows) ? rows : list[0]);
          if (init) init = Object.assign({}, init, { body });
          else input = new Request(input, { body });
        }
      }
    } catch (_) {}
    return nativeFetch.call(this, input, init);
  };

  function refreshRebirthText() {
    let changed = false;
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue || '';
        if (text.includes('nhận cố định') && text.includes('5 điểm tiềm năng + 1 điểm kỹ năng')) {
          node.nodeValue = text.replace(
            /nhận cố định\s*5 điểm tiềm năng \+ 1 điểm kỹ năng/,
            'mỗi lần +20 điểm tiềm năng + 5 điểm kỹ năng (CS1: 20/5 · CS2: 40/10 · … · CS10: 200/50)'
          );
          changed = true;
        }
        if (text.includes('nhận 5 tiềm năng + 1 điểm kỹ năng')) {
          node.nodeValue = text.replace(
            /nhận 5 tiềm năng \+ 1 điểm kỹ năng/,
            'nhận điểm chuyển sinh theo cấp CS: 20 tiềm năng + 5 kỹ năng mỗi lần'
          );
          changed = true;
        }
      }
    } catch (_) {}
    return changed;
  }

  let observer;
  const run = () => {
    if (refreshRebirthText() && observer) observer.disconnect();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();