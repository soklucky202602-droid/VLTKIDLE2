/* World chat unread badge: mirror the app's own World unread counter. */
(function(){
  function sync(){
    var badge=document.getElementById('chatN');
    var world=document.querySelector('#u20ct [data-lt="chat"] .ctn');
    if(!badge || !world) return;
    var value=(world.textContent||'').trim();
    if(badge.textContent!==value) badge.textContent=value;
  }

  function boot(){
    sync();
    var panel=document.getElementById('u20ct');
    if(panel){
      new MutationObserver(sync).observe(panel,{subtree:true,childList:true,characterData:true});
    }
    setInterval(sync,250);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
