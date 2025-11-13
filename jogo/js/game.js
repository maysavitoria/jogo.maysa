import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "solo";

let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Personagens
let player1 = new Player(100, 400, "img/player1.png", { left: "a", right: "d", jump: "w" });
let player2 = mode === "duo" ? new Player(200, 400, "img/player2.png", { left: "ArrowLeft", right: "ArrowRight", jump: "ArrowUp" }) : null;

// Itens
let coins = [
  { x: 300, y: 430, collected: false },
  { x: 600, y: 430, collected: false },
  { x: 850, y: 430, collected: false }
];

let finishLine = 2000;
let level = 1;
let gameOver = false;

function update() {
  player1.update(keys);
  if (player2) player2.update(keys);

  // Coleta moedas
  for (let coin of coins) {
    if (!coin.collected && checkCollision(player1, coin)) {
      coin.collected = true;
      player1.score += 10;
    }
    if (player2 && !coin.collected && checkCollision(player2, coin)) {
      coin.collected = true;
      player2.score += 10;
    }
  }

  // Fim da fase
  if (player1.x >= finishLine || (player2 && player2.x >= finishLine)) {
    gameOver = true;
    localStorage.setItem("p1score", player1.score);
    localStorage.setItem("p2score", player2 ? player2.score : 0);
    window.location.href = "end.html";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo
  let bg = new Image();
  bg.src = `img/fundo${level}.jpg`;
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Chão
  ctx.fillStyle = "#009933";
  ctx.fillRect(0, 460, canvas.width, 40);

  // Moedas
  for (let coin of coins) {
    if (!coin.collected) {
      const img = new Image();
      img.src = "img/moeda.png";
      ctx.drawImage(img, coin.x, coin.y, 25, 25);
    }
  }

  // Jogadores
  player1.draw(ctx);
  if (player2) player2.draw(ctx);

  // HUD
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`P1: ${player1.score}`, 20, 25);
  if (player2) ctx.fillText(`P2: ${player2.score}`, 780, 25);
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function checkCollision(p, item) {
  return (
    p.x < item.x + 25 &&
    p.x + p.width > item.x &&
    p.y < item.y + 25 &&
    p.y + p.height > item.y
  );
}

gameLoop();
