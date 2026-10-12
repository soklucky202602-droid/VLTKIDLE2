(()=>{
  const load=()=>{
    try{
      if(typeof loadServerSettings==='function') loadServerSettings();
    }catch(e){}
  };
  load();
  setInterval(load,30000);
})();
