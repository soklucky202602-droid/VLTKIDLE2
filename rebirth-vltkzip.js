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

  /* Zip source: +20% XP and +10% damage per rebirth. */
  try {
    mi = function () {
      const n = rebornCount();
      return { xp: 0.2 * n, dmg: 0.1 * n };
    };
  } catch (_) {}

  /* Zip source has no rebirth monster scaling. */
  try { R5 = function () { return { hp: 1, dmg: 1 }; }; } catch (_) {}

  /* Zip source does not add rebirth count to equipment level requirements. */
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
        /* Equipment and all learned skills are intentionally untouched. */
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

  /* Only watch the modal body; avoid scanning the whole game DOM on every mutation. */
  function patchRebirthText(root) {
    if (!root || !root.querySelectorAll) return;
    const nodes = root.querySelectorAll('*');
    for (const el of nodes) {
      if (!el || el.children.length) continue;
      const text = (el.textContent || '').trim();
      if (!/chuyển sinh/i.test(text)) continue;

      let out = text
        .replace(/tối đa\s*10\s*lần/gi, 'tối đa 50 lần')
        .replace(/tối đa\s*10/gi, 'tối đa 50')
        .replace(/cấp\s*200/gi, 'cấp 120')
        .replace(/level\s*200/gi, 'cấp 120');

      const next = rebornCount() + 1;
      if (next <= MAX) out = out.replace(/cấp\s*\d+/i, `cấp ${requiredLevel(next)}`);
      if (out !== text) el.textContent = out;
    }
  }

  function refresh() {
    const body = document.getElementById('mBody');
    if (body) patchRebirthText(body);
  }

  const modalBody = document.getElementById('mBody');
  if (modalBody) {
    new MutationObserver(refresh).observe(modalBody, { childList: true, subtree: true });
    refresh();
  }
})();
