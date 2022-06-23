var trex, trex_running, trex_dead;
var edges;
var ground;
var invsground;
var cloud;
var cloudgroup;
var cactusgroup;
var score;
var rand;
var GameOver, GameOverIMG;
var reset, resetIMG;
var PLAY = 1;
var OVER = 0;
var gameState = PLAY;
var jumpSound;
var deadSound;
var pointSound;

function preload() {
 
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  floor = loadAnimation("ground2.png")
  cloud_moving = loadAnimation("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_dead = loadImage("trex_collided.png");
  GameOverIMG = loadImage("gameOver.png");
  resetIMG = loadImage("restart.png");
  jumpSound = loadSound('jump.wav')
  deadSound = loadSound("die.wav");
  pointSound = loadSound("point.wav");
}

function setup() {
 
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(51, 150, 10, 40)
  trex.addAnimation("trexrunning", trex_running);
  trex.addAnimation("GameOver", trex_dead);
  trex.scale = 0.5;
  ground = createSprite(10, 178, 600, 10);
  ground.addAnimation("floor", floor);
  invsground = createSprite(51, 180, 1, 1);
  score = 0;
  edges = createEdgeSprites()
  cactusgroup = new Group();
  cloudgroup = new Group();
  trex.setCollider("circle", 0, 0, 35);
  GameOver = createSprite(300, 100, 50, 50);
  GameOver.addImage("IMG", GameOverIMG);
  reset = createSprite(300, 50, 50, 50)
  reset.addImage("RIMG", resetIMG);
  reset.scale = 0.5;
  reset.visible = false;
}

function draw(){
  background("white");
  if (gameState === PLAY) {
    if (ground.x < 0) {
    ground.x = width+600;
    }
    GameOver.visible = false;
   score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(7 + score/ 300);
    if (keyDown('space') && trex.y > 170) {
      trex.velocityY = -10;
      jumpSound.play()
    }
   
    trex.velocityY = trex.velocityY + 0.8
    if (trex.isTouching(cactusgroup)) {
      gameState = OVER;
      deadSound.play();
    }
    spawnClouds();
    spawnObstacles();
  } else if (gameState === OVER) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    cactusgroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    trex.changeAnimation("GameOver", trex_dead);
    GameOver.visible = true;
    reset.visible = true;
    if (mousePressedOver(reset)) { 
      gameReset();
    }
    
  }
  text("SCORE:" + score, 530, 10);
   
  if (score % 100 === 0 && score != 0) {
    pointSound.play();
  }

   invsground.visible = false;
   trex.collide(invsground);
  drawSprites();
  
}

function spawnClouds() {
  if (frameCount % 80 === 0) {
    cloud = createSprite(600, 50, 60, 20);
    cloud.addAnimation("cloud", cloud_moving);
    cloud.scale = 0.5;
    cloud.velocityX = -(4+score/300);;
    cloud.y = Math.round(random(25, 100))
    cloud.lifeTime = 200;
    cloudgroup.add(cloud);
  }
  if (frameCount % 120 === 0) {
    cloud = createSprite(600, 50, 60, 20);
    cloud.addAnimation("cloud", cloud_moving);
    cloud.scale = 0.35;
    cloud.velocityX = -(1+frameCount/60);;
    cloud.y = Math.round(random(50, 100))
    cloud.lifeTime = 300;
    cloudgroup.add(cloud);
  }
}
function gameReset() {
  score = 0;
  gameState = PLAY;
  
  cloudgroup.destroyEach()
  cactusgroup.destroyEach()
  trex.changeAnimation("trexrunning", trex_running);
  reset.visible = false;
}
function spawnObstacles() {
  if (frameCount % 45 === 0) {
    var obstacle = createSprite(600, 160, 10, 40);
    obstacle.velocityX = -(7+score/300);
    rand = Math.round(random(0,5));
    switch (rand) {
      case 0: obstacle.addImage("cactus", obstacle1);
        obstacle.scale = 0.75;
        break;
      case 1: obstacle.addImage("cactus", obstacle2);
        obstacle.scale = 0.75;
        break;
      case 2: obstacle.addImage("cactus", obstacle3);
        obstacle.scale = 0.75;
        break;
      case 3: obstacle.addImage("cactus", obstacle4);
        obstacle.scale = 0.5;
        break;
      case 4: obstacle.addImage("cactus", obstacle5);
        obstacle.scale = 0.5;
        break;
      case 5: obstacle.addImage("cactus", obstacle6);
        obstacle.scale = 0.5;
        break;
      default:
        break;
   }
    obstacle.lifeTime = 40;
    cactusgroup.add(obstacle);
    obstacle.depth = trex.depth;
    trex.depth += 1;
  }
}