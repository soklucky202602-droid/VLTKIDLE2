/* VLTKIDLE2 — new 2-criteria loot filter logic. UI is integrated by assistant-loot-filter.js. */
(function(){
'use strict';
var KEY='vltkidle2-loot-filter',state=load();
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');if(x&&typeof x==='object')return{minLines:Math.max(1,Math.min(6,+x.minLines||1)),element:x.element!==false}}catch(e){}return{minLines:1,element:true}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function slotOf(a){try{var s=typeof window.pA==='function'?window.pA(a&&a.d):'';return s?String(s):''}catch(e){return''}}
function ringOf(a){try{return typeof window.jA==='function'?String(window.jA(a)||''):''}catch(e){return''}}
function eqSlot(a){var s=slotOf(a);if(s==='ring'){var r=ringOf(a);if(r==='ring1'||r==='ring2')s=r}return s}
function isEq(a){var s=eqSlot(a);return s==='armor'||s==='amulet'||s==='belt'||s==='ring1'||s==='ring2'||s==='cuff'||s==='pendant'||s==='boot'}
function lines(a){if(!a)return 0;if(Array.isArray(a.mag))return a.mag.length;if(Array.isArray(a.attrs))return a.attrs.length;if(Array.isArray(a.attr))return a.attr.length;return 0}
function weaponElement(){try{var w=window.o&&window.o.eq&&window.o.eq.weapon;return w&&Number.isFinite(+w.s)?+w.s:null}catch(e){return null}}
var NH={0:{armor:4,amulet:4,belt:3,ring2:3,cuff:1,pendant:1,boot:2,ring1:2},1:{armor:2,amulet:2,belt:0,ring2:0,cuff:4,pendant:4,boot:3,ring1:3},2:{armor:0,amulet:0,belt:4,ring2:4,cuff:3,pendant:3,boot:1,ring1:1},3:{armor:1,amulet:1,belt:2,ring2:2,cuff:0,pendant:0,boot:4,ring1:4},4:{armor:3,amulet:3,belt:1,ring2:1,cuff:2,pendant:2,boot:0,ring1:0}};
function allowed(a){if(!a)return false;if(!isEq(a))return true;if(lines(a)<state.minLines)return false;if(state.element){var row=NH[weaponElement()],s=eqSlot(a),want=row&&row[s];if(want!==undefined&&Number(a.s)!==want)return false}return true}
function install(){
 if(typeof window.gA==='function'&&!window.gA.__vltk2Filter){var f=function(a){return allowed(a)};f.__vltk2Filter=true;window.gA=f}
 if(typeof window.el==='function'&&!window.el.__vltk2Wrapped){var old=window.el,f=function(a){return allowed(a)?old(a):false};f.__vltk2Wrapped=true;window.el=f}
 try{if(window.o&&window.o.lootF){window.o.lootF.custom=false;window.o.lootF.pickAll=false}if(window.o&&window.o.lootAdv!==undefined)window.o.lootAdv=false}catch(e){}
}
function boot(){install();setInterval(install,1000)}
var n=0,t=setInterval(function(){n++;if(document.body&&typeof window.gA==='function'){clearInterval(t);boot()}else if(n>240)clearInterval(t)},250);
window.VLTK2LootFilter={getState:function(){return{minLines:state.minLines,element:state.element}},setLines:function(v){state.minLines=Math.max(1,Math.min(6,+v||1));save();install()},setElement:function(v){state.element=!!v;save();install()},allowed:allowed};
})();