/* Recover false-positive character locks after reload/deploy.
 * Only touches jxidle-slot-* locks used by the game tab guard.
 */
(function(){
  'use strict';
  if(!navigator.locks||!navigator.locks.request)return;
  var native=navigator.locks.request.bind(navigator.locks);
  var ch=null;
  try{ch=new BroadcastChannel('jxidle-tab-recovery')}catch(e){}
  var owned=new Set();
  if(ch) ch.onmessage=function(ev){
    var m=ev.data||{};
    if(m.t==='probe'&&owned.has(m.slot)){
      try{ch.postMessage({t:'alive',slot:m.slot})}catch(e){}
    }
  };
  navigator.locks.request=function(name,opts,cb){
    if(!/^jxidle-slot-\d+$/.test(String(name))||!opts||!opts.ifAvailable||!ch){
      return native(name,opts,cb);
    }
    var slot=String(name).slice(12);
    var alive=false;
    var onAlive=function(ev){
      var m=ev.data||{};
      if(m.t==='alive'&&String(m.slot)===slot)alive=true;
    };
    ch.addEventListener('message',onAlive);
    try{ch.postMessage({t:'probe',slot:slot})}catch(e){}
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        ch.removeEventListener('message',onAlive);
        if(alive){
          native(name,opts,cb).then(resolve,reject);
          return;
        }
        /* No live game tab answered. If a stale lock remains, steal it once. */
        native(name,{steal:true},function(lock){
          owned.add(slot);
          var out;
          try{out=cb(lock||{name:name,mode:'exclusive'})}catch(e){owned.delete(slot);throw e}
          return Promise.resolve(out).finally(function(){owned.delete(slot)});
        }).then(resolve,reject);
      },250);
    });
  };
})();
