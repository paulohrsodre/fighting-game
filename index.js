const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/background.png",
});

const shop = new Sprite({
  position: {
    x: 640,
    y: 160,
  },
  imageSrc: "./images/shop.png",
  scale: 2.5,
  framesMax: 6,
});

const player1 = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: -100,
    y: 154,
  },
  sprites: {
    idle: {
      imageSrc: "./images/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./images/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./images/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./images/samuraiMack/Take_Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./images/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 110,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

const player2 = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./images/Kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: -15,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "./images/Kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./images/Kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/Kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/Kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/Kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./images/Kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/Kenji/Take_Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./images/Kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

console.log(player1);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  //player1 movement
  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -5;
    player1.switchSprite("run");
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 5;
    player1.switchSprite("run");
  } else {
    player1.switchSprite("idle");
  }

  //player1 jumping
  if (player1.velocity.y < 0) {
    player1.switchSprite("jump");
  } else if (player1.velocity.y > 0) {
    player1.switchSprite("fall");
  }

  //player2 movement
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -5;
    player2.switchSprite("run");
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 5;
    player2.switchSprite("run");
  } else {
    player2.switchSprite("idle");
  }

  //player2 jumping
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    player2.switchSprite("fall");
  }

  //player1 detect for collision & player2 gets hit
  if (
    rectangularCollision({
      rectangle1: player1,
      rectangle2: player2,
    }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player2.takeHit();
    player1.isAttacking = false;
    document.querySelector("#player2-health").style.width =
      player2.health + "%";

    gsap.to("#player2-health", {
      width: player2.health + "%",
    });
  }

  //if player misses
  if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false;
  }

  //player2 detect for collision & player1 gets hit
  if (
    rectangularCollision({
      rectangle1: player2,
      rectangle2: player1,
    }) &&
    player2.isAttacking &&
    player2.framesCurrent === 2
  ) {
    player1.takeHit();
    player2.isAttacking = false;
    document.querySelector("#player1-health").style.width =
      player1.health + "%";

    gsap.to("#player1-health", {
      width: player1.health + "%",
    });
  }

  //if player misses
  if (player2.isAttacking && player2.framesCurrent === 2) {
    player2.isAttacking = false;
  }

  //end game based on health
  if (player2.health <= 0 || player1.health <= 0) {
    determineWinner({ player1, player2, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player1.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player1.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player1.lastKey = "a";
        break;
      case "w":
        player1.velocity.y = -20;
        break;
      case " ":
        player1.attack();
        break;
    }
  }

  if (!player2.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        player2.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        player2.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        player2.velocity.y = -20;
        break;
      case "ArrowDown":
        player2.isAttacking = true;
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      player1.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = false;
      player1.lastKey = "a";
      break;
    case "w":
      keys.w.pressed = false;
      player1.lastKey = "w";
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      player2.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      player2.lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
  console.log(event.key);
});
