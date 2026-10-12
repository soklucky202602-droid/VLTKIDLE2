/* Keep the main chat badge scoped to World chat only. */
(function(){
  function syncWorldChatBadge(){
    var badge=document.getElementById('chatN');
    if(!badge) return;
    var world=document.querySelector('#u20ct [data-lt="chat"] .ctn');
    if(!world) return;
    var value=(world.textContent||'').trim();
    if(badge.textContent!==value) badge.textContent=value;
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',syncWorldChatBadge,{once:true});
  }else{
    syncWorldChatBadge();
  }

  var observer=new MutationObserver(syncWorldChatBadge);
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  setInterval(syncWorldChatBadge,1000);
})();
