/* World chat unread badge: keep the World badge read/unread state independent. */
(function(){
  var readBase=0;
  var opened=false;

  function worldTab(){
    return document.querySelector('#u20ct .cch[data-cc="w"]');
  }

  function badgeNodes(){
    var tab=worldTab();
    var out=[];
    if(tab){
      tab.querySelectorAll('.ctn,b').forEach(function(el){ out.push(el); });
    }
    var main=document.getElementById('chatN');
    if(main) out.push(main);
    return out;
  }

  function rawWorldCount(){
    var tab=worldTab();
    if(!tab) return 0;
    var el=tab.querySelector('.ctn');
    var n=parseInt((el&&el.textContent||'').trim(),10);
    return isNaN(n)?0:n;
  }

  function clearBadges(){
    badgeNodes().forEach(function(el){ el.textContent=''; });
  }

  function sync(){
    var tab=worldTab();
    if(!tab) return;

    var raw=rawWorldCount();

    if(opened){
      clearBadges();
      return;
    }

    /* The app's unread value is cumulative. Only show messages received after
       the last time World was opened. */
    var unread=raw-readBase;
    if(unread<0){
      readBase=0;
      unread=raw;
    }
    var text=unread>0?(unread>9?'9+':String(unread)):'';
    badgeNodes().forEach(function(el){ el.textContent=text; });
  }

  function markWorldRead(){
    readBase=rawWorldCount();
    opened=true;
    clearBadges();
    setTimeout(sync,0);
    setTimeout(sync,50);
    setTimeout(sync,150);
    setTimeout(sync,300);
  }

  function boot(){
    var panel=document.getElementById('u20ct');
    if(!panel) return;

    panel.addEventListener('click',function(ev){
      var tab=ev.target.closest && ev.target.closest('.cch[data-cc="w"]');
      if(!tab) return;
      markWorldRead();
    },true);

    panel.addEventListener('click',function(ev){
      var tab=ev.target.closest && ev.target.closest('.cch[data-cc="p"]');
      if(!tab) return;
      opened=false;
      sync();
    },true);

    new MutationObserver(function(){
      var tab=worldTab();
      if(tab && tab.classList.contains('on')){
        opened=true;
        clearBadges();
      }
      sync();
    }).observe(panel,{subtree:true,childList:true,characterData:true});

    sync();
    setInterval(sync,250);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
