// Chat UI: compact JX-style chat + input-safe touch handling.
(function(){
  'use strict';

  var STYLE_ID='vltk-chat-ux';

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=''
      /* Closed state: small fixed pill like the reference UI. */
      +'#chatBox{position:fixed!important;z-index:80!important;touch-action:none;-webkit-user-select:none;user-select:none;overscroll-behavior:contain;} '
      +'#chatBox:not(.open){left:8px!important;right:auto!important;top:auto!important;bottom:52px!important;width:auto!important;height:auto!important;align-items:flex-start!important;} '
      +'#chatBtn{position:relative!important;width:auto!important;min-width:72px!important;height:30px!important;padding:0 12px 0 10px!important;border-radius:16px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;background:linear-gradient(180deg,#292822 0%,#12120f 100%)!important;border:1px solid #766f5b!important;box-shadow:0 1px 0 #000,0 0 0 1px #0008,0 2px 7px #0009!important;color:#eee8d0!important;font:600 12px/28px var(--font,Tahoma)!important;text-shadow:0 1px 2px #000!important;} '
      +'#chatBtn::before{content:"▣";font-size:11px;line-height:1;color:#fff!important;} '
      +'#chatBtn b{top:-5px!important;right:-5px!important;} '
      /* Open state: compact floating panel, never fills the screen. */
      +'#chatBox.open{left:8px!important;right:auto!important;top:auto!important;bottom:54px!important;width:min(360px,calc(100vw - 16px))!important;height:min(44vh,320px)!important;max-height:320px!important;border-radius:7px!important;overflow:hidden!important;background:rgba(13,14,12,.97)!important;border:1px solid #756d55!important;box-shadow:0 3px 18px #000c,0 0 0 1px #0008!important;touch-action:auto!important;} '
      +'#chatBox.open #chatHead{min-height:31px!important;height:31px!important;box-sizing:border-box!important;padding:4px 7px!important;background:linear-gradient(180deg,#3b392f,#1c1c17)!important;border-bottom:1px solid #665f4b!important;color:#eee8d0!important;} '
      +'#chatBox.open #chatLines{min-height:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;overscroll-behavior-y:contain!important;padding:5px 7px!important;} '
      +'#chatBox.open #chatIn{min-height:42px!important;height:42px!important;box-sizing:border-box!important;padding:5px!important;background:linear-gradient(#181914,#0e0f0d)!important;border-top:1px solid #454333!important;display:flex!important;align-items:center!important;gap:4px!important;} '
      +'#chatTxt{flex:1 1 auto!important;min-width:0!important;height:30px!important;min-height:30px!important;box-sizing:border-box!important;padding:4px 7px!important;border-radius:4px!important;border:1px solid #625c49!important;background:#090a09!important;color:#f2edd8!important;font-size:13px!important;outline:none!important;} '
      +'#chatTxt:focus{border-color:#a59667!important;box-shadow:0 0 0 1px #a5966722!important;} '
      +'#chatBox.open #chatIn button{min-width:50px!important;height:30px!important;min-height:30px!important;padding:0 9px!important;border-radius:4px!important;} '
      +'#modeSw{touch-action:none;-webkit-user-select:none;user-select:none;} '
      /* Wide JX 2.0 layout: keep Chat just above the mode switch. */ '
      +'body.u20 #chatBox:not(.open){left:8px!important;right:auto!important;bottom:52px!important;} '
      +'body.u20 #chatBox.open{left:8px!important;right:auto!important;bottom:54px!important;top:auto!important;width:min(360px,calc(100vw - 16px))!important;height:min(48vh,340px)!important;max-height:340px!important;} '
      +'body.u20 #chatBox.open #chatLines{max-height:none!important;}';
    document.head.appendChild(s);
  }

  function stopCamera(e){
    // Arena/camera handlers are higher in the DOM. Stop Chat gestures here.
    // Never stop the input's own event chain so focus and the mobile keyboard work.
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

    var mode=document.getElementById('modeSw');
    if(mode && !mode.__vltkChatUx){
      mode.__vltkChatUx=true;
      ['pointerdown','pointermove','pointerup','pointercancel','mousedown','mouseup','touchstart','touchmove','touchend','click'].forEach(function(type){
        mode.addEventListener(type,function(e){e.stopPropagation();},true);
      });
    }

    // Keep the world-chat log visible after sending.
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
