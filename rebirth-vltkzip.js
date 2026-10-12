/* VLTK-style rebirth rules, based on js.zip rewards.js. */
(function () {
  'use strict';
  const MAX = 50, BASE_LEVEL = 120, STEP = 20;
  function state(){try{return typeof Q==='function'?Q():null}catch(_){return null}}
  function count(){
    try {
      if (typeof o !== 'undefined' && o && o.rw && o.rw.stat)
        return Math.max(0, o.rw.stat.reborn | 0);
    } catch (_) {}
    const r=state(); return r&&r.stat?Math.max(0,r.stat.reborn|0):0;
  }
  function required(n){return BASE_LEVEL+(n-1)*STEP}
  function level(){try{return Math.max(1,(typeof o!=='undefined'&&o&&o.lvl)|0)}catch(_){return 1}}

  try{mi=function(){const n=count();return{xp:.2*n,dmg:.1*n}}}catch(_){}
  try{R5=function(){return{hp:1,dmg:1}}}catch(_){}
  try{OA=function(){return level()}}catch(_){}

  async function doRebirth(){
    const r=state(); if(!r||!r.stat)return;
    const next=count()+1, req=required(next);
    if(next>MAX||level()<req)return;
    const msg=`Chuyển sinh lần ${next}: về cấp 1, giữ nguyên trang bị và toàn bộ võ công.\n\nNhận ${next*50} điểm tiềm năng và +1 điểm Tâm pháp.\nThưởng vĩnh viễn +${next*20}% kinh nghiệm, +${next*10}% sát thương.\n\nTiếp tục?`;
    let ok=false; try{ok=typeof dt==='function'?await dt(msg):window.confirm(msg)}catch(_){ok=window.confirm(msg)}
    if(!ok)return;
    r.stat.reborn=next;
    if(typeof o!=='undefined'&&o){o.rw=o.rw||r;o.rw.stat=o.rw.stat||r.stat;o.rw.stat.reborn=next;o.lvl=1;o.xp=0;o.attr={str:0,dex:0,vit:0,eng:0};o.attrPts=next*50;o.stage=1;o.wave=1;o.push=true;o.tpPend=(o.tpPend|0)+1}
    if(typeof c!=='undefined'&&c){c.tower=null;c.enemies=[];c.dirty=true;c.zoneShown=null}
    try{if(typeof F==='function')F()}catch(_){}
    try{if(typeof B==='function')B();else if(typeof save==='function')save()}catch(_){}
  }
  try{zD=doRebirth}catch(_){} try{window.zD=doRebirth}catch(_){}

  function patchModal(){
    const body=document.getElementById('mBody'); if(!body||!/chuyển sinh/i.test(body.textContent||''))return false;
    const n=count(), next=n+1, req=required(next);
    const walker=document.createTreeWalker(body,NodeFilter.SHOW_TEXT), nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const old=node.nodeValue||''; if(!old.trim())return;
      let neu=null;
      if(/chuyển sinh/i.test(old)&&/\d+\s*\/\s*\d+\s*lần/i.test(old)) neu=old.replace(/\d+\s*\/\s*\d+\s*lần/i,`${n}/${MAX} lần`);
      else if(/^\s*đạt cấp\s*\d+\s*:/i.test(old)) neu=`Đạt cấp ${req}: về cấp 1, giữ nguyên trang bị và toàn bộ võ công. Mỗi lần chuyển sinh tăng yêu cầu thêm 20 cấp.`;
      else if(/đã chuyển sinh/i.test(old)||/kháng tất cả|độ khó: quái/i.test(old)) neu=`Đã chuyển sinh: ${n}/${MAX} lần · hiện +${n*20}% kinh nghiệm, +${n*10}% sát thương.`;
      if(neu!==null && neu!==old) node.nodeValue=neu;
    });
    body.querySelectorAll('button').forEach(btn=>{
      const text=(btn.textContent||'').trim();
      if(!/^(cần cấp\s*\d+|đã đạt tối đa)/i.test(text))return;
      const label=next>MAX?'Đã đạt tối đa CS50':`Cần cấp ${req}`;
      if(text!==label)btn.textContent=label;
      const disabled=next>MAX||level()<req;
      if(btn.disabled!==disabled)btn.disabled=disabled;
      if(btn._vltkRebirth!==doRebirth){btn._vltkRebirth=doRebirth;btn.onclick=disabled?null:doRebirth}
    });
    return true;
  }
  function start(){
    const body=document.getElementById('mBody');if(!body)return;
    let scheduled=false;
    const ob=new MutationObserver(()=>{
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;patchModal()});
    });
    ob.observe(body,{childList:true,subtree:true});
    patchModal();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
