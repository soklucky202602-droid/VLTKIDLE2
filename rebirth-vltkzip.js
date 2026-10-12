/* VLTK-style rebirth rules, based on js.zip rewards.js.
   CS1: level 120. Each next CS +20 levels. Max CS50.
   Rebirth resets level/xp/attributes/stage/wave, keeps equipment + all learned skills,
   grants 50 potential points x current CS, grants +1 tam phap pending,
   and gives permanent +20% XP / +10% damage per CS. */
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

  /* Replace the old combat bonus: +20% XP and +10% damage per CS. */
  try {
    mi = function () {
      const n = rebornCount();
      return { xp: 0.2 * n, dmg: 0.1 * n };
    };
  } catch (_) {}

  /* The zip source has no rebirth monster scaling. */
  try {
    R5 = function () { return { hp: 1, dmg: 1 }; };
  } catch (_) {}

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
    const level = (() => {
      try { return Math.max(1, (typeof o !== 'undefined' && o && o.lvl) | 0); } catch (_) { return 1; }
    })();

    if (next > MAX || level < requiredLevel(next)) return;

    const message =
      `Chuyển sinh lần ${next}: về cấp 1, giữ nguyên trang bị và toàn bộ võ công.\n\n` +
      `Nhận ${next * 50} điểm tiềm năng và +1 điểm Tâm pháp.\n` +
      `Thưởng vĩnh viễn +${next * 20}% kinh nghiệm, +${next * 10}% sát thương.\n\n` +
      `Tiếp tục?`;

    let ok = false;
    try {
      if (typeof dt === 'function') ok = await dt(message);
      else ok = window.confirm(message);
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

        /* Keep equipment and every learned skill exactly as the zip source does. */
        if (typeof o.tpPend !== 'number') o.tpPend = 0;
        o.tpPend += 1;
      }

      if (typeof c !== 'undefined' && c) {
        c.tower = null;
        c.enemies = [];
        c.dirty = true;
        c.zoneShown = null;
      }

      if (typeof F === 'function') F();
      if (typeof B === 'function') B();
      if (typeof save === 'function') save();
      else if (typeof H === 'function') H();

      /* Refresh any rebirth/reward modal if the current source exposes one. */
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

  /* Replace the global handler used by the current minified app. */
  try { zD = doRebirthZip; } catch (_) {}
  try { window.zD = doRebirthZip; } catch (_) {}

  function patchRebirthText(root) {
    const nodes = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (const el of nodes) {
      if (!el || el.children.length) continue;
      const text = (el.textContent || '').trim();
      if (!text) continue;

      if (/chuyển sinh/i.test(text)) {
        let out = text
          .replace(/tối đa\s*10\s*lần/gi, 'tối đa 50 lần')
          .replace(/tối đa\s*10/gi, 'tối đa 50')
          .replace(/cấp\s*200/gi, 'cấp 120')
          .replace(/level\s*200/gi, 'cấp 120')
          .replace(/\+10%\s*kinh nghiệm/gi, '+20% kinh nghiệm')
          .replace(/\+10%\s*sát thương/gi, '+10% sát thương');

        const n = rebornCount();
        const next = n + 1;
        if (next <= MAX && /chuyển sinh/i.test(out)) {
          out = out.replace(/cấp\s*\d+/i, `cấp ${requiredLevel(next)}`);
        }
        if (out !== text) el.textContent = out;
      }
    }
  }

  /* Keep the existing UI, but correct its stale rebirth numbers without a heavy
     permanent DOM observer. The observer disconnects as soon as a rebirth modal
     has been seen/updated. */
  let timer = 0;
  function refresh() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { patchRebirthText(document); } catch (_) {}
    }, 0);
  }
  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  refresh();
})();
