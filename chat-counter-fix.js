/* Keep the main chat badge scoped to World chat only. */
(function(){
  function num(el){
    if(!el) return 0;
    var v=parseInt((el.textContent||'').trim(),10);
    return isFinite(v)?v:0;
  }

  var syncing=false;
  var lastRawTotal=null;

  function syncWorldChatBadge(){
    var badge=document.getElementById('chatN');
    var party=document.getElementById('chatPN');
    if(!badge) return;

    var raw=num(badge);
    if(!syncing){
      if(lastRawTotal===null || raw!==num(badge)) lastRawTotal=raw;
      else if(lastRawTotal===null) lastRawTotal=raw;
    }

    if(lastRawTotal===null) lastRawTotal=raw;
    var world=Math.max(0,lastRawTotal-num(party));
    var value=world?(world>9?'9+':String(world)):'';

    if(badge.textContent===value) return;
    syncing=true;
    badge.textContent=value;
    syncing=false;
  }

  function boot(){
    var badge=document.getElementById('chatN');
    if(badge) lastRawTotal=num(badge);
    syncWorldChatBadge();

    var observer=new MutationObserver(function(){
      if(syncing) return;
      var badge=document.getElementById('chatN');
      if(badge){
        var current=num(badge);
        if(current!==numText(lastRawTotal)) lastRawTotal=current;
      }
      syncWorldChatBadge();
    });

    function numText(v){
      return typeof v==='number' && isFinite(v)?v:0;
    }

    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    setInterval(function(){
      if(!syncing) syncWorldChatBadge();
    },500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
