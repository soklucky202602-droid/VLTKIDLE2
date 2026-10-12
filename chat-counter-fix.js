/* World chat unread badge: the World channel is read as soon as it is selected. */
(function(){
  function worldIsSelected(){
    var tabs=document.querySelectorAll('[data-cc="w"]');
    for(var i=0;i<tabs.length;i++) if(tabs[i].classList.contains('on')) return true;
    return false;
  }

  function clearWorldBadges(){
    var chatN=document.getElementById('chatN');
    if(chatN) chatN.textContent='';
    document.querySelectorAll('#u20ct [data-lt="chat"] .ctn').forEach(function(el){el.textContent='';});
    document.querySelectorAll('[data-cc="w"] .ctn,[data-cc="w"] b').forEach(function(el){el.textContent='';});
  }

  function sync(){
    if(worldIsSelected()) clearWorldBadges();
  }

  function boot(){
    sync();
    document.addEventListener('click',function(ev){
      var tab=ev.target.closest && ev.target.closest('[data-cc="w"]');
      if(!tab) return;
      [0,16,50,150,300,500].forEach(function(ms){setTimeout(sync,ms);});
    },true);
    var root=document.getElementById('chatBox')||document.body;
    new MutationObserver(sync).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
    setInterval(sync,100);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
