// Initializing canvas

const canvas = document.querySelector("canvas");
// setting full width of canvas

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.getElementById("score-el");

// getting a 2D context

const ctx = canvas.getContext("2d");
const friction = 0.96;
let highestScore = localStorage.getItem("highestScore");
/* 
   creating different components classes because we need multiple instances of 
   player, enemy, projectiles, and particles
*/

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
class Projectiles {
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
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

/*
   creating arrays for componnets those are needed to have multiple instances ...
   so we can store them in arrays 
*/
const projectiles = [];
const enemies = [];
const particles = [];

// initializing player in the centre of window(screen)

const player = new Player(innerWidth / 2, innerHeight / 2, 10, "white");

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
  }, 1000);
}

let animnationId;
let score = 0;
function animate() {
  animnationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius < canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.slice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animnationId);
      localStorage.setItem("currentScore", score);
      if (score > highestScore) {
        localStorage.setItem("highestScore", `${score}`);
      }
      window.location.href = "end.html";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        score += 100;
        scoreEl.innerHTML = score;
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            projectiles.slice(projectileIndex);
          }, 0);
        } else {
          score += 100;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.slice(projectileIndex);
          }, 0);
        }
      }
    });
  });
}

window.addEventListener("click", (e) => {
  let x = canvas.width / 2,
    y = canvas.height / 2;

  const angle = Math.atan2(e.clientY - y, e.clientX - x);
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };

  console.log([velocity.x / 4, velocity.y / 4]);
  projectiles.push(new Projectiles(x, y, 5, "white", velocity));
});

let timer = document.getElementById("timer");

function startGame() {
  animate();
  spawnEnemies();
}

startGame();
