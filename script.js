
// MindSight Trainer with blackout + buzz + beep, fixed tap bug, updated blackout timer (30s – 90s), audio fix
const COLOURS=['Red','Green','Blue','Yellow','Orange','Purple','Pink','Black','White','Gray','Cyan','Brown'];
const SHAPES=['Triangle','Square','Circle','Star','Heart','Cross','Arrow','Pentagon','Crescent','Diamond'];
let mode='colours';let chosen=[];let revealed=false;let currentItem=null;
let blackoutTimer=null;let blackoutActive=false;let originalBackground=null;let originalShapeHTML=null;
let audioCtx=null;

const menu=document.getElementById('menu');const setup=document.getElementById('setup');const game=document.getElementById('game');
const selectArea=document.getElementById('selectArea');const shapeContainer=document.getElementById('shapeContainer');
const displayArea=document.getElementById('displayArea');const nameOverlay=document.getElementById('nameOverlay');

function initAudio(){if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();}}

function renderOptions(){selectArea.innerHTML='';const list=(mode==='colours')?COLOURS:SHAPES;list.forEach(item=>{
 const row=document.createElement('label');row.className='item';
 const c=document.createElement('input');c.type='checkbox';c.value=item;c.checked=chosen.includes(item);
 c.addEventListener('change',()=>{if(c.checked){chosen.push(item);}else{chosen=chosen.filter(x=>x!==item);}});
 const sw=document.createElement('span');sw.className='swatch';if(mode==='colours'){sw.style.background=item.toLowerCase();if(item.toLowerCase()==='white'){sw.style.border='1px solid #ccc';}}else{sw.style.background='#000';}
 const txt=document.createElement('span');txt.textContent=item;row.appendChild(c);row.appendChild(sw);row.appendChild(txt);selectArea.appendChild(row);});}
function setMode(newMode){mode=newMode;chosen=[];renderOptions();}
function showMenu(){menu.classList.remove('hidden');setup.classList.add('hidden');game.classList.add('hidden');}
function showSetup(){menu.classList.add('hidden');setup.classList.remove('hidden');game.classList.add('hidden');renderOptions();}
function showGame(){if(chosen.length===0){alert('Please choose at least 1 item.');return;}menu.classList.add('hidden');setup.classList.add('hidden');game.classList.remove('hidden');revealed=false;nextItem();}
function nextItem(){currentItem=chosen[Math.floor(Math.random()*chosen.length)];revealed=false;nameOverlay.classList.add('hidden');
 if(mode==='colours'){shapeContainer.classList.add('hidden');displayArea.style.background=currentItem.toLowerCase();speak('New colour');}
 else{displayArea.style.background='#ffffff';shapeContainer.classList.remove('hidden');shapeContainer.innerHTML=getShapeSVG(currentItem);speak('New shape');}
 originalBackground=displayArea.style.background;originalShapeHTML=shapeContainer.innerHTML;
 if(blackoutTimer)clearTimeout(blackoutTimer);
 const delay=(30 + Math.random() * 60) * 1000;  // 30s – 90s
 blackoutTimer=setTimeout(startBlackout,delay);
}
function revealName(){nameOverlay.textContent=currentItem;nameOverlay.classList.remove('hidden');speak(currentItem);}
function handleTap(){initAudio();if(blackoutActive)return;if(!revealed){revealed=true;revealName();}else{nextItem();}}
function getShapeSVG(name){const n=name.toLowerCase();switch(n){
 case'triangle':return`<svg viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#000"/></svg>`;
 case'square':return`<svg viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill="#000"/></svg>`;
 case'circle':return`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#000"/></svg>`;
 case'star':return`<svg viewBox="0 0 100 100"><polygon fill="#000" points="50,5 61,38 95,38 66,59 76,95 50,72 24,95 34,59 5,38 39,38"/></svg>`;
 case'heart':return`<svg viewBox="0 0 100 100"><path d="M50 88 L20 52 C0 32 20 8 40 20 C47 24 50 32 50 32 C50 32 53 24 60 20 C80 8 100 32 80 52 Z" fill="#000"/></svg>`;
 case'cross':return`<svg viewBox="0 0 100 100"><path d="M40 5 h20 v35 h35 v20 h-35 v35 h-20 v-35 h-35 v-20 h35z" fill="#000"/></svg>`;
 case'arrow':return`<svg viewBox="0 0 100 100"><path d="M10 55 h50 v15 l30-20 -30-20 v15 h-50z" fill="#000"/></svg>`;
 case'pentagon':return`<svg viewBox="0 0 100 100"><polygon points="50,5 95,38 77,95 23,95 5,38" fill="#000"/></svg>`;
 case'crescent':return`<svg viewBox="0 0 100 100"><path d="M60 10a40 40 0 1 0 0 80a32 40 0 1 1 0 -80z" fill="#000"/></svg>`;
 case'diamond':return`<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="#000"/></svg>`;
 default:return`<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="#000"/></svg>`;}}
function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);speechSynthesis.speak(u);}catch(e){}}

function playBuzz(){try{initAudio();if(!audioCtx)return;const osc=audioCtx.createOscillator();osc.type="square";osc.frequency.setValueAtTime(60,audioCtx.currentTime);const gain=audioCtx.createGain();gain.gain.setValueAtTime(0.4,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.5);osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+0.5);}catch(e){console.error(e);}}
function playBeep(){try{initAudio();if(!audioCtx)return;const osc=audioCtx.createOscillator();osc.type="sine";osc.frequency.setValueAtTime(880,audioCtx.currentTime);const gain=audioCtx.createGain();gain.gain.setValueAtTime(0.4,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.2);osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+0.2);}catch(e){console.error(e);}}

function startBlackout(){blackoutActive=true;originalBackground=displayArea.style.background;originalShapeHTML=shapeContainer.innerHTML;displayArea.style.background="black";shapeContainer.classList.add("hidden");nameOverlay.classList.add("hidden");playBuzz();setTimeout(endBlackout,10000);}
function endBlackout(){blackoutActive=false;displayArea.style.background=originalBackground;shapeContainer.classList.remove("hidden");shapeContainer.innerHTML=originalShapeHTML;playBeep();}

document.getElementById('btnSetup').addEventListener('click',showSetup);
document.getElementById('btnPlay').addEventListener('click',showGame);
document.getElementById('btnBackMenu').addEventListener('click',showMenu);
document.getElementById('btnApply').addEventListener('click',showMenu);
document.getElementById('btnBackFromGame').addEventListener('click',showMenu);
// Only touchend to avoid double fire
displayArea.addEventListener('touchend',(e)=>{e.preventDefault();handleTap();},{passive:false});
setMode('colours');showMenu();
