// Chat UI compatibility fix: never leave the world-chat log collapsed after sending.
(function(){
  function install(){
    var form=document.getElementById('u20in');
    if(!form || form.__vltkChatFix) return;
    form.__vltkChatFix=true;
    form.addEventListener('submit',function(){
      if(document.body.classList.contains('u20logoff')){
        var b=document.getElementById('u20lt');
        if(b) b.click();
      }
    },true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(install,800)});
  else setTimeout(install,800);
  setInterval(install,3000);
})();
