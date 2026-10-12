/* VLTKIDLE2 — login presentation layer. Never replaces auth handlers. */
(function(){
  'use strict';
  var active=false, shell=null;
  function isLoginCandidate(root){
    if(!root||root===document.body||root.id==='app'||(root.closest&&root.closest('.vltk-login-shell')))return null;
    var tag=(root.tagName||'').toLowerCase();
    var cls=String(root.className||'').toLowerCase();
    var id=String(root.id||'').toLowerCase();
    if(tag!=='form'&&!/(auth|login|signin|sign-in|dangnhap|dang-nhap)/.test(cls+' '+id))return null;
    var pw=root.querySelector&&root.querySelector('input[type="password"]');
    if(!pw)return null;
    var fields=root.querySelectorAll('input');
    if(fields.length<2)return null;
    var text=(root.textContent||'').toLowerCase();
    var hints=['đăng nhập','dang nhap','tài khoản','tai khoan','mật khẩu','mat khau','login'];
    return hints.some(function(x){return text.indexOf(x)>=0})?root:null;
  }
  function decorate(form){
    if(active||!form)return;
    active=true;
    document.body.classList.add('vltk-login-active');
    var card=document.createElement('div');
    card.className='vltk-login-shell';
    card.innerHTML='<div class="vltk-login-card">'+
      '<div class="vltk-login-brand"><span class="seal">武</span><h1>VÕ LÂM IDLE</h1><p>NHẤT NIỆM GIANG HỒ · VẠN DẶM ĐỒNG HÀNH</p></div>'+
      '<div class="vltk-login-divider"></div><div class="vltk-login-mount"></div>'+
      '<div class="vltk-login-foot">GIANG HỒ MỞ CỬA <b>•</b> HÀNH TẨU BẰNG TÂM</div></div>';
    document.body.appendChild(card); shell=card;
    var mount=card.querySelector('.vltk-login-mount');
    mount.appendChild(form);
    form.classList.add('vltk-auth-form');
    var inputs=form.querySelectorAll('input');
    inputs.forEach(function(input,i){
      var field=document.createElement('div'); field.className='vltk-field';
      input.parentNode.insertBefore(field,input); field.appendChild(input);
      if(!input.getAttribute('placeholder')) input.placeholder=i===0?'Nhập tên tài khoản':'Nhập mật khẩu';
      var label=document.createElement('label'); label.textContent=i===0?'Tài khoản':'Mật khẩu';
      field.insertBefore(label,input);
    });
    var submit=form.querySelector('button[type="submit"],input[type="submit"]');
    if(submit){submit.classList.add('vltk-primary'); if(submit.tagName==='BUTTON')submit.textContent='ĐĂNG NHẬP GIANG HỒ';}
    form.querySelectorAll('button:not([type="submit"]),a').forEach(function(el){el.classList.add('vltk-secondary');});
    var observer=new MutationObserver(function(){
      if(!document.body.contains(form)){
        document.body.classList.remove('vltk-login-active');
        if(shell&&shell.parentNode)shell.parentNode.removeChild(shell);
        active=false;shell=null;observer.disconnect();
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  function scan(){
    if(active)return;
    var forms=document.querySelectorAll('form');
    for(var i=0;i<forms.length;i++){var c=isLoginCandidate(forms[i]);if(c){decorate(c);return;}}
    var named=document.querySelectorAll('[id],[class]');
    for(var j=0;j<named.length;j++){var n=isLoginCandidate(named[j]);if(n){decorate(n);return;}}
  }
  scan();
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
