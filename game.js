import Phaser from 'phaser';
// import groundImage from '../assets/back.png';
// import wallImage from '../assets/walls.png';
// import catImg from '../assets/cat.png';

const loaderSceneConfig = {
  key: 'loader',
  active: true,
  preload: preload,
  create: create,
};

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1000,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [loaderSceneConfig],
};
//============================================================================================================
//modal windows
let modalAlert = document.getElementById("modalAlert");
let modalMenu = document.getElementById("modalMenu");
//TODO: implement modal shop
let closeAlert = document.getElementsByClassName("close")[0];
let closeMenu = document.getElementsByClassName("close")[1];
//menu buttons
let btnCreateAcc = document.getElementById("btnCreateAcc");
let btnDeleteAcc = document.getElementById("btnDeleteAcc");
let btnClearAcc = document.getElementById("btnClearAcc");
let btnLogOut = document.getElementById("btnLogOut");
//sprites
let ground;
let walls;
let cat;
//decaying stats
let isStarving = new Boolean(false);
let isGameEnd = new Boolean(false);
let catHealth; //for the purpose of debuging add values
let catHunger;
let catDomestication;
//expendables
let money;
let food;
let medicine;
//UI
let statText;
let expendText;
let menuButton;
let shopButton;
//decaying intervals
let increaseMoneyInterval;
let decreaseValuesInterval;
//storage
let autosave;
//============================================================================================================
export function startGame() {
  const game = new Phaser.Game(config);
}

var timenow,timebefore,timediff;
//loading from storage
//window.localStorage.clear();  //use this to reset stats
if (window.localStorage.getItem('catHealth') == null ) {
  //default values
  catHealth = 100;
  catHunger = 100;
  catDomestication = 0;
  money = 200;
  food = 0;
  medicine = 0;
  console.log('storage is empty');
  savestate();
} else {
  loadstate();
  console.log('info being loaded');
}
function preload() {
  this.load.image('ground', '/img/back.png');
  this.load.image('cat', '/img/cat.png');
  this.load.image('walls', '/img/walls.png');
}
function create() {
  //add background sprites
  ground = this.add.sprite(500, 300, 'ground');
  walls = this.add.sprite(500, 300, 'walls');
  //UI
  statText = this.add.text(830, 16, 'Cat Stats', {
    fontSize: '24px',
    fill: '#000',
  });
  expendText = this.add.text(16, 570, 'Money \nFood \nMedicine', {
    fontSize: '24px',
    fill: '#000',
  });
  menuButton = this.add.text(910, 570, 'Menu', {
    fontSize: '24px',
    fill: '#000',
  }).setInteractive().on('pointerup', () => menuOpen());
  shopButton = this.add.text(16, 16, 'Shop',{
    fontSize: '24px',
    fill: '#000',
  }).setInteractive().on('pointerup', () => shopOpen());
  //start intervals
  decreaseValuesInterval = setInterval(decayValues, 1000);
  increaseMoneyInterval = setInterval(increaseMoney, 500);
  console.log('autosave begins');
  autosave = setInterval(savestate, 5000);
  //cat
  cat = this.add.sprite(500, 300, 'cat');
  this.physics.add.existing(cat);
  cat.body.setVelocity(150, 90);
  cat.body.setBounce(1, 1);
  cat.body.setCollideWorldBounds(true);
  cat.setInteractive({ useHandCursor: true }).on('pointerup', () => feedCat());
}
function update() {
  this.physics.arcade.collide(cat, walls);
}
//============================================================================================================
//modal window close buttons
closeAlert.onclick = function() {
  modalAlert.style.display = "none";
}
closeMenu.onclick = function() {
  modalMenu.style.display = "none";
}
//modal window open
function menuOpen(){
  modalMenu.style.display = "block";
}
function shopOpen(){

}
//new method for decaying values
function decayValues(){
//checks and decaying values
   if (catHunger !== 0){
     isStarving = false;
     console.log("is starving", isStarving);
   }

  if (isStarving == false && isGameEnd == false){ 
    catHunger--;
    console.log("decrease",catHunger);


    if (catHunger == 0){ 
      document.getElementById("modalText").innerHTML = "Your cat is starving!";
      modalAlert.style.display = "block";
      isStarving = true;
      console.log("cat is starving");
    }
    if (catHunger < 0){
      console.log("im here");
      catHunger = 0;
      console.log("hunger to 0", catHunger);
    }
  }else if (isStarving == true && isGameEnd == false){ 
    catHealth--;
    if (catHealth <= 0){
      isGameEnd = true;
    }
    if (catHealth < 0){
      catHealth = 0;
      console.log("health to 0")
    }
  }else if (isGameEnd == true){
    document.getElementById("modalText").innerHTML = "Your cat ran away!";
    modalAlert.style.display = "block";
    cat.setActive(false).setVisible(false);
  }

//domestication checks
  if (catHunger >= 50 && catHealth >= 70){
    catDomestication++;
  }else if (catHunger < 20 || catHealth < 40){
    catDomestication--;
    if (catDomestication < 0){
      isGameEnd = true;
    }
    if (catDomestication < 0){
      catDomestication = 0;
      console.log('domestication to 0');
    }
  }
//update UI
  statText.setText(
    'Cat Stats:\nHealth\n' +
      catHealth +
      '\nHunger\n' +
      catHunger +
      '\nDomest\n' +
      catDomestication +
      '%'
  );
}

function feedCat() {
  if (catHunger == 0) {
    clearInterval(decreaseHealthInterval); //when we feed cat from 0 hunger, stop health decay
    startStarvation();
  }
  catHunger = catHunger + 10;
  expendText.setText(
    'Money: ' + money + ' Food: ' + food + ' Medicine: ' + medicine
  );
}
function increaseMoney() {
  money++;
  expendText.setText(
    'Money: ' + money + ' Food: ' + food + ' Medicine: ' + medicine
  );
}
//============================================================================================================
btnCreateAcc.onclick = function(){
  //create new account, save current game and open new game for new account
}
btnDeleteAcc.onclick = function(){
  //delete current account, redirect to login page
}
btnClearAcc.onclick = function(){
  //clear storage of current account
}
btnLogOut.onclick = function(){
  //save current game and redirect to login page
}
//============================================================================================================
function savestate() {
  window.localStorage.setItem('catHealth', catHealth);
  window.localStorage.setItem('catHunger', catHunger);
  window.localStorage.setItem('catDomestication', catDomestication);
  window.localStorage.setItem('money', money);
  window.localStorage.setItem('food', food);
  window.localStorage.setItem('medicine', medicine);
  timebefore=new Date();
  window.localStorage.setItem('timevalue', timebefore.getTime());
  console.log('saving...');
}
function loadstate() {
  catHealth = parseInt(window.localStorage.getItem('catHealth'));
  catHunger = parseInt(window.localStorage.getItem('catHunger'));
  catDomestication = parseInt(window.localStorage.getItem('catDomestication'));
  money = parseInt(window.localStorage.getItem('money'));
  food = parseInt(window.localStorage.getItem('food'));
  medicine = parseInt(window.localStorage.getItem('medicine'));
  timebefore = new Date();
  timebefore.setTime(parseInt(window.localStorage.getItem('timevalue')));
  timenow = new Date();
  timediff = timenow - timebefore;
  timediff /= 1000;
  console.log(timediff+" seconds since last opened");
  
}
