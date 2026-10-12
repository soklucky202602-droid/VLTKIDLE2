/* VLTKIDLE2 — single replacement loot filter. Legacy loot modes are disabled. */
(function(){
  'use strict';
  var KEY='vltkidle2-loot-filter';
  var state=load();

  function load(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||'null');
      if(x&&typeof x==='object')return {minLines:Math.max(1,Math.min(6,+x.minLines||1)),element:x.element!==false};
    }catch(e){}
    return {minLines:1,element:true};
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function game(){return window.o&&window.o.eq?window.o:null;}

  function slotOf(A){
    if(!A)return '';
    try{
      if(typeof window.pA==='function'){
        var s=window.pA(A.d);
        if(s)return String(s);
      }
    }catch(e){}
    return '';
  }
  function ringOf(A){
    try{if(typeof window.jA==='function')return String(window.jA(A)||'')}catch(e){}
    return '';
  }
  function lines(A){
    if(!A)return 0;
    if(Array.isArray(A.mag))return A.mag.length;
    if(Array.isArray(A.attrs))return A.attrs.length;
    if(Array.isArray(A.attr))return A.attr.length;
    return 0;
  }
  function weaponElement(){
    var g=game(),w=g&&g.eq&&g.eq.weapon;
    return w&&Number.isFinite(+w.s)?+w.s:null;
  }

  /* 0 Kim, 1 Mộc, 2 Thủy, 3 Hỏa, 4 Thổ. */
  var NH={
    0:{armor:4,amulet:4,belt:3,ring2:3,cuff:1,pendant:1,boot:2,ring1:2},
    1:{armor:2,amulet:2,belt:0,ring2:0,cuff:4,pendant:4,boot:3,ring1:3},
    2:{armor:0,amulet:0,belt:4,ring2:4,cuff:3,pendant:3,boot:1,ring1:1},
    3:{armor:1,amulet:1,belt:2,ring2:2,cuff:0,pendant:0,boot:4,ring1:4},
    4:{armor:3,amulet:3,belt:1,ring2:1,cuff:2,pendant:2,boot:0,ring1:0}
  };

  function equipmentSlot(A){
    var s=slotOf(A);
    if(s==='ring'){
      var r=ringOf(A);
      if(r==='ring1'||r==='ring2')s=r;
    }
    return s;
  }
  function isFilteredEquipment(A){
    var s=equipmentSlot(A);
    return s==='armor'||s==='amulet'||s==='belt'||s==='ring1'||s==='ring2'||s==='cuff'||s==='pendant'||s==='boot';
  }
  function allowed(A){
    if(!A)return false;
    if(!isFilteredEquipment(A))return true;
    if(lines(A)<state.minLines)return false;
    if(state.element){
      var row=NH[weaponElement()],s=equipmentSlot(A),want=row&&row[s];
      if(want!==undefined&&Number(A.s)!==want)return false;
    }
    return true;
  }

  function hideLegacyFilter(host){
    if(!host)return;
    var all=host.querySelectorAll('*');
    for(var i=0;i<all.length;i++){
      var el=all[i],txt=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(!txt)continue;
      /* The old block has these labels. Hide the whole block, not only its heading. */
      if(/Bộ lọc đồ/i.test(txt)&&/Nhật hết/i.test(txt)&&/Mặc định/i.test(txt)){
        var p=el;
        for(var n=0;n<8&&p&&p!==host;n++,p=p.parentElement){
          var pt=String(p.textContent||'').replace(/\s+/g,' ');
          if(/Bộ lọc đồ/i.test(pt)&&/Nhật hết/i.test(pt)&&/Mặc định/i.test(pt)&&pt.length<12000){
            p.style.display='none';
            p.setAttribute('data-vltk-legacy-loot','1');
            break;
          }
        }
      }
    }
    var marked=host.querySelectorAll('[data-vltk-legacy-loot="1"]');
    for(var j=0;j<marked.length;j++)marked[j].style.display='none';
  }

  function disableLegacyModes(){
    try{
      if(window.o&&window.o.lootF){
        window.o.lootF.custom=false;
        window.o.lootF.pickAll=false;
      }
      if(window.o&&window.o.lootAdv!==undefined)window.o.lootAdv=false;
    }catch(e){}
    var host=document.getElementById('t-inv');
    if(host)hideLegacyFilter(host);
  }

  function installPickupFilter(){
    if(typeof window.gA==='function'){
      if(!window.gA.__vltk2Filter){
        var oldGA=window.gA;
        var wrappedGA=function(A){return allowed(A)};
        wrappedGA.__vltk2Filter=true;
        wrappedGA.__vltk2Original=oldGA;
        window.gA=wrappedGA;
      }
    }
    if(typeof window.el==='function'&&!window.el.__vltk2Wrapped){
      var oldEl=window.el;
      var wrapped=function(A){return allowed(A)?oldEl(A):false};
      wrapped.__vltk2Wrapped=true;
      window.el=wrapped;
    }
  }

  function render(){
    var host=document.getElementById('t-inv');
    if(!host)return;
    var old=document.getElementById('vltkLootFilter2');if(old)old.remove();
    var box=document.createElement('section');box.id='vltkLootFilter2';
    box.innerHTML='<div class="vltk-lf2-title">LỌC ĐỒ <span>2 TIÊU CHÍ</span></div>'+
      '<div class="vltk-lf2-row"><label>Số dòng thuộc tính</label><select id="vltkLfLines">'+
      [1,2,3,4,5,6].map(function(n){return '<option value="'+n+'" '+(n===state.minLines?'selected':'')+'>'+n+' dòng trở lên</option>'}).join('')+
      '</select></div>'+ 
      '<div class="vltk-lf2-row"><label><input id="vltkLfElement" type="checkbox" '+(state.element?'checked':'')+'> Ngũ hành theo vũ khí đang cầm</label></div>'+ 
      '<div class="vltk-lf2-note">8 vị trí lọc: Áo · Dây chuyền · Thắt lưng · Nhẫn dưới · Bao tay · Ngọc bội · Giày · Nhẫn trên. Các loại đồ khác vẫn nhặt bình thường.</div>';
    host.insertBefore(box,host.firstChild);
    box.querySelector('#vltkLfLines').onchange=function(){state.minLines=Math.max(1,Math.min(6,+this.value||1));save();installPickupFilter()};
    box.querySelector('#vltkLfElement').onchange=function(){state.element=!!this.checked;save();installPickupFilter()};
  }

  function style(){
    if(document.getElementById('vltkLootFilter2Css'))return;
    var s=document.createElement('style');s.id='vltkLootFilter2Css';
    s.textContent='#vltkLootFilter2{display:block!important;margin:10px 0;padding:12px;border:1px solid rgba(210,168,72,.55);background:rgba(10,11,10,.96);color:#ead9ad;font:12px ui-monospace,monospace;position:relative;z-index:5}#vltkLootFilter2 .vltk-lf2-title{font-weight:800;letter-spacing:1.4px;color:#e6c477;margin-bottom:10px}#vltkLootFilter2 .vltk-lf2-title span{float:right;font-size:9px;color:#8e8067}#vltkLootFilter2 .vltk-lf2-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0}#vltkLootFilter2 select{min-width:150px;height:32px;background:#090b0a;color:#ead9ad;border:1px solid #665538;padding:0 8px}#vltkLootFilter2 input{accent-color:#b88d3b}#vltkLootFilter2 label{cursor:pointer}#vltkLootFilter2 .vltk-lf2-note{margin-top:9px;padding-top:8px;border-top:1px solid rgba(210,168,72,.18);font-size:10px;line-height:1.5;color:#8e8067}';
    document.head.appendChild(s);
  }

  function boot(){
    style();
    var host=document.getElementById('t-inv');
    if(!host)return;
    hideLegacyFilter(host);
    disableLegacyModes();
    installPickupFilter();
    render();
    var observer=new MutationObserver(function(){
      hideLegacyFilter(host);
      disableLegacyModes();
      installPickupFilter();
      if(!document.getElementById('vltkLootFilter2'))render();
    });
    observer.observe(host,{childList:true,subtree:true});
  }

  var tries=0,t=setInterval(function(){
    tries++;
    var host=document.getElementById('t-inv');
    if(host){
      clearInterval(t);
      boot();
    }else if(tries>240){
      clearInterval(t);
    }
  },250);
})();
