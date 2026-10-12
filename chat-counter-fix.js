/* World chat unread badge: keep World independent from Party and clear when World is opened. */
(function(){
  function worldTab(){
    return document.querySelector('#chatHead .cch[data-cc="w"]');
  }

  function worldCounter(){
    var el=document.querySelector('#u20ct button[data-lt="chat"] .ctn');
    var n=parseInt((el&&el.textContent||'').trim(),10);
    return isNaN(n)?0:n;
  }

  function sync(){
    var badge=document.getElementById('chatN');
    if(!badge) return;

    /* World is the active/read channel: its unread badge must be empty. */
    if(worldTab() && worldTab().classList.contains('on')){
      badge.textContent='';
      return;
    }

    var n=worldCounter();
    badge.textContent=n>0?(n>9?'9+':String(n)):'';
  }

  function boot(){
    sync();
    var panel=document.getElementById('chatBox');
    if(panel){
      panel.addEventListener('click',function(ev){
        var tab=ev.target.closest && ev.target.closest('#chatHead .cch[data-cc="w"]');
        if(!tab) return;
        setTimeout(sync,0);
        setTimeout(sync,50);
        setTimeout(sync,150);
        setTimeout(sync,300);
      },true);
      new MutationObserver(sync).observe(panel,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
    }
    setInterval(sync,250);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
