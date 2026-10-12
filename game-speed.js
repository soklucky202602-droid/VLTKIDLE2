(function(){
  'use strict';
  const KEY='vltk_game_speed', NORMAL=1, values=[1,1.5,2.5,5,10];
  let speed=Number(localStorage.getItem(KEY)||NORMAL);
  if(!Number.isFinite(speed)||speed<=0)speed=NORMAL;

  const nativeSetTimeout=window.setTimeout.bind(window);
  const nativeSetInterval=window.setInterval.bind(window);
  const nativeRAF=window.requestAnimationFrame.bind(window);
  function delay(v){return Math.max(0,Number(v)||0)/speed}
  window.setTimeout=(fn,ms,...args)=>nativeSetTimeout(fn,delay(ms),...args);
  window.setInterval=(fn,ms,...args)=>nativeSetInterval(fn,delay(ms),...args);

  let virtualTs=0,lastRealTs=null;
  window.requestAnimationFrame=function(fn){
    return nativeRAF(realTs=>{
      if(lastRealTs==null){lastRealTs=realTs;virtualTs=realTs}
      else{
        const dt=Math.min(250,Math.max(0,realTs-lastRealTs));
        lastRealTs=realTs;
        virtualTs+=dt*speed;
      }
      fn(virtualTs);
    });
  };

  function updateUI(){
    const el=document.getElementById('vltkSpeedSelect'); if(el)el.value=String(speed);
    const txt=document.getElementById('vltkSpeedValue'); if(txt)txt.textContent=speed===1?'Bình thường':speed+'×';
  }
  function setSpeed(v,remote){
    v=Number(v); if(!Number.isFinite(v)||v<=0)v=NORMAL;
    if(values.indexOf(v)<0){v=Math.max(0.1,Math.min(10,v));}
    speed=v;
    localStorage.setItem(KEY,String(v));
    updateUI();
    window.dispatchEvent(new CustomEvent('vltk-speed-change',{detail:{speed:v,remote:!!remote}}));
  }
  window.VLTKGameSpeed={get(){return speed},set(v){setSpeed(v,false)},reset(){setSpeed(NORMAL,false)},sync:syncRemote};

  function pickSpeed(rows){
    let found;
    for(const r of rows||[]){
      const key=String(r&&r.key||'').toLowerCase();
      let val=r&&r.value;
      if(val&&typeof val==='object'&&!Array.isArray(val)){
        if('speed' in val) found=val.speed;
        else if('speed_multiplier' in val) found=val.speed_multiplier;
        else if('game_speed' in val) found=val.game_speed;
        else if('settings' in val&&val.settings&&typeof val.settings==='object'){
          found=val.settings.speed??val.settings.speed_multiplier??val.settings.game_speed;
        }
      }
      if(/(^|_)(speed|speed_multiplier|game_speed|admv_speed)$/.test(key)){
        if(val&&typeof val==='object'&&!Array.isArray(val)) val=val.value??val.speed??val.speed_multiplier??val.game_speed;
        if(val!=null)found=val;
      }
      if(/admv.*settings|settings.*admv/.test(key)&&val&&typeof val==='object') found=val.speed??val.speed_multiplier??val.game_speed??found;
    }
    const n=Number(found);
    return Number.isFinite(n)&&n>0?n:null;
  }

  async function readTable(client,table){
    try{const r=await client.from(table).select('*').limit(20);return r&&Array.isArray(r.data)?r.data:[]}catch{return[]}
  }
  async function syncRemote(){
    let client=null;
    try{
      if(!window.supabase||!window.supabase.createClient)return;
      const cfg=window.VLTK_AUTH_CONFIG||window.CHAT_CFG||{};
      const candidates=[];
      if(cfg.url&&cfg.key)candidates.push([cfg.url,cfg.key]);
      if(cfg.supabaseUrl&&cfg.supabaseKey)candidates.push([cfg.supabaseUrl,cfg.supabaseKey]);
      // ADMV currently uses this backend through vltk-config.js; keep it as a read-only fallback.
      candidates.push(['https://getxendjerlcwgwnvted.supabase.co','sb_publishable_bC4EDAb8zGQdHn7dMxLCPQ_YiCncl7d']);
      for(const [url,key] of candidates){
        try{
          client=window.supabase.createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
          let rows=await readTable(client,'game_settings');
          let found=pickSpeed(rows);
          if(found==null)found=pickSpeed(await readTable(client,'admv_settings'));
          if(found!=null){setSpeed(found,true);return}
          try{const r=await client.rpc('gm_get_admv_settings');const d=r&&r.data;const n=Number(d&&typeof d==='object'?(d.speed??d.speed_multiplier??d.game_speed):d);if(Number.isFinite(n)&&n>0){setSpeed(n,true);return}}catch{}
        }catch{}
      }
    }catch{}
  }
  setInterval(syncRemote,5000);
  setTimeout(syncRemote,1200);

  function mountUI(){
    if(document.getElementById('vltkSpeedBox'))return;
    const host=document.getElementById('t-more')||document.getElementById('panel')||document.body;
    const box=document.createElement('div');box.id='vltkSpeedBox';box.className='card';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><b style="color:var(--v-gold,#e6c67a)">⚡ Tốc độ game</b><div style="font-size:11px;opacity:.7;margin-top:3px">Điều chỉnh tốc độ mô phỏng thời gian của game</div></div><strong id="vltkSpeedValue"></strong></div><select id="vltkSpeedSelect" style="width:100%;margin-top:8px"><option value="1">1× · Bình thường</option><option value="1.5">1.5×</option><option value="2.5">2.5×</option><option value="5">5×</option><option value="10">10× · Tối đa</option></select>';
    host.appendChild(box);
    document.getElementById('vltkSpeedSelect').onchange=e=>setSpeed(e.target.value,false);
    updateUI();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountUI);else mountUI();
  new MutationObserver(mountUI).observe(document.documentElement,{childList:true,subtree:true});
})();
