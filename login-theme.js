/* VLTKIDLE2 — login presentation layer. Auth handlers/elements are preserved. */
(function(){
  'use strict';
  var active=false,shell=null,root=null;
  function txt(el){return String(el&&el.textContent||'').toLowerCase()}
  function isCandidate(el){
    if(!el||el===document.body||el.id==='app'||(el.closest&&el.closest('.vltk-login-shell')))return false;
    var ins=el.querySelectorAll&&el.querySelectorAll('input');
    return !!(ins&&ins.length>=2&&el.querySelector('input[type="password"]')&&/đăng nhập|tài khoản|mật khẩu|login/.test(txt(el)));
  }
  function findRoot(){
    var pw=document.querySelectorAll('input[type="password"]');
    for(var i=0;i<pw.length;i++){
      var n=pw[i];
      while(n&&n!==document.body){if(isCandidate(n))return n;n=n.parentElement}
    }
    return null;
  }
  function move(el,to){if(el&&to)to.appendChild(el)}
  function decorate(r){
    if(active||!r)return;
    active=true;root=r;document.body.classList.add('vltk-login-active');
    var card=document.createElement('div');card.className='vltk-login-shell';
    card.innerHTML='<div class="vltk-login-card">'+
      '<div class="vltk-login-brand"><div class="seal">武</div><h1>VÕ LÂM IDLE</h1><p>NHẤT NIỆM GIANG HỒ · VẠN DẶM ĐỒNG HÀNH</p></div>'+
      '<div class="vltk-login-divider"></div><div class="vltk-login-mount">'+
      '<div class="vltk-clean-fields"></div><div class="vltk-clean-options"></div><div class="vltk-clean-actions"></div></div>'+
      '<div class="vltk-login-foot">GIANG HỒ MỞ CỬA <b>•</b> HÀNH TẨU BẰNG TÂM</div></div>';
    document.body.appendChild(card);shell=card;
    var fields=card.querySelector('.vltk-clean-fields'),opts=card.querySelector('.vltk-clean-options'),actions=card.querySelector('.vltk-clean-actions');
    var inputs=r.querySelectorAll('input');
    for(var i=0;i<inputs.length;i++){
      var input=inputs[i];
      if(input.type==='hidden'||input.type==='submit'||input.type==='button'||input.type==='checkbox'||input.type==='radio')continue;
      var box=document.createElement('div');box.className='vltk-field';
      var label=document.createElement('label');label.textContent=input.type==='password'?'MẬT KHẨU':'TÀI KHOẢN';
      box.appendChild(label);box.appendChild(input);fields.appendChild(box);
      if(!input.placeholder)input.placeholder=input.type==='password'?'Nhập mật khẩu':'Nhập tên tài khoản';
    }
    var checks=r.querySelectorAll('input[type="checkbox"]');
    for(var j=0;j<checks.length;j++){
      var cbox=document.createElement('label');cbox.className='vltk-check';cbox.appendChild(checks[j]);
      var parentText=(checks[j].parentElement&&checks[j].parentElement.textContent||'').replace(/\s+/g,' ').trim();
      cbox.appendChild(document.createTextNode(parentText.replace(/^(☐|□)\s*/,'').replace(/^(true|false)\s*/i,'')|| (j===0?'Hiện mật mã':'Nhớ tài khoản')));opts.appendChild(cbox);
    }
    var buttons=r.querySelectorAll('button,input[type="submit"],a');
    for(var k=0;k<buttons.length;k++){
      var b=buttons[k];
      if(!b||b===checks[k])continue;
      var label=txt(b);
      if(b.tagName==='A'&&!/đăng ký|dang ky|đăng nhập|dang nhap|login/.test(label))continue;
      b.classList.add(/đăng ký|dang ky/.test(label)?'vltk-secondary':'vltk-primary');
      if(b.classList.contains('vltk-primary')&&b.tagName==='BUTTON')b.textContent='ĐĂNG NHẬP GIANG HỒ';
      actions.appendChild(b);
    }
    /* Hide only the old visual wrapper; moved controls remain fully functional. */
    r.classList.add('vltk-login-source');
  }
  function cleanup(){
    if(!active)return;
    document.body.classList.remove('vltk-login-active');
    if(shell&&shell.parentNode)shell.parentNode.removeChild(shell);
    active=false;shell=null;root=null;
  }
  function scan(){if(!active){var r=findRoot();if(r)decorate(r)}}
  scan();new MutationObserver(function(){if(active){if(root&&!document.body.contains(root))cleanup()}else scan()}).observe(document.body,{childList:true,subtree:true});
})();
