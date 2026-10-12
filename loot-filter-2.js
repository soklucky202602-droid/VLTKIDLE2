/* VLTKIDLE2 — replacement loot filter integrated into Trợ Thủ Kiếm Hiệp > Nhặt đồ. */
(function(){
  'use strict';
  var KEY='vltkidle2-loot-filter',state=load();
  function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');if(x&&typeof x==='object')return{minLines:Math.max(1,Math.min(6,+x.minLines||1)),element:x.element!==false}}catch(e){}return{minLines:1,element:true}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
  function game(){return window.o&&window.o.eq?window.o:null}
  function slotOf(a){try{if(typeof window.pA==='function'){var s=window.pA(a&&a.d);if(s)return String(s)}}catch(e){}return''}
  function ringOf(a){try{if(typeof window.jA==='function')return String(window.jA(a)||'')}catch(e){}return''}
  function eqSlot(a){var s=slotOf(a);if(s==='ring'){var r=ringOf(a);if(r==='ring1'||r==='ring2')s=r}return s}
  function isEq(a){var s=eqSlot(a);return s==='armor'||s==='amulet'||s==='belt'||s==='ring1'||s==='ring2'||s==='cuff'||s==='pendant'||s==='boot'}
  function lines(a){if(!a)return 0;if(Array.isArray(a.mag))return a.mag.length;if(Array.isArray(a.attrs))return a.attrs.length;if(Array.isArray(a.attr))return a.attr.length;return 0}
  function weaponElement(){var g=game(),w=g&&g.eq&&g.eq.weapon;return w&&Number.isFinite(+w.s)?+w.s:null}
  /* 0 Kim, 1 Mộc, 2 Thủy, 3 Hỏa, 4 Thổ. */
  var NH={0:{armor:4,amulet:4,belt:3,ring2:3,cuff:1,pendant:1,boot:2,ring1:2},1:{armor:2,amulet:2,belt:0,ring2:0,cuff:4,pendant:4,boot:3,ring1:3},2:{armor:0,amulet:0,belt:4,ring2:4,cuff:3,pendant:3,boot:1,ring1:1},3:{armor:1,amulet:1,belt:2,ring2:2,cuff:0,pendant:0,boot:4,ring1:4},4:{armor:3,amulet:3,belt:1,ring2:1,cuff:2,pendant:2,boot:0,ring1:0}};
  function allowed(a){if(!a)return false;if(!isEq(a))return true;if(lines(a)<state.minLines)return false;if(state.element){var row=NH[weaponElement()],s=eqSlot(a),want=row&&row[s];if(want!==undefined&&Number(a.s)!==want)return false}return true}
  function install(){
    if(typeof window.gA==='function'&&!window.gA.__vltk2Filter){var old=window.gA,f=function(a){return allowed(a)};f.__vltk2Filter=true;f.__vltk2Original=old;window.gA=f}
    if(typeof window.el==='function'&&!window.el.__vltk2Wrapped){var oldEl=window.el,f2=function(a){return allowed(a)?oldEl(a):false};f2.__vltk2Wrapped=true;window.el=f2}
    try{if(window.o&&window.o.lootF){window.o.lootF.custom=false;window.o.lootF.pickAll=false}if(window.o&&window.o.lootAdv!==undefined)window.o.lootAdv=false}catch(e){}
  }
  function findLegacy(){
    var all=document.querySelectorAll('*'),anchor=null;
    for(var i=0;i<all.length;i++){var e=all[i],t=(e.textContent||'').replace(/\s+/g,' ').trim();if(t==='Bộ lọc đồ'){anchor=e;break}}
    if(!anchor)return null;
    for(var p=anchor;p&&p!==document.body;p=p.parentElement){var x=(p.textContent||'').replace(/\s+/g,' ');if(/Bộ lọc đồ/i.test(x)&&/Nhặt hết/i.test(x)&&/Mặc định/i.test(x)&&/Nâng cao/i.test(x)&&x.length<16000)return p}
    return anchor.parentElement
  }
  function render(){
    var root=findLegacy();if(!root)return false;
    var old=document.getElementById('vltkLootFilter2');if(old)old.remove();
    root.style.display='none';root.setAttribute('data-vltk-legacy-loot','1');
    var box=document.createElement('section');box.id='vltkLootFilter2';
    box.innerHTML='<div class="vltk-lf2-title">LỌC ĐỒ <span>2 TIÊU CHÍ</span></div><div class="vltk-lf2-row"><label>Số dòng thuộc tính</label><select id="vltkLfLines">'+[1,2,3,4,5,6].map(function(n){return'<option value="'+n+'" '+(n===state.minLines?'selected':'')+'>'+n+' dòng trở lên</option>'}).join('')+'</select></div><div class="vltk-lf2-row"><label><input id="vltkLfElement" type="checkbox" '+(state.element?'checked':'')+'> Ngũ hành theo vũ khí đang cầm</label></div><div class="vltk-lf2-note">Áp dụng cho 8 vị trí: Áo · Dây chuyền · Thắt lưng · Nhẫn dưới · Bao tay · Ngọc bội · Giày · Nhẫn trên. Các loại đồ khác vẫn nhặt bình thường.</div>';
    root.parentNode.insertBefore(box,root);
    box.querySelector('#vltkLfLines').onchange=function(){state.minLines=Math.max(1,Math.min(6,+this.value||1));save();install()};
    box.querySelector('#vltkLfElement').onchange=function(){state.element=!!this.checked;save();install()};
    return true;
  }
  function style(){if(document.getElementById('vltkLootFilter2Css'))return;var s=document.createElement('style');s.id='vltkLootFilter2Css';s.textContent='#vltkLootFilter2{display:block!important;margin:8px 0;padding:10px 12px;border:1px solid rgba(210,168,72,.55);background:rgba(10,11,10,.96);color:#ead9ad;font:12px ui-monospace,monospace;position:relative;z-index:20}#vltkLootFilter2 .vltk-lf2-title{font-weight:800;letter-spacing:1.2px;color:#e6c477;margin-bottom:9px}#vltkLootFilter2 .vltk-lf2-title span{float:right;font-size:9px;color:#8e8067}#vltkLootFilter2 .vltk-lf2-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 0}#vltkLootFilter2 select{min-width:145px;height:30px;background:#090b0a;color:#ead9ad;border:1px solid #665538;padding:0 7px}#vltkLootFilter2 input{accent-color:#b88d3b}#vltkLootFilter2 label{cursor:pointer}#vltkLootFilter2 .vltk-lf2-note{margin-top:8px;padding-top:7px;border-top:1px solid rgba(210,168,72,.18);font-size:10px;line-height:1.45;color:#8e8067}';document.head.appendChild(s)}
  function boot(){style();install();render();var obs=new MutationObserver(function(){install();var old=document.getElementById('vltkLootFilter2');if(!old)render();var r=findLegacy();if(r&&r.getAttribute('data-vltk-legacy-loot')!=='1'){r.style.display='none';r.setAttribute('data-vltk-legacy-loot','1')}});obs.observe(document.body,{childList:true,subtree:true})}
  var n=0,t=setInterval(function(){n++;if(document.body&&typeof window.gA==='function'){clearInterval(t);boot()}else if(n>240)clearInterval(t)},250);
})();