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
//srites
let ground;
let walls;
let cat;
//decaying stats
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
let decreaseHungerInterval;
let decreaseHealthInterval;
let changeDomesticationInterval;

export function startGame() {
  const game = new Phaser.Game(config);
  if (window.localStorage.getItem('catHealth') === null) {
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
  startStarvation();
  changeDomesticationInterval = setInterval(checkDomestication, 350);
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
function startStarvation() {
  decreaseHungerInterval = setInterval(decayHunger, 350);
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
function decayHunger() {
  if (catHunger > 0 && catHunger <= 100) {
    //TODO: remove hardcoded values later
    catHunger--;
    statText.setText(
      'Cat Stats:\nHealth: ' +
        catHealth +
        '\nHunger: ' +
        catHunger +
        '\nDomestication: ' +
        catDomestication +
        '%'
    );
  } else if (catHunger == 0) {
    clearInterval(decreaseHungerInterval);
    alert('Your cat is starving!');
    decreaseHealthInterval = setInterval(decayHealth, 350);
    decayHealth();
  } else if (catHunger > 100) {
    catHunger = 100;
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
}
function decayHealth() {
  if (catHealth > 0 && catHealth <= 100) {
    //TODO: remove hardcoded values later
    catHealth--;
    statText.setText(
      'Cat Stats:\nHealth: ' +
        catHealth +
        '\nHunger: ' +
        catHunger +
        '\nDomestication: ' +
        catDomestication +
        '%'
    );
  } else if (catHealth == 0) {
    clearInterval(decreaseHealthInterval);
    clearInterval(changeDomesticationInterval);
    cat.setActive(false).setVisible(false);
    alert('Your cat ran away!');
  }
}
function checkDomestication() {
  if (catHunger >= 50 && catHealth >= 70) {
    //positive effect
    catDomestication++;
  } else if (catHunger < 20 || catHealth < 40) {
    // negative effect
    catDomestication--;
  }

  statText.setText(
    `Cat Stats:\n` +
      `Health: ${catHealth}\n` +
      `Hunger: ${catHunger}\n` +
      `Domestication: ${catDomestication}%`
  );
  if (catDomestication < 0) {
    //cannot go over 0
    clearInterval(decreaseHealthInterval);
    clearInterval(changeDomesticationInterval);
    cat.setActive(false).setVisible(false);
    alert('Your cat ran away!');
  }
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
