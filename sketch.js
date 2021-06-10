var dog,happyDog,hungryDog,database,foodS,foodStockRef,database;
var frameCountNow = 0;
var fedTime,lastFed,foodObj,currentTime;
var milk,input,name;
var gameState = "Hungry";
var gameStateRef;
var bedroomIMG,gardenIMG,washroomIMG,sleepIMG,runIMG;
var feed,addFood;
var input,button;

function preload(){
	 hungryDog = loadImage("Dog.png");
   happyDog = loadImage("happydog.png");
   bedroomIMG = loadImage("Bed Room.png");
   gardenIMG = loadImage("Garden.png");
   washroomIMG = loadImage("Wash Room.png");
   sleepIMG = loadImage("Lazy.png");
   runIMG = loadImage("runningLeft.png");
}

function setup() {
	createCanvas(1200, 500);
  database = firebase.database();

  foodObj = new Food();

  dog = createSprite(730,200,10,10);
  dog.addImage("hungry",hungryDog);
  dog.addImage("happy",happyDog);
  dog.add("sleep",sleepIMG);
  dog.addAnimation("run",runIMG);
  dog.scale = 0.2;

  getGameState();

  feed = createButton("Feed The Dog");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addFoodS);

  input = createInput("Pet name");
  input.position(950,120);

  button = createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName);

}


function draw() {  
  background("yellow");
  
  currentTime = hour();
  if(currentTime === lastFed+1){
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime === lastFed+2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if (currentTime > lastFed+2 && currentTime <= lastFed+4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else {
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }
  
  foodObj.getFoodStock();
  getGameState();
  
  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry",hungryDog);
  }
  else {
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  drawSprites();
  
  textSize(30);
  fill("red");
  textSize(20);
  text("Last Feed : "+lastFed + " :00",350,30);
  text("Time since last Fed : "+(currentTime-lastFed),300,125);
}

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
    dog.changeAnimation("happy",happyDog);
    gameState = "happy";
    updateGameState();
  }

function addFoodS(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime; 
}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("Pet's name: "+name);
  greeting.position(width/2+850,height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState = data.val();
  });
};

function updateGameState(){
  database.ref('/').update({
    gameState : gameState
  })
}

