/* Extend the XP table before app.js initializes its level cap. */
(function () {
  'use strict';
  const MAX_LEVEL = 1100;
  const J = window.JX;
  if (!J || !Array.isArray(J.exp)) return;
  const last = Number(J.exp[J.exp.length - 1]) || 2000000000;
  while (J.exp.length <= MAX_LEVEL) J.exp.push(last);
})();
