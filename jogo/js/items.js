// js/items.js
export function createItemsFromLevel(level) {
  // returns deep copy with collected flag
  return level.items.map(it => ({ x: it.x, y: it.y, type: it.type, collected: false }));
}

export function drawItems(ctx, items, cameraX) {
  for (let it of items) {
    if (it.collected) continue;
    const drawX = it.x - cameraX;
    if (it.type === 'coin') {
      const img = document.coinImg;
      if (img && img.complete) ctx.drawImage(img, drawX - 12, it.y - 12, 24, 24);
      else {
        ctx.fillStyle = 'gold';
        ctx.beginPath();
        ctx.arc(drawX, it.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (it.type === 'star') {
      const img = document.starImg;
      if (img && img.complete) ctx.drawImage(img, drawX - 14, it.y - 14, 28, 28);
      else {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(drawX - 10, it.y - 10, 20, 20);
      }
    }
  }
}

export function checkCollect(player, items) {
  for (let it of items) {
    if (it.collected) continue;
    if (player.x < it.x + 16 && player.x + player.width > it.x - 16 &&
        player.y < it.y + 16 && player.y + player.height > it.y - 16) {
      it.collected = true;
      if (it.type === 'coin') player.score += 10;
      if (it.type === 'star') player.score += 30;
    }
  }
}
