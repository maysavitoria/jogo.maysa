const bgImages = {
  1: new Image(jogo.nuvens.avif),
  2: new Image(jogo.terra2.png),
  3: new Image(jogo.nevee.webp),
  4: new Image(jogo.espaço.jpg),
  5: new Image(jogo.tec.avif)
};

bgImages[1].src = "fundo_nuvens.png";
bgImages[2].src = "fundo_terra.png";
bgImages[3].src = "fundo_frio.png";
bgImages[4].src = "fundo_espaco.png";
bgImages[5].src = "fundo_tecnologico.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mode = null;
let level = 1;
let maxLevels = 5;
let players = [];
let collectibles = [];
let obstacles = [];
let platforms = [];
let gravity = 1.2;
let cameraX = 0;
const keysPressed = {};

window.addEventListener("keydown", e => keysPressed[e.key] = true);
window.addEventListener("keyup", e => keysPressed[e.key] = false);

// --- Seleção de modo ---
function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("startScreen").classList.add("hidden");
  startGame();
}

// --- Inicializa jogo ---
function startGame() {
  level = 1;
  cameraX = 0;
  players = [
    { x: 50, y: canvas.height - 150, vx: 0, vy: 0, color: "red", score: 0, name: "Jogador 1", keys: { left: "a", right: "d", up: "w" } }
  ];
  if (mode === "multi") {
    players.push({ x: 50, y: canvas.height - 150, vx: 0, vy: 0, color: "blue", score: 0, name: "Jogador 2", keys: { left: "ArrowLeft", right: "ArrowRight", up: "ArrowUp" } });
  }
  setupLevel();
  requestAnimationFrame(gameLoop);
}

// --- Configura nível ---
function setupLevel() {
  collectibles = [];
  obstacles = [];
  platforms = [];
  if (mode === "single") createLongLevel();
  else createLevel(level);
}

// --- Nível longo single player ---
function createLongLevel() {
  let levelWidth = canvas.width * 5;
  for (let i = 0; i < 20; i++) {
    platforms.push({ x: i * 300, y: canvas.height - (i % 3) * 80 - 100, width: 200, height: 20 });
  }
  for (let i = 0; i < 15; i++) {
    obstacles.push({ x: i * 300 + 150, y: canvas.height - 60, width: 50, height: 50, type: "spike" });
  }
  for (let i = 0; i < 20; i++) {
    collectibles.push({
      x: Math.random() * (levelWidth - 50) + 50,
      y: Math.random() * (canvas.height / 2) + canvas.height / 2,
      type: Math.random() < 0.7 ? "coin" : "star",
      collected: false
    });
  }
  obstacles.push({ x: levelWidth - 100, y: canvas.height - 70, width: 50, height: 70, type: "door" });
}

// --- Níveis multiplayer ---
function createLevel(lvl) {
  let levelWidth = canvas.width * 3;
  let baseY = canvas.height - 100;

  for (let i = 0; i < 10; i++) {
    platforms.push({ x: i * 300, y: baseY - (i % 3) * 50, width: 250, height: 20 });
  }

  let obstacleTypes = ["spike", "fire", "rock"];
  for (let i = 0; i < 10; i++) {
    let type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    obstacles.push({ x: i * 300 + 200, y: canvas.height - 60, width: 50, height: 50, type: type });
  }

  obstacles.push({ x: levelWidth - 100, y: canvas.height - 70, width: 50, height: 70, type: "door" });

  for (let i = 0; i < 15; i++) {
    collectibles.push({
      x: Math.random() * (levelWidth - 50) + 50,
      y: Math.random() * (canvas.height / 2) + canvas.height / 2,
      type: Math.random() < 0.7 ? "coin" : "star",
      collected: false
    });
  }

  canvas.levelWidth = levelWidth;
}

// --- Fundo temático ---
function drawBackground() {
  if (mode === "single") {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    switch(level) {
      case 1: // Nuvens
        ctx.fillStyle = "#87CEEB"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 50; i++) { ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc((i*150 + cameraX*0.5) % canvas.levelWidth, 100 + (i%5)*30, 30, 0, Math.PI*2); ctx.fill(); }
        break;
      case 2: // Terra
        ctx.fillStyle = "#87CEEB"; ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "#228B22"; ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        break;
      case 3: // Frio
        ctx.fillStyle = "#B0E0E6"; ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "#F0FFFF";
        for (let i = 0; i < 20; i++) ctx.fillRect((i*200 - cameraX*0.5) % canvas.levelWidth, canvas.height - 50 - (i%3)*30, 80, 20);
        break;
      case 4: // Espaço
        ctx.fillStyle = "black"; ctx.fillRect(0,0,canvas.width, canvas.height);
        for (let i = 0; i < 100; i++) { ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc((i*70 - cameraX*0.3) % canvas.levelWidth, Math.random()*canvas.height, 2, 0, Math.PI*2); ctx.fill(); }
        break;
      case 5: // Tecnológico
        ctx.fillStyle = "#111"; ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.strokeStyle = "#0ff";
        for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo((i*200 - cameraX*0.2) % canvas.levelWidth, 0); ctx.lineTo((i*200 - cameraX*0.2) % canvas.levelWidth, canvas.height); ctx.stroke(); }
        break;
      default:
        ctx.fillStyle = "#87CEEB"; ctx.fillRect(0,0,canvas.width, canvas.height);
    }
  }
}

// --- Loop principal ---
function gameLoop() {
  drawBackground();
  updatePlayers();
  checkCollisions();
  updateCamera();
  drawPlatforms();
  drawObstacles();
  drawCollectibles();
  drawPlayers();
  drawHUD();
  requestAnimationFrame(gameLoop);
}

// --- Atualiza jogadores ---
function updatePlayers() {
  players.forEach(p => {
    if (keysPressed[p.keys.left]) p.vx = -5;
    else if (keysPressed[p.keys.right]) p.vx = 5;
    else p.vx = 0;
    if (keysPressed[p.keys.up] && isOnGround(p)) p.vy = -20;
    p.vy += gravity;
    p.x += p.vx;
    p.y += p.vy;
    if (p.y + 50 > canvas.height) { p.y = canvas.height - 50; p.vy = 0; }
    if (p.x < 0) p.x = 0;
    if (p.x + 50 > canvas.levelWidth) p.x = canvas.levelWidth - 50;
  });
}

// --- Verifica chão ---
function isOnGround(p) {
  if (p.y + 50 >= canvas.height) return true;
  for (let plat of platforms) {
    if (p.x + 50 > plat.x && p.x < plat.x + plat.width) {
      if (p.y + 50 >= plat.y && p.y + 50 <= plat.y + plat.height + 5) return true;
    }
  }
  return false;
}

// --- Colisões ---
function checkCollisions() {
  players.forEach(p => {
    platforms.forEach(plat => {
      if (p.x + 50 > plat.x && p.x < plat.x + plat.width &&
          p.y + 50 > plat.y && p.y + 50 - p.vy <= plat.y) { p.y = plat.y - 50; p.vy = 0; }
    });
    obstacles.forEach(o => {
      if (p.x < o.x + o.width && p.x + 50 > o.x && p.y < o.y + o.height && p.y + 50 > o.y) {
        if (o.type === "door") { p.score += 1; nextLevel(); }
        else { p.x = 50; p.y = canvas.height - 150; if (p.score>0)p.score-=1; }
      }
    });
    collectibles.forEach(c => {
      if (!c.collected && p.x < c.x + 15 && p.x + 50 > c.x - 15 && p.y < c.y + 15 && p.y + 50 > c.y - 15) {
        c.collected = true; p.score += c.type==="coin"?1:2;
      }
    });
  });
}

// --- Próximo nível ---
function nextLevel() {
  level++;
  if (level > maxLevels) {
    let winnerPlayer = players[0];
    if (players[1] && players[1].score > winnerPlayer.score) winnerPlayer = players[1];
    showWinner(winnerPlayer.name);
    return;
  }
  setupLevel();
  players.forEach(p => { p.x = 50; p.y = canvas.height - 150; });
  cameraX = 0;
}

// --- Atualiza câmera ---
function updateCamera() {
  let mainPlayer = players[0];
  cameraX = mainPlayer.x - canvas.width / 2;
  if (cameraX < 0) cameraX = 0;
  if (cameraX + canvas.width > canvas.levelWidth) cameraX = canvas.levelWidth - canvas.width;
}

// --- Desenhos ---
function drawPlatforms() { ctx.fillStyle="brown"; platforms.forEach(p=>ctx.fillRect(p.x-cameraX,p.y,p.width,p.height)); }
function drawPlayers() { players.forEach(p=>{ ctx.fillStyle=p.color; ctx.fillRect(p.x-cameraX,p.y,50,50); }); }
function drawCollectibles() { collectibles.forEach(c=>{ if(!c.collected){ ctx.fillStyle=c.type==="coin"?"yellow":"white"; ctx.beginPath(); ctx.arc(c.x-cameraX,c.y,15,0,Math.PI*2); ctx.fill(); } }); }
function drawObstacles() { obstacles.forEach(o=>{ if(o.type==="spike")ctx.fillStyle="red"; else if(o.type==="fire")ctx.fillStyle="orange"; else if(o.type==="rock")ctx.fillStyle="gray"; else if(o.type==="door")ctx.fillStyle="green"; ctx.fillRect(o.x-cameraX,o.y,o.width,o.height); }); }
function drawHUD() { ctx.fillStyle="black"; ctx.font="20px Arial"; players.forEach((p,i)=>ctx.fillText(`${p.name}: ${p.score} pts`,20,30+i*30)); }

// --- Mostrar vencedor ---
function showWinner(name) { document.getElementById("winnerText").innerText=`${name} ganhou!`; document.getElementById("winner").classList.remove("hidden"); }
function restartGame() { document.getElementById("winner").classList.add("hidden"); document.getElementById("startScreen").classList.remove("hidden"); }

window.addEventListener("resize",()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
