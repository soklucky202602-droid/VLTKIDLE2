// Chat UI: compact JX-style chat + input-safe touch handling.
(function(){
  'use strict';

  var STYLE_ID='vltk-chat-ux';

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=''
      +'#chatBox{touch-action:none;-webkit-user-select:none;user-select:none;overscroll-behavior:contain;} '
      +'#chatBox:not(.open){width:auto!important;left:8px!important;bottom:52px!important;align-items:flex-start;} '
      +'#chatBtn{width:auto!important;min-width:68px!important;height:28px!important;padding:0 12px!important;border-radius:15px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;background:linear-gradient(#24231f,#11110f)!important;border:1px solid #756f5b!important;box-shadow:0 1px 0 #000,0 0 0 1px #0008!important;color:#eee8d0!important;font:600 12px/26px var(--font,Tahoma)!important;text-shadow:0 1px 2px #000!important;} '
      +'#chatBtn::before{content:"▣";font-size:11px;color:#fff!important;} '
      +'#chatBtn b{top:-5px!important;right:-5px!important;} '
      +'#chatBox.open{left:8px!important;right:8px!important;top:auto!important;bottom:54px!important;width:min(420px,calc(100vw - 16px))!important;height:min(48vh,360px)!important;max-height:360px!important;border-radius:7px!important;overflow:hidden!important;touch-action:auto!important;} '
      +'#chatBox.open #chatHead{min-height:30px!important;box-sizing:border-box!important;padding:4px 7px!important;} '
      +'#chatBox.open #chatLines{-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;} '
      +'#chatBox.open #chatIn{min-height:42px!important;box-sizing:border-box!important;padding:5px!important;background:#11120f!important;} '
      +'#chatTxt{font-size:13px!important;min-height:30px!important;box-sizing:border-box!important;border-radius:3px!important;} '
      +'#chatBox.open #chatIn button{min-width:48px!important;min-height:30px!important;} '
      +'#modeSw{touch-action:none;-webkit-user-select:none;user-select:none;} '
      +'body.u20 #chatBox:not(.open){left:8px!important;bottom:52px!important;} '
      +'body.u20 #chatBox.open{left:8px!important;right:auto!important;bottom:54px!important;top:auto!important;width:min(420px,calc(100vw - 16px))!important;height:min(58vh,420px)!important;}';
    document.head.appendChild(s);
  }

  function stopCamera(e){
    // Camera/arena handlers listen higher in the DOM. Stop the gesture here,
    // but never preventDefault on the text input itself so the keyboard opens normally.
    if(e.target && (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA' || e.target.isContentEditable)) return;
    e.stopPropagation();
  }

  function install(){
    addStyle();
    var box=document.getElementById('chatBox');
    if(!box || box.__vltkChatUx) return;
    box.__vltkChatUx=true;

    ['pointerdown','pointermove','pointerup','pointercancel','mousedown','mouseup','touchstart','touchmove','touchend','click'].forEach(function(type){
      box.addEventListener(type,stopCamera,true);
    });

    // The mode switch sits beside chat and can otherwise be interpreted as a
    // world-drag gesture on touch devices.
    var mode=document.getElementById('modeSw');
    if(mode && !mode.__vltkChatUx){
      mode.__vltkChatUx=true;
      ['pointerdown','pointermove','pointerup','pointercancel','mousedown','mouseup','touchstart','touchmove','touchend','click'].forEach(function(type){
        mode.addEventListener(type,function(e){e.stopPropagation();},true);
      });
    }

    // Do not leave the world-chat log collapsed after sending.
    var form=document.getElementById('u20in');
    if(form && !form.__vltkChatFix){
      form.__vltkChatFix=true;
      form.addEventListener('submit',function(){
        if(document.body.classList.contains('u20logoff')){
          var b=document.getElementById('u20lt');
          if(b) b.click();
        }
      },true);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(install,300);});
  }else{
    setTimeout(install,300);
  }
  setInterval(install,1500);
})();
