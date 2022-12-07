var bgImg;
var gameState = "play";
var boy,boyAni,boyEnd;
var invisibleGround;
var ground;
var obstaclesGroup,fruitGroup;
var gorrilla,gorrillaAnim,brick,brickImg;
var appleImg,mangoImg;
var score = 0,scoreAni0,scoreAni1,scoreAni2,scoreAni3;
var life;
var jump,crash;
var GameOver,brickHit;
var brick;
var MangoGroup,mango;
var restartImg,restartButton,gameOver,gameOverImg;
var GameStart



function preload() {
  bgImg = loadImage("./Images/Background.png");
  boyAni = loadAnimation("./Images/Boy1.png","./Images/Boy2.png","./Images/Boy3.png","./Images/Boy4.png");
  gorrillaAnim = loadAnimation("./Images/Gorrilla1.png","./Images/Gorrilla2.png","./Images/Gorrilla3.png","./Images/Gorrilla4.png","./Images/Gorrilla5.png");
  brickImg = loadImage("./Images/Brick.png");
  appleImg = loadImage("./Images/Apple.png");
  mangoImg = loadImage("./Images/Mango.png");
  scoreAni0 = loadAnimation("./Images/0.png");
  scoreAni1 = loadAnimation("./Images/1.png");
  scoreAni2 = loadAnimation("./Images/2.png");
  scoreAni3 = loadAnimation("./Images/3.png");
  boyEnd = loadImage("./Images/Boy3.png");
  jump = loadSound("./sounds/Jump.mp3");
  crash = loadSound("./sounds/crash.mp3");
  GameOver = loadSound("./sounds/Over.mp3");
  brickHit = loadSound("./sounds/brickDash.mp3");
  restartImg = loadImage("./Images/Restart.png");
  gameOverImg = loadImage("./Images/Game Over.png");
  GameStart = loadSound("./sounds/Game Start.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  

  ground = createSprite(1600 ,height/2,width,height);
  ground.addImage(bgImg);
  ground.scale = 2.5

  boy = createSprite(width/3 - 500,height - 250);
  boy.addAnimation("Boy",boyAni);
  boy.addImage('end',boyEnd);
  boy.scale = 1.7;

  invisibleGround = createSprite(width/2,height - 100,width,50);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  obstacle2Group = new Group();
  fruitGroup = new Group();

  fruitGroup.visible = false;

  life = createSprite(width / 3 - 650,40,50,25);
  life.addAnimation('empty',scoreAni0);
  life.addAnimation('one',scoreAni1);
  life.addAnimation('two',scoreAni2);
  life.addAnimation('three',scoreAni3);
  life.changeAnimation('three');

  Mango = createSprite(2300,550);
  Mango.addImage(mangoImg);
  Mango.scale =0.3
  Mango.velocityX = -3;
  Mango.visible = false;
  MangoGroup = new Group();
  MangoGroup.add(Mango);

  restartButton = createSprite(width/2,height/2+ 200);
  restartButton.addImage(restartImg);
  restartButton.scale = 0.3;

  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 3;
  
}

function draw() {
  background(bgImg); 
  

  //image(bgImg,0,0,width,height)

  boy.collide(invisibleGround);

  if(gameState === "play"){
    restartButton.visible = false;
    gameOver.visible = false;
    spawnObstacles();
    spawnObstacle2();
    boy.velocityY = boy.velocityY + 2;
    
    if(ground.x<700){
      ground.x=ground.width/2 + 900
    }
    ground.velocityX = -4
    if(keyDown("space") && boy.y >= 550){
      boy.velocityY = -40;
      jump.play();
    }
    for(var i=0;i<obstacle2Group.length;i++){
      if(obstacle2Group.get(i).isTouching(boy)){
        
        obstacle2Group.get(i).remove();
        //gameState = "end";
        //brick.changeImage('mango',mangoImg);
        //change(obstacle2Group.get(i),brick);
        score -= 1;
        brickHit.play();

        Mango = createSprite(width-100,height/2-50);
        Mango.velocityX = -10;
        Mango.scale = 0.3;
        MangoGroup.add(Mango);
        var ran = Math.round(random(1,2));
        switch(ran){
          case 1:Mango.addImage(appleImg);
          break;
          case 2:Mango.addImage(mangoImg);
          break;
          default:break;
        }

        //spawnFruits();
        }

        if(MangoGroup.isTouching(boy)){
          MangoGroup[0].destroy();
          score += 1;
        }
      }

      if(fruitGroup.isTouching(boy)){
        fruitGroup[0].destroy();
      }

    for(var i=0;i<obstaclesGroup.length;i++){
      if(obstaclesGroup.get(i).isTouching(boy)){
        obstaclesGroup.get(i).remove();
        life.changeAnimation('three');
        score -= 1;

        crash.play();

        if(score == 3||score == 4||score == 5){
          life.changeAnimation('three');
        }

        else if(score == 2){
          life.changeAnimation('two');
        }
        else if(score == 1){
          life.changeAnimation('one');
        }
        else{
          life.changeAnimation('empty');
        }

        if(score <= 0){
          GameOver.play();
          gameState = "end";
        }
        }
        }
    
     }
     else if(gameState === "end"){
      restartButton.visible = true;
      gameOver.visible = true;
      ground.velocityX=0
      boy.changeImage('end');
      boy.x=width/3 - 300;
      boy.y=height - 250
      obstaclesGroup.setVelocityEach(0);
      obstacle2Group.setVelocityEach(0);
      obstaclesGroup.destroyEach();
      obstacle2Group.destroyEach();
      MangoGroup.destroyEach();
      MangoGroup.setVelocityEach(0);

      if(mousePressedOver(restartButton)){
        reset();
      }
      
      
     }
  //console.log(boy.y);


  

  drawSprites();
  fill("black")
  textSize(30)
  text("Score :  " + score,width - 200,40); 
} 

function spawnObstacles(){
  if(frameCount%90 === 0){
    gorrilla = createSprite(width - 100,height-100);
    gorrilla.addAnimation('gorrilla',gorrillaAnim);
    gorrilla.scale = 2;
    gorrilla.velocityX = -12;
    gorrilla.y = Math.round(random(height - 100,height - 500));
    
    obstaclesGroup.add(gorrilla);

  }
}

function spawnObstacle2(){
  if(frameCount%175 === 0){
    brick = createSprite(width-100,height/2-50);
    brick.addImage('brick',brickImg);
    brick.addImage('apple',appleImg);
    brick.addImage('mango',mangoImg);
    brick.scale = 0.4;
    brick.velocityX = -10;
    brick.y = Math.round(random(height/2,height/2 - 100));
    obstacle2Group.add(brick);
    console.log(brick.y);

  }
}

function change(spriteA,spriteB){
  spriteA.remove();
  spriteB.changeAnimation('mango');
}



function reset(){
  GameStart.play();
  gameState = "play";
  score = 5;
  life.changeAnimation('three');
  boy.changeAnimation("Boy");
  boy.x = width/3 - 500;
}
