const canvas = document.getElementById("starting-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const enemies = [];

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

function spawnEnemies() {
  setInterval(() => {
    let x, y;
    const radius = Math.random() * (30 - 4) + 4;
    const color = `hsl(${Math.random() * 360},50%,50%)`;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    let velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);
}

function animate() {
  requestAnimationFrame(animate);

  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  enemies.forEach((enemy) => {
    enemy.update();
  });
}

let currentScore = localStorage.getItem("currentScore") ;
let currentScoreEl = document.getElementById("current-score-el");
let replayGameBtn = document.getElementById("replay-game-btn");
let backGameBtn = document.getElementById("back-game-btn");

currentScoreEl.innerHTML = currentScore;

replayGameBtn.addEventListener("click", () => {
  window.location.href = "game.html";
})
backGameBtn.addEventListener("click",() => {
    window.location.href = "index.html";
} )
animate();

spawnEnemies();
