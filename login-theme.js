/* VLTKIDLE2 — login presentation layer. Auth logic stays untouched. */
(function(){
  'use strict';
  var active=false, shell=null, moved=null;
  function textOf(el){return String(el&&el.textContent||'').toLowerCase();}
  function looksLikeLogin(el){
    if(!el||el===document.body||el.id==='app'||(el.closest&&el.closest('.vltk-login-shell')))return false;
    var inputs=el.querySelectorAll&&el.querySelectorAll('input');
    if(!inputs||inputs.length<2||!el.querySelector('input[type="password"]'))return false;
    return /đăng nhập|dang nhap|tài khoản|tai khoan|mật khẩu|mat khau|login|đăng ký|dang ky/.test(textOf(el));
  }
  function findLoginRoot(){
    var pw=document.querySelectorAll('input[type="password"]');
    for(var i=0;i<pw.length;i++){
      var n=pw[i];
      while(n&&n!==document.body&&n!==document.documentElement){if(looksLikeLogin(n))return n;n=n.parentElement;}
    }
    return null;
  }
  function decorate(root){
    if(active||!root)return;
    active=true;moved=root;document.body.classList.add('vltk-login-active');
    var card=document.createElement('div');card.className='vltk-login-shell';
    card.innerHTML='<div class="vltk-login-card"><div class="vltk-login-brand"><div class="seal">武</div><h1>VÕ LÂM IDLE</h1><p>NHẤT NIỆM GIANG HỒ · VẠN DẶM ĐỒNG HÀNH</p></div><div class="vltk-login-divider"></div><div class="vltk-login-mount"></div><div class="vltk-login-foot">GIANG HỒ MỞ CỬA <b>•</b> HÀNH TẨU BẰNG TÂM</div></div>';
    document.body.appendChild(card);shell=card;card.querySelector('.vltk-login-mount').appendChild(root);root.classList.add('vltk-auth-form');
    var inputs=root.querySelectorAll('input');
    for(var i=0;i<inputs.length;i++){var input=inputs[i];if(input.type==='hidden'||input.type==='submit'||input.type==='button'||input.type==='checkbox'||input.type==='radio')continue;if(!input.placeholder)input.placeholder=input.type==='password'?'Nhập mật khẩu':'Nhập tên tài khoản';}
    var submit=root.querySelector('button[type="submit"],input[type="submit"],button');
    if(submit)submit.classList.add('vltk-primary');
  }
  function cleanup(){if(!active)return;document.body.classList.remove('vltk-login-active');if(shell&&shell.parentNode)shell.parentNode.removeChild(shell);active=false;shell=null;moved=null;}
  function scan(){if(!active){var root=findLoginRoot();if(root)decorate(root)}}
  scan();new MutationObserver(function(){if(active){if(moved&&!document.body.contains(moved))cleanup();}else scan();}).observe(document.body,{childList:true,subtree:true});
})();
