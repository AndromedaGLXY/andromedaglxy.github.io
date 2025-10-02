
// MindSight Trainer: Colours & Shapes (no stats, tap-to-reveal)

// Data
const COLOURS = ['Red','Green','Blue','Yellow','Orange','Purple','Pink','Black','White','Gray','Cyan','Brown'];
const SHAPES = ['Triangle','Square','Circle','Star','Heart','Cross','Arrow','Pentagon','Crescent','Diamond'];

// State
let mode = 'colours';
let chosen = [];
let revealed = false;
let currentItem = null;

// DOM
const menu = document.getElementById('menu');
const setup = document.getElementById('setup');
const game = document.getElementById('game');

const selectArea = document.getElementById('selectArea');
const shapeContainer = document.getElementById('shapeContainer');
const displayArea = document.getElementById('displayArea');
const nameOverlay = document.getElementById('nameOverlay');

function renderOptions() {
  selectArea.innerHTML = '';
  const list = (mode === 'colours') ? COLOURS : SHAPES;
  list.forEach(item => {
    const row = document.createElement('label');
    row.className = 'item';
    const c = document.createElement('input');
    c.type = 'checkbox'; c.value = item;
    c.checked = chosen.includes(item);
    c.addEventListener('change', () => {
      if (c.checked) {
        if (chosen.length >= 6) { c.checked = false; alert('Choose up to 6.'); return; }
        chosen.push(item);
      } else {
        chosen = chosen.filter(x => x !== item);
      }
    });

    const sw = document.createElement('span');
    sw.className = 'swatch';
    if (mode === 'colours') {
      sw.style.background = item.toLowerCase();
      sw.style.border = (item.toLowerCase()==='white') ? '1px solid #ccc' : '1px solid #ddd';
    } else {
      sw.style.background = '#000';
    }

    const txt = document.createElement('span');
    txt.textContent = item;

    row.appendChild(c); row.appendChild(sw); row.appendChild(txt);
    selectArea.appendChild(row);
  });
}

function setMode(newMode){
  mode = newMode;
  chosen = [];
  renderOptions();
}

// Screens
function showMenu(){ menu.classList.remove('hidden'); setup.classList.add('hidden'); game.classList.add('hidden'); }
function showSetup(){ menu.classList.add('hidden'); setup.classList.remove('hidden'); game.classList.add('hidden'); renderOptions(); }
function showGame(){
  if (chosen.length === 0) { alert('Please choose at least 1 item (up to 6).'); return; }
  menu.classList.add('hidden'); setup.classList.add('hidden'); game.classList.remove('hidden');
  revealed = false;
  nextItem();
}

// Game logic
function nextItem(){
  currentItem = chosen[Math.floor(Math.random()*chosen.length)];
  revealed = false;
  nameOverlay.classList.add('hidden');
  if (mode === 'colours') {
    shapeContainer.classList.add('hidden');
    displayArea.style.background = currentItem.toLowerCase();
    speak("New colour");   // 👈 added line
  } else {
    displayArea.style.background = '#ffffff';
    shapeContainer.classList.remove('hidden');
    shapeContainer.innerHTML = getShapeSVG(currentItem);
    speak("New shape");    // 👈 added line
  }
}

function revealName(){
  nameOverlay.textContent = currentItem;
  nameOverlay.classList.remove('hidden');
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentItem);
    speechSynthesis.speak(u);
  } catch(e){}
}

function handleTap(){
  if (!revealed) {
    revealed = true;
    revealName();
  } else {
    nextItem();
  }
}

// SVG generators
function getShapeSVG(name){
  const n = name.toLowerCase();
  switch(n){
    case 'triangle':
      return `<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="#000"/></svg>`;
    case 'square':
      return `<svg viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#000"/></svg>`;
    case 'circle':
      return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="#000"/></svg>`;
    case 'star':
      return `<svg viewBox="0 0 100 100"><polygon fill="#000" points="50,10 61,38 91,38 66,57 75,86 50,69 25,86 34,57 9,38 39,38"/></svg>`;
    case 'heart':
      return `<svg viewBox="0 0 100 100"><path d="M50 84 L18 52 C4 38 15 16 35 20 C43 22 47 28 50 32 C53 28 57 22 65 20 C85 16 96 38 82 52 Z" fill="#000"/></svg>`;
    case 'cross':
      return `<svg viewBox="0 0 100 100"><path d="M42 15 h16 v27 h27 v16 h-27 v27 h-16 v-27 h-27 v-16 h27z" fill="#000"/></svg>`;
    case 'arrow':
      return `<svg viewBox="0 0 100 100"><path d="M10 55 h50 v15 l30-20 -30-20 v15 h-50z" fill="#000"/></svg>`;
    case 'pentagon':
      return `<svg viewBox="0 0 100 100"><polygon points="50,10 88,38 74,85 26,85 12,38" fill="#000"/></svg>`;
    case 'crescent':
      return `<svg viewBox="0 0 100 100"><path d="M60 15a35 35 0 1 0 0 70a28 35 0 1 1 0 -70z" fill="#000"/></svg>`;
    case 'diamond':
      return `<svg viewBox="0 0 100 100"><polygon points="50,10 85,50 50,90 15,50" fill="#000"/></svg>`;
    default:
      return `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="#000"/></svg>`;
  }
}

// Wire up UI
document.getElementById('btnSetup').addEventListener('click', showSetup);
document.getElementById('btnPlay').addEventListener('click', showGame);
document.getElementById('btnBackMenu').addEventListener('click', showMenu);
document.getElementById('btnApply').addEventListener('click', showMenu);
document.getElementById('btnBackFromGame').addEventListener('click', showMenu);

document.querySelectorAll('input[name="mode"]').forEach(r=>{
  r.addEventListener('change', (e)=> setMode(e.target.value));
});

displayArea.addEventListener('click', handleTap);
displayArea.addEventListener('touchend', (e)=>{ e.preventDefault(); handleTap(); }, {passive:false});

setMode('colours');
showMenu();
