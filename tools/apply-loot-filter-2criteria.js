#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const file = path.resolve(process.argv[2] || "app.js");
let s = fs.readFileSync(file, "utf8");

function replaceOnce(oldText, newText, label) {
  if (!s.includes(oldText)) {
    if (newText && s.includes(newText)) return;
    throw new Error(`Patch target not found: ${label}`);
  }
  s = s.replace(oldText, newText);
}

replaceOnce(
  'setMine:!1,pickAll:!0,ep:',
  'setMine:!1,pickAll:!0,assist2:{lines:1},ep:',
  'loot defaults'
);

replaceOnce(
  'delete o.epAuto,delete o.epAutoJ}return A},Um=',
  'delete o.epAuto,delete o.epAutoJ}if(!A.assist2||typeof A.assist2!=="object")A.assist2={lines:1};A.assist2.lines=C(Math.floor(+A.assist2.lines||1),1,6);return A},Um=',
  'loot filter normalization'
);

replaceOnce(
  'gA=function(A){if(typeof W0=="function"&&W0(A))return!0;const n=zA();if(A.set&&!Ye(A))return!1;',
  'gA=function(A){if(typeof W0=="function"&&W0(A))return!0;const n=zA(),slot2=pA[A&&A.d],t2=n.assist2;if(t2){if(["armor","ring","amulet","boot","belt","helm","cuff","pendant"].includes(slot2)){const w2=o.eq&&o.eq.weapon,s2=w2&&Number.isFinite(+w2.s)?+w2.s:-1;return s2<0||((A.mag||[]).length>=t2.lines&&+A.s===s2)}return!0}if(A.set&&!Ye(A))return!1;',
  'loot eligibility'
);

replaceOnce(
  '!(l||gA(g.it)||es(g.it))',
  '!(r.assist2?gA(g.it):(l||gA(g.it)||es(g.it)))',
  'ground auto-pick'
);

replaceOnce(
  'v1==="loot"){Zt();return}',
  'v1==="loot"){Lk();return}',
  'assistant loot tab'
);

const oldAk = /ak=function\(\)\{const A=u\("#u2ttBody"\);if\(!A\|\|!Lh\(\)\)return;const n=u\("#t-inv"\);A\.innerHTML="",\[\.\.\.n\.children\]\.filter\(e=>e\.matches\("h3, \.lootf, #epLoot"\)\)\.forEach\(e=>A\.appendChild\(e\)\);const t=A\.querySelector\("h3"\);t&&t\.classList\.add\("u2h"\),n\.innerHTML="",Y=!0\},Ch=function/;
const newAk =
'Lk=function(){const A=u("#u2ttBody");if(!A||!Lh())return;const n=zA(),t=n.assist2||{lines:1},e=o.eq&&o.eq.weapon,a=e&&Number.isFinite(+e.s)?+e.s:-1,i=a>=0&&d0[a]?d0[a]:"Chưa có vũ khí";A.innerHTML=`<h3 class="u2h">Bộ lọc nhặt đồ</h3><div class="card lootf"><div class="small">Chỉ lọc <b>8 ô trang bị</b> (Áo, Mũ, Đai, Giày, Hộ uyển, Dây chuyền, Nhẫn, Ngọc bội). Các loại đồ khác vẫn nhặt bình thường.</div><div class="small" style="margin-top:8px"><b>Số dòng thuộc tính tối thiểu</b></div><div class="lmodes">${[1,2,3,4,5,6].map(r=>`<button class="btn lmode${t.lines===r?" on":""}" data-a2-lines="${r}"><b>${r===6?"6+":r+" dòng"}</b></button>`).join("")}</div><div class="small" style="margin-top:10px"><b>Ngũ hành</b>: <span class="gold">${D(i)}</span> <small class="dim">(tự động theo vũ khí đang trang bị)</small></div><div class="dim small" style="margin-top:8px">Đồ trang bị chỉ được tự nhặt khi đủ số dòng đã chọn và cùng ngũ hành với vũ khí hiện tại. Không có vũ khí: không chặn đồ trang bị.</div></div>`,A.querySelectorAll("[data-a2-lines]").forEach(r=>r.onclick=()=>{n.assist2||(n.assist2={});n.assist2.lines=C(+r.dataset.a2Lines,1,6);B();Lk()})},Ch=function';
if (oldAk.test(s)) s = s.replace(oldAk, newAk);
else if (!s.includes('Lk=function(){const A=u("#u2ttBody")')) throw new Error("Patch target not found: old loot-tab renderer");

replaceOnce(
  'Zt=()=>vn()?Lh()?(s1.inv(),ak()):(K2("inv"),Jy()):s1.inv(),',
  'Zt=()=>vn()?(K2("inv"),Jy()):s1.inv(),',
  'inventory renderer'
);

fs.writeFileSync(file, s);
console.log(`Patched ${file}`);
