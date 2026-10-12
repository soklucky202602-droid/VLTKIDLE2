(function(){
  'use strict';
  function mount(){
    var top=document.getElementById('topCtl');
    var ride=document.getElementById('rideBtn');
    var mode=document.getElementById('inBtn');
    if(!top||!ride||!mode)return;
    if(mode.parentElement!==top) top.insertBefore(mode,ride);
    ride.title=ride.title||'Lên ngựa / Xuống ngựa';
  }
  mount();
  document.addEventListener('DOMContentLoaded',mount,{once:true});
})();
