export class Player {
  constructor(x, y, spritePath, controls) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 50;
    this.height = 50;
    this.sprite = new Image();
    this.sprite.src = spritePath;
    this.controls = controls;
    this.score = 0;
    this.grounded = false;
  }

  update(keys) {
    // Movimento horizontal
    if (keys[this.controls.left]) this.vx = -4;
    else if (keys[this.controls.right]) this.vx = 4;
    else this.vx = 0;

    // Pulo
    if (keys[this.controls.jump] && this.grounded) {
      this.vy = -9;
      this.grounded = false;
    }

    // Gravidade
    this.vy += 0.5;
    this.y += this.vy;
    this.x += this.vx;

    // Chão
    if (this.y > 400) {
      this.y = 400;
      this.vy = 0;
      this.grounded = true;
    }

    // Limites laterais
    if (this.x < 0) this.x = 0;
    if (this.x > 850) this.x = 850;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
