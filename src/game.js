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
//modal
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
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
//decaying intervals
let increaseMoneyInterval;
let decreaseValuesInterval;

export function startGame() {
  const game = new Phaser.Game(config);
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
}

//loading from storage
//window.localStorage.clear();  //use this to reset stats


let autosave;

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
  statText = this.add.text(16, 16, 'Cat Stats', {
    fontSize: '24px',
    fill: '#000',
  });
  expendText = this.add.text(850, 16, 'Money \nFood \nMedicine', {
    fontSize: '24px',
    fill: '#000',
  });
  //start intervals
  decreaseValuesInterval = setInterval(decayValues, 600);
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
//modal window
span.onclick = function() {
  modal.style.display = "none";
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
      modal.style.display = "block";
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
    modal.style.display = "block";
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
    'Cat Stats:\nHealth: ' +
      catHealth +
      '\nHunger: ' +
      catHunger +
      '\nDomestication: ' +
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
    'Money\n' + money + '\nFood\n' + food + '\nMedicine\n' + medicine
  );
}
function increaseMoney() {
  money++;
  expendText.setText(
    'Money\n' + money + '\nFood\n' + food + '\nMedicine\n' + medicine
  );
}
function savestate() {
  window.localStorage.setItem('catHealth', catHealth);
  window.localStorage.setItem('catHunger', catHunger);
  window.localStorage.setItem('catDomestication', catDomestication);
  window.localStorage.setItem('money', money);
  window.localStorage.setItem('food', food);
  window.localStorage.setItem('medicine', medicine);
  console.log('saving...');
}
function loadstate() {
  catHealth = parseInt(window.localStorage.getItem('catHealth'));
  catHunger = parseInt(window.localStorage.getItem('catHunger'));
  catDomestication = parseInt(window.localStorage.getItem('catDomestication'));
  money = parseInt(window.localStorage.getItem('money'));
  food = parseInt(window.localStorage.getItem('food'));
  medicine = parseInt(window.localStorage.getItem('medicine'));
}
