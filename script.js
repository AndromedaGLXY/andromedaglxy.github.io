// ===== MindSight: Colours Game Logic =====

// Colors available
const COLORS = ['Red','Green','Blue','Yellow','Orange','Purple','Pink','Brown','Gray','Cyan'];

// DOM elements
const menu = document.getElementById('menu');
const setup = document.getElementById('setup');
const game = document.getElementById('game');
const stats = document.getElementById('stats');

const leftSelect = document.getElementById('leftColour');
const rightSelect = document.getElementById('rightColour');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');
const colorCard = document.getElementById('colorCard');
const leftSide = document.getElementById('leftSide');
const rightSide = document.getElementById('rightSide');
const gameStats = document.getElementById('gameStats');
const statsList = document.getElementById('statsList');

// Game state
let leftColor, rightColor;
let currentColor;
let correctCount = 0, totalCount = 0;
let historicalStats = JSON.parse(localStorage.getItem('mindsightStats')) || [];

// Populate setup dropdowns
function populateColorSelects() {
  leftSelect.innerHTML = '';
  rightSelect.innerHTML = '';
  COLORS.forEach(color => {
    let opt1 = document.createElement('option');
    opt1.value = color; opt1.text = color;
    leftSelect.appendChild(opt1);
    let opt2 = document.createElement('option');
    opt2.value = color; opt2.text = color;
    rightSelect.appendChild(opt2);
  });
}

// Menu navigation
function showSetup() {
  menu.classList.add('hidden');
  setup.classList.remove('hidden');
  populateColorSelects();
}

function showStats() {
  menu.classList.add('hidden');
  stats.classList.remove('hidden');
  updateStatsList();
}

function backToMenu() {
  setup.classList.add('hidden');
  game.classList.add('hidden');
  stats.classList.add('hidden');
  menu.classList.remove('hidden');
}

function startGame() {
  if (setup.classList.contains('hidden')) { // started from menu
    leftColor = COLORS[0]; 
    rightColor = COLORS[1];
  } else { // started from setup
    leftColor = leftSelect.value;
    rightColor = rightSelect.value;
  }
  setup.classList.add('hidden');
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  leftLabel.textContent = leftColor;
  rightLabel.textContent = rightColor;
  correctCount = 0; totalCount = 0;
  showNextColor();
}

// Show a random color card
function showNextColor() {
  currentColor = Math.random() < 0.5 ? leftColor : rightColor;
  colorCard.style.backgroundColor = currentColor.toLowerCase();
  updateGameStats();
}

// Update current game stats display
function updateGameStats() {
  gameStats.textContent = `Correct: ${correctCount} / Total: ${totalCount}`;
}

// Handle selection
function handleSelection(side) {
  let correct = (side === 'left' && currentColor === leftColor) ||
                (side === 'right' && currentColor === rightColor);
  totalCount++;
  if (correct) correctCount++;
  
  // Voice feedback
  let msg = new SpeechSynthesisUtterance();
  msg.text = `${currentColor}. ${correct ? 'Correct' : 'Wrong'}`;
  window.speechSynthesis.speak(msg);
  
  updateGameStats();
  showNextColor();
}

// End game and save historical stats
function endGame() {
  if (totalCount > 0) {
    historicalStats.push({
      date: new Date().toLocaleString(),
      leftColor, rightColor,
      correct: correctCount,
      total: totalCount
    });
    localStorage.setItem('mindsightStats', JSON.stringify(historicalStats));
  }
  backToMenu();
}

// Update historical stats list
function updateStatsList() {
  statsList.innerHTML = '';
  if (historicalStats.length === 0) {
    statsList.innerHTML = '<li>No games played yet.</li>';
  } else {
    historicalStats.forEach((g,i) => {
      let li = document.createElement('li');
      li.textContent = `${i+1}. ${g.date} - Left: ${g.leftColor}, Right: ${g.rightColor}, Score: ${g.correct}/${g.total}`;
      statsList.appendChild(li);
    });
  }
}

// Double-tap detection helper
function addDoubleTapHandler(elem, callback) {
  let lastTap = 0;
  elem.addEventListener('touchend', function(e){
    let currentTime = new Date().getTime();
    let tapLength = currentTime - lastTap;
    if (tapLength < 400 && tapLength > 0) {
      callback();
      // brief highlight effect
      elem.style.backgroundColor = 'rgba(0,0,0,0.2)';
      setTimeout(()=>{elem.style.backgroundColor='transparent';},200);
    }
    lastTap = currentTime;
  });
  elem.addEventListener('mousedown', function(){ callback(); }); // allow desktop clicks
}

// Attach double-tap handlers
addDoubleTapHandler(leftSide, ()=>handleSelection('left'));
addDoubleTapHandler(rightSide, ()=>handleSelection('right'));
