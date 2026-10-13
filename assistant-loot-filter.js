/* VLTKIDLE2 — direct integration into Trợ Thủ Kiếm Hiệp > Nhặt đồ. */
(function(){
'use strict';
var KEY='vltkidle2-loot-filter',state=load();
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');if(x&&typeof x==='object')return{minLines:Math.max(1,Math.min(6,+x.minLines||1)),element:x.element!==false}}catch(e){}return{minLines:1,element:true}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function slotOf(a){try{var s=typeof window.pA==='function'?window.pA(a&&a.d):'';return s?String(s):''}catch(e){return''}}
function ringOf(a){try{return typeof window.jA==='function'?String(window.jA(a)||''):''}catch(e){return''}}
function eqSlot(a){var s=slotOf(a);if(s==='ring'){var r=ringOf(a);if(r==='ring1'||r==='ring2')s=r}return s}
function isEq(a){var s=eqSlot(a);return s==='armor'||s==='amulet'||s==='belt'||s==='ring1'||s==='ring2'||s==='cuff'||s==='pendant'||s==='boot'}
function lines(a){if(!a)return 0;if(Array.isArray(a.mag))return a.mag.length;if(Array.isArray(a.attrs))return a.attrs.length;if(Array.isArray(a.attr))return a.attr.length;return 0}
function weaponElement(){try{var w=window.o&&window.o.eq&&window.o.eq.weapon;return w&&Number.isFinite(+w.s)?+w.s:null}catch(e){return null}}
var NH={0:{armor:4,amulet:4,belt:3,ring2:3,cuff:1,pendant:1,boot:2,ring1:2},1:{armor:2,amulet:2,belt:0,ring2:0,cuff:4,pendant:4,boot:3,ring1:3},2:{armor:0,amulet:0,belt:4,ring2:4,cuff:3,pendant:3,boot:1,ring1:1},3:{armor:1,amulet:1,belt:2,ring2:2,cuff:0,pendant:0,boot:4,ring1:4},4:{armor:3,amulet:3,belt:1,ring2:1,cuff:2,pendant:2,boot:0,ring1:0}};
function allowed(a){if(!a)return false;if(!isEq(a))return true;if(lines(a)<state.minLines)return false;if(state.element){var row=NH[weaponElement()],s=eqSlot(a),want=row&&row[s];if(want!==undefined&&Number(a.s)!==want)return false}return true}
function installFilter(){
 if(typeof window.gA==='function'&&!window.gA.__vltk2Filter){var f=function(a){return allowed(a)};f.__vltk2Filter=true;window.gA=f}
 if(typeof window.el==='function'&&!window.el.__vltk2Wrapped){var old=window.el,f=function(a){return allowed(a)?old(a):false};f.__vltk2Wrapped=true;window.el=f}
 try{if(window.o&&window.o.lootF){window.o.lootF.custom=false;window.o.lootF.pickAll=false}if(window.o&&window.o.lootAdv!==undefined)window.o.lootAdv=false}catch(e){}
}
function css(){if(document.getElementById('vltkAssistantLootFilterCss'))return;var s=document.createElement('style');s.id='vltkAssistantLootFilterCss';s.textContent='#vltkAssistantLootFilter{margin:8px 0 10px;padding:10px 12px;border:1px solid rgba(210,168,72,.55);border-radius:6px;background:rgba(10,11,10,.97);color:#ead9ad;font:12px ui-monospace,monospace}#vltkAssistantLootFilter .lf-title{font-weight:800;letter-spacing:1px;color:#e6c477;margin-bottom:9px}#vltkAssistantLootFilter .lf-title small{float:right;color:#8e8067;font-size:9px}#vltkAssistantLootFilter .lf-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0}#vltkAssistantLootFilter select{min-width:150px;height:30px;background:#090b0a;color:#ead9ad;border:1px solid #665538;padding:0 7px;border-radius:4px}#vltkAssistantLootFilter input{accent-color:#b88d3b}#vltkAssistantLootFilter label{cursor:pointer}#vltkAssistantLootFilter .lf-note{margin-top:8px;padding-top:8px;border-top:1px solid rgba(210,168,72,.18);font-size:10px;line-height:1.45;color:#8e8067}';document.head.appendChild(s)}
function render(root){
 if(!root||!root.querySelector)return;
 var h3=null,els=root.querySelectorAll('h3');
 for(var i=0;i<els.length;i++){if(/^Bộ lọc đồ/.test((els[i].textContent||'').trim())){h3=els[i];break}}
 if(!h3)return;
 var card=h3.nextElementSibling;if(!card||!card.classList.contains('lootf'))return;
 if(document.getElementById('vltkAssistantLootFilter'))return;
 h3.style.display='none';card.style.display='none';
 var box=document.createElement('section');box.id='vltkAssistantLootFilter';
 box.innerHTML='<div class="lf-title">LỌC ĐỒ <small>2 TIÊU CHÍ</small></div><div class="lf-row"><label>Số dòng thuộc tính</label><select id="vltkLfLines">'+[1,2,3,4,5,6].map(function(n){return'<option value="'+n+'" '+(n===state.minLines?'selected':'')+'>'+n+' dòng trở lên</option>'}).join('')+'</select></div><div class="lf-row"><label><input id="vltkLfElement" type="checkbox" '+(state.element?'checked':'')+'> Ngũ hành theo vũ khí đang cầm</label></div><div class="lf-note">Áp dụng cho 8 vị trí: Áo · Dây chuyền · Thắt lưng · Nhẫn dưới · Bao tay · Ngọc bội · Giày · Nhẫn trên.<br>Các loại đồ khác vẫn nhặt bình thường. Hai tiêu chí phải cùng đạt.</div>';
 h3.parentNode.insertBefore(box,h3);
 box.querySelector('#vltkLfLines').onchange=function(){state.minLines=Math.max(1,Math.min(6,+this.value||1));save();installFilter()};
 box.querySelector('#vltkLfElement').onchange=function(){state.element=!!this.checked;save();installFilter()};
}
function scan(){installFilter();var body=document.getElementById('u2ttBody');if(!body)return;if((body.textContent||'').indexOf('Bộ lọc đồ')<0)return;render(body)}
function boot(){css();installFilter();scan();var ob=new MutationObserver(function(){scan()});ob.observe(document.body,{childList:true,subtree:true})}
var n=0,t=setInterval(function(){n++;if(document.body&&typeof window.gA==='function'){clearInterval(t);boot()}else if(n>240)clearInterval(t)},250);
})();