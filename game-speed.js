(function(){
  'use strict';
  const KEY='vltk_game_speed';
  const NORMAL=1;
  const values=[1,1.5,2.5,5,10];
  let speed=Number(localStorage.getItem(KEY)||NORMAL);
  if(!Number.isFinite(speed)||speed<=0)speed=NORMAL;
  const nativeSetTimeout=window.setTimeout.bind(window);
  const nativeSetInterval=window.setInterval.bind(window);
  const nativeClearTimeout=window.clearTimeout.bind(window);
  const nativeClearInterval=window.clearInterval.bind(window);
  const timerMeta=new WeakMap();
  function delay(v){return Math.max(0,Number(v)||0)/speed}
  window.setTimeout=function(fn,ms,...args){
    return nativeSetTimeout(fn,delay(ms),...args);
  };
  window.setInterval=function(fn,ms,...args){
    return nativeSetInterval(fn,delay(ms),...args);
  };
  window.VLTKGameSpeed={
    get(){return speed},
    set(v){
      v=Number(v); if(!Number.isFinite(v)||v<=0)v=NORMAL;
      speed=v; localStorage.setItem(KEY,String(v)); updateUI();
      window.dispatchEvent(new CustomEvent('vltk-speed-change',{detail:{speed:v}}));
    },
    reset(){this.set(NORMAL)}
  };
  function updateUI(){
    const el=document.getElementById('vltkSpeedSelect');
    if(el)el.value=String(speed);
    const txt=document.getElementById('vltkSpeedValue');
    if(txt)txt.textContent=speed===1?'Bình thường':speed+'×';
  }
  function mountUI(){
    if(document.getElementById('vltkSpeedBox'))return;
    const host=document.getElementById('t-more')||document.getElementById('panel')||document.body;
    const box=document.createElement('div'); box.id='vltkSpeedBox'; box.className='card';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><b style="color:var(--v-gold,#e6c67a)">⚡ Tốc độ game</b><div style="font-size:11px;opacity:.7;margin-top:3px">Điều chỉnh tốc độ mô phỏng thời gian của game</div></div><strong id="vltkSpeedValue">'+(speed===1?'Bình thường':speed+'×')+'</strong></div><select id="vltkSpeedSelect" style="width:100%;margin-top:8px"><option value="1">1× · Bình thường</option><option value="1.5">1.5×</option><option value="2.5">2.5×</option><option value="5">5×</option><option value="10">10× · Tối đa</option></select>';
    host.appendChild(box);
    document.getElementById('vltkSpeedSelect').onchange=e=>window.VLTKGameSpeed.set(e.target.value);
    updateUI();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountUI);else mountUI();
  const obs=new MutationObserver(mountUI);
  obs.observe(document.documentElement,{childList:true,subtree:true});
})();
