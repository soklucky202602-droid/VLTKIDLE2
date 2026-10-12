/* VLTK-style rebirth rules, based on js.zip rewards.js.
   CS1: level 120. Each next CS +20 levels. Max CS50.
   Reset level/xp/attributes/stage/wave; keep equipment + all learned skills.
   Grant 50 potential points x current CS, +1 tam phap pending,
   and permanent +20% XP / +10% damage per CS. */
(function () {
  'use strict';

  const MAX = 50;
  const BASE_LEVEL = 120;
  const STEP = 20;

  function state() {
    try { return typeof Q === 'function' ? Q() : null; } catch (_) { return null; }
  }

  function rebornCount() {
    const r = state();
    return r && r.stat ? Math.max(0, r.stat.reborn | 0) : 0;
  }

  function requiredLevel(next) {
    return BASE_LEVEL + (next - 1) * STEP;
  }

  try {
    mi = function () {
      const n = rebornCount();
      return { xp: 0.2 * n, dmg: 0.1 * n };
    };
  } catch (_) {}

  try { R5 = function () { return { hp: 1, dmg: 1 }; }; } catch (_) {}

  try {
    OA = function () {
      try { return typeof o !== 'undefined' && o ? o.lvl : 1; } catch (_) { return 1; }
    };
  } catch (_) {}

  async function doRebirthZip() {
    const r = state();
    if (!r || !r.stat) return;

    const current = Math.max(0, r.stat.reborn | 0);
    const next = current + 1;
    let level = 1;
    try { level = Math.max(1, (typeof o !== 'undefined' && o && o.lvl) | 0); } catch (_) {}

    if (next > MAX || level < requiredLevel(next)) return;

    const message =
      `Chuyển sinh lần ${next}: về cấp 1, giữ nguyên trang bị và toàn bộ võ công.\n\n` +
      `Nhận ${next * 50} điểm tiềm năng và +1 điểm Tâm pháp.\n` +
      `Thưởng vĩnh viễn +${next * 20}% kinh nghiệm, +${next * 10}% sát thương.\n\n` +
      `Tiếp tục?`;

    let ok = false;
    try {
      ok = typeof dt === 'function' ? await dt(message) : window.confirm(message);
    } catch (_) { ok = window.confirm(message); }
    if (!ok) return;

    try {
      r.stat.reborn = next;

      if (typeof o !== 'undefined' && o) {
        o.lvl = 1;
        o.xp = 0;
        o.attr = { str: 0, dex: 0, vit: 0, eng: 0 };
        o.attrPts = next * 50;
        o.stage = 1;
        o.wave = 1;
        o.push = true;
        o.tpPend = (o.tpPend | 0) + 1;
      }

      if (typeof c !== 'undefined' && c) {
        c.tower = null;
        c.enemies = [];
        c.dirty = true;
        c.zoneShown = null;
      }

      if (typeof F === 'function') F();
      if (typeof B === 'function') B();
      else if (typeof save === 'function') save();

      try {
        if (typeof giftModal === 'function') {
          giftTab = 'reborn';
          giftModal();
        }
      } catch (_) {}
    } catch (err) {
      console.error('[rebirth-vltkzip]', err);
    }
  }

  try { zD = doRebirthZip; } catch (_) {}
  try { window.zD = doRebirthZip; } catch (_) {}

  function setLeafText(el, text) {
    if (!el || el.children.length) return;
    if ((el.textContent || '') !== text) el.textContent = text;
  }

  function patchRebirthModal() {
    const body = document.getElementById('mBody');
    if (!body || !/chuyển sinh/i.test(body.textContent || '')) return;

    const next = rebornCount() + 1;
    const req = requiredLevel(next);
    const level = (() => {
      try { return Math.max(1, (typeof o !== 'undefined' && o && o.lvl) | 0); } catch (_) { return 1; }
    })();

    const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
    const leaves = [];
    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (!el.children.length) leaves.push(el);
    }

    for (const el of leaves) {
      const text = (el.textContent || '').trim();
      if (!text) continue;

      if (/^\d+\/\d+\s*lần$/i.test(text)) {
        setLeafText(el, `${rebornCount()}/${MAX} lần`);
        continue;
      }

      if (/^cần cấp\s*\d+$/i.test(text)) {
        setLeafText(el, next > MAX ? 'Đã đạt tối đa CS50' : `Cần cấp ${req}`);
        if (next <= MAX) {
          const disabled = level < req;
          if ('disabled' in el) el.disabled = disabled;
          el.classList.toggle('disabled', disabled);
          el.setAttribute('aria-disabled', disabled ? 'true' : 'false');
          el.onclick = disabled ? null : doRebirthZip;
        }
        continue;
      }

      if (/^đã chuyển sinh\s*\d+ lần/i.test(text)) {
        setLeafText(el,
          `Đã chuyển sinh ${rebornCount()} lần · hiện +${rebornCount() * 20}% kinh nghiệm, +${rebornCount() * 10}% sát thương.`
        );
        continue;
      }

      if (/^đạt cấp\s*\d+:/i.test(text)) {
        setLeafText(el,
          `Đạt cấp ${req}: về cấp 1, giữ trang bị và toàn bộ võ công; nhận ${next * 50} điểm tiềm năng + 1 điểm Tâm pháp; thưởng vĩnh viễn +${next * 20}% kinh nghiệm, +${next * 10}% sát thương.`
        );
      }
    }
  }

  function refresh() {
    try { patchRebirthModal(); } catch (_) {}
  }

  const modalBody = document.getElementById('mBody');
  if (modalBody) {
    new MutationObserver(refresh).observe(modalBody, { childList: true, subtree: true, characterData: true });
    refresh();
  }
})();
