/* Keep the main chat badge scoped to World chat only. */
(function(){
  function num(el){
    if(!el) return 0;
    var v=parseInt((el.textContent||'').trim(),10);
    return isFinite(v)?v:0;
  }

  var lastRawTotal=null;
  var skipNextMutation=false;

  function syncWorldChatBadge(){
    var badge=document.getElementById('chatN');
    var party=document.getElementById('chatPN');
    if(!badge) return;

    if(lastRawTotal===null) lastRawTotal=num(badge);
    var world=Math.max(0,lastRawTotal-num(party));
    var value=world?(world>9?'9+':String(world)):'';

    if(badge.textContent===value) return;
    skipNextMutation=true;
    badge.textContent=value;
  }

  function boot(){
    var badge=document.getElementById('chatN');
    if(badge) lastRawTotal=num(badge);
    syncWorldChatBadge();

    var observer=new MutationObserver(function(){
      if(skipNextMutation){
        skipNextMutation=false;
        return;
      }

      var current=document.getElementById('chatN');
      if(current) lastRawTotal=num(current);
      syncWorldChatBadge();
    });

    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    setInterval(function(){
      var current=document.getElementById('chatN');
      if(current){
        var value=num(current);
        var displayed=(current.textContent||'').trim();
        var displayedNum=displayed==='9+'?10:num(current);
        var expected=lastRawTotal===null?value:Math.max(0,lastRawTotal-num(document.getElementById('chatPN')));
        if(value!==lastRawTotal && displayedNum!==expected) lastRawTotal=value;
      }
      syncWorldChatBadge();
    },500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
