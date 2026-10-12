/* World chat unread badge: reset immediately when World is opened. */
(function(){
  function isWorldOpen(){
    var tab=document.querySelector('#u20ct .cch[data-cc="w"]');
    return !!(tab && tab.classList.contains('on'));
  }

  function sync(){
    var badge=document.getElementById('chatN');
    var world=document.querySelector('#u20ct [data-lt="chat"] .ctn');
    if(!badge) return;

    /* Once World is opened, its unread count is read and must stay cleared. */
    if(isWorldOpen()){
      if(badge.textContent) badge.textContent='';
      if(world && world.textContent) world.textContent='';
      return;
    }

    if(!world) return;
    var value=(world.textContent||'').trim();
    if(badge.textContent!==value) badge.textContent=value;
  }

  function boot(){
    sync();

    var panel=document.getElementById('u20ct');
    if(panel){
      panel.addEventListener('click',function(ev){
        var tab=ev.target.closest && ev.target.closest('.cch[data-cc="w"]');
        if(!tab) return;
        /* Let the game's own handler run, then force the read state visually. */
        setTimeout(sync,0);
        setTimeout(sync,50);
        setTimeout(sync,150);
        setTimeout(sync,300);
      },true);

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
