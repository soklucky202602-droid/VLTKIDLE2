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
    buildCleanForm(root);
  }
  function buildCleanForm(root){
    root.classList.add('vltk-login-clean-root');
    var textInputs=[], checks=[], buttons=[], anchors=[], hidden=[];
    var inputs=root.querySelectorAll('input');
    for(var j=0;j<inputs.length;j++){
      var input=inputs[j];
      if(input.type==='hidden'){hidden.push(input);continue;}
      if(input.type==='checkbox'||input.type==='radio')checks.push(input);
      else if(input.type!=='submit'&&input.type!=='button')textInputs.push(input);
      else buttons.push(input);
    }
    var btns=root.querySelectorAll('button');
    for(var b=0;b<btns.length;b++)buttons.push(btns[b]);
    var as=root.querySelectorAll('a');
    for(var a=0;a<as.length;a++)if(as[a].textContent.trim())anchors.push(as[a]);

    var form=document.createElement('div');form.className='vltk-clean-form';
    for(var h=0;h<hidden.length;h++)form.appendChild(hidden[h]);
    for(var k=0;k<textInputs.length;k++){
      var inp=textInputs[k], field=document.createElement('div');field.className='vltk-field';
      var label=document.createElement('label');
      var isPw=inp.type==='password';
      label.textContent=isPw?'MẬT KHẨU':'TÀI KHOẢN';
      field.appendChild(label);field.appendChild(inp);form.appendChild(field);
      if(!inp.placeholder)inp.placeholder=isPw?'Nhập mật khẩu':'Nhập tên tài khoản';
    }
    if(checks.length){
      var opts=document.createElement('div');opts.className='vltk-clean-options';
      for(var c=0;c<checks.length;c++){
        var wrap=document.createElement('label');wrap.className='vltk-check';
        wrap.appendChild(checks[c]);
        wrap.appendChild(document.createTextNode(c?'Nhớ tài khoản':'Hiện mật khẩu'));
        opts.appendChild(wrap);
      }
      form.appendChild(opts);
    }
    if(buttons.length||anchors.length){
      var actions=document.createElement('div');actions.className='vltk-clean-actions';
      for(var q=0;q<buttons.length;q++){
        buttons[q].classList.add('vltk-primary');
        actions.appendChild(buttons[q]);
      }
      for(var r=0;r<anchors.length;r++){
        anchors[r].classList.add('vltk-secondary');actions.appendChild(anchors[r]);
      }
      form.appendChild(actions);
    }
    root.innerHTML='';root.appendChild(form);
  }
  function cleanup(){if(!active)return;document.body.classList.remove('vltk-login-active');if(shell&&shell.parentNode)shell.parentNode.removeChild(shell);active=false;shell=null;moved=null;}
  function scan(){if(!active){var root=findLoginRoot();if(root)decorate(root)}}
  scan();new MutationObserver(function(){if(active){if(moved&&!document.body.contains(moved))cleanup();}else scan();}).observe(document.body,{childList:true,subtree:true});
})();
