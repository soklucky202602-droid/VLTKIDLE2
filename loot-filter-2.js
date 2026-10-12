/* VLTKIDLE2 — 2-criteria automatic loot filter. Existing pickup/inventory logic stays intact. */
(function(){
  'use strict';
  var KEY='vltkidle2-loot-filter';
  var defaults={minLines:1,element:true};
  var state=load();

  function load(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||'null');
      if(x&&typeof x==='object')return {minLines:Math.max(1,Math.min(6,+x.minLines||1)),element:x.element!==false};
    }catch(e){}
    return {minLines:defaults.minLines,element:defaults.element};
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function getGame(){return window.o&&window.o.eq?window.o:null;}
  function itemSlot(A){
    if(!A)return '';
    try{
      if(typeof window.pA==='function'){
        var s=window.pA[A.d];
        if(s)return String(s);
      }
    }catch(e){}
    return '';
  }
  function ringSlot(A){
    try{if(typeof window.jA==='function')return String(window.jA(A)||'');}catch(e){}
    return '';
  }
  function weaponSeries(){
    var g=getGame();
    var w=g&&g.eq&&g.eq.weapon;
    return w&&Number.isFinite(+w.s)?+w.s:null;
  }
  function lineCount(A){
    if(!A)return 0;
    if(Array.isArray(A.mag))return A.mag.length;
    if(Array.isArray(A.attrs))return A.attrs.length;
    if(Array.isArray(A.attr))return A.attr.length;
    return 0;
  }

  /* Full five-element table supplied for the 8 filtered equipment positions.
   * Codes: 0=Kim, 1=Mộc, 2=Thủy, 3=Hỏa, 4=Thổ.
   * Each pair uses the same element.
   */
  var NGU_HANH={
    0:{armor:4,amulet:4,belt:3,ring2:3,cuff:1,pendant:1,boot:2,ring1:2},
    1:{armor:2,amulet:2,belt:0,ring2:0,cuff:4,pendant:4,boot:3,ring1:3},
    2:{armor:0,amulet:0,belt:4,ring2:4,cuff:3,pendant:3,boot:1,ring1:1},
    3:{armor:1,amulet:1,belt:2,ring2:2,cuff:0,pendant:0,boot:4,ring1:4},
    4:{armor:3,amulet:3,belt:1,ring2:1,cuff:2,pendant:2,boot:0,ring1:0}
  };

  function expectedSeries(slot,w){
    var row=NGU_HANH[Number(w)];
    return row&&Object.prototype.hasOwnProperty.call(row,slot)?row[slot]:null;
  }

  function twoCriteria(A){
    if(!A)return false;
    if(typeof window.W0==='function'&&window.W0(A))return true;

    /* Only the 8 equipment positions use both criteria. Other drops stay untouched. */
    var slot=itemSlot(A);
    var mapped=slot==='armor'||slot==='amulet'||slot==='belt'||slot==='cuff'||slot==='pendant'||slot==='boot';
    if(slot==='ring'){
      var rs=ringSlot(A);
      slot=rs==='ring1'||rs==='ring2'?rs:slot;
      mapped=rs==='ring1'||rs==='ring2';
    }

    if(!mapped)return true;
    if(lineCount(A)<state.minLines)return false;

    if(state.element){
      var want=expectedSeries(slot,weaponSeries());
      if(want!==null && Number(A.s)!==want)return false;
    }
    return true;
  }

  function installFilter(){
    if(typeof window.gA!=='function')return;
    window.gA=function(A){return twoCriteria(A);};
  }

  function renderUI(){
    var host=document.getElementById('t-inv');
    if(!host)return;
    var old=document.getElementById('vltkLootFilter2');
    if(old)old.remove();
    var box=document.createElement('section');
    box.id='vltkLootFilter2';
    box.innerHTML='<div class="vltk-lf2-title">LỌC ĐỒ TỰ ĐỘNG <span>2 TIÊU CHÍ</span></div>'+
      '<div class="vltk-lf2-row"><label>Số dòng thuộc tính</label><select id="vltkLfLines"></select></div>'+
      '<div class="vltk-lf2-row"><label class="vltk-lf2-check"><input id="vltkLfElement" type="checkbox"> Ngũ hành theo vũ khí đang cầm</label></div>'+
      '<div class="vltk-lf2-note">8 vị trí: Áo · Dây chuyền · Thắt lưng · Nhẫn dưới · Bao tay · Ngọc bội · Giày · Nhẫn trên. Đồ ngoài 8 vị trí vẫn nhặt bình thường.</div>';
    host.prepend(box);
    var sel=box.querySelector('#vltkLfLines');
    for(var i=1;i<=6;i++){
      var o=document.createElement('option');o.value=i;o.textContent=i+' dòng trở lên';if(i===state.minLines)o.selected=true;sel.appendChild(o);
    }
    box.querySelector('#vltkLfElement').checked=state.element;
    sel.onchange=function(){state.minLines=Math.max(1,Math.min(6,+this.value||1));save();};
    box.querySelector('#vltkLfElement').onchange=function(){state.element=!!this.checked;save();};
  }

  function injectStyle(){
    if(document.getElementById('vltkLootFilter2Css'))return;
    var s=document.createElement('style');s.id='vltkLootFilter2Css';
    s.textContent='#vltkLootFilter2{margin:10px 0;padding:12px;border:1px solid rgba(210,168,72,.55);background:rgba(10,11,10,.94);color:#ead9ad;font:12px ui-monospace,monospace}#vltkLootFilter2 .vltk-lf2-title{font-weight:800;letter-spacing:1.4px;color:#e6c477;margin-bottom:10px}#vltkLootFilter2 .vltk-lf2-title span{float:right;font-size:9px;color:#8e8067}#vltkLootFilter2 .vltk-lf2-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0}#vltkLootFilter2 select{min-width:150px;height:32px;background:#090b0a;color:#ead9ad;border:1px solid #665538;padding:0 8px}#vltkLootFilter2 input{accent-color:#b88d3b}#vltkLootFilter2 .vltk-lf2-check{cursor:pointer}#vltkLootFilter2 .vltk-lf2-note{margin-top:9px;padding-top:8px;border-top:1px solid rgba(210,168,72,.18);font-size:10px;line-height:1.5;color:#8e8067}';
    document.head.appendChild(s);
  }

  function boot(){
    installFilter();
    injectStyle();
    renderUI();
    var host=document.getElementById('t-inv');
    if(host)new MutationObserver(function(){if(!document.getElementById('vltkLootFilter2'))renderUI();}).observe(host,{childList:true,subtree:true});
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(typeof window.gA==='function'&&document.getElementById('t-inv')){clearInterval(timer);boot();}
    else if(tries>120)clearInterval(timer);
  },250);
})();
