import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

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
let modalAlert = document.getElementById('modalAlert');
let modalMenu = document.getElementById('modalMenu');
let modalShop = document.getElementById('modalShop');
let modalCat = document.getElementById('modalCat');
//close button
let closeAlert = document.getElementsByClassName('close')[0];
let closeMenu = document.getElementsByClassName('close')[1];
let closeShop = document.getElementsByClassName('close')[2];
let closeCat = document.getElementsByClassName('close')[3];
//menu buttons
let btnCreateAcc = document.getElementById('btnCreateAcc');
let btnDeleteAcc = document.getElementById('btnDeleteAcc');
let btnClearAcc = document.getElementById('btnClearAcc');
let btnLogOut = document.getElementById('btnLogOut');
//shop buttons
let btnBuyFood = document.getElementById('btnBuyFood');
let btnBuyMedicine = document.getElementById('btnBuyMedicine');
//cat menu buttons
let btnUseFood = document.getElementById('btnUseFood');
let btnUseMedicine = document.getElementById('btnUseMedicine');
//sprites
let ground;
let walls;
let cat;
//decaying stats
let isStarving = new Boolean(false);
let isGameEnd = new Boolean(false);
let catHealth; 
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
var decayspeed=3000,earnspeed=1000;
let increaseMoneyInterval;
let decreaseValuesInterval;
//storage
let autosave;
//movement
let moveTo;
let randomMovementInterval;
let randomX;
let randomY;
//============================================================================================================
export function startGame() {
  const game = new Phaser.Game(config);
}

//loading from storage
var timenow,timebefore,timediff;
window.localStorage.clear(); //use this to reset stats
if (window.localStorage.getItem('catHealth') == null) {
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
  //load sprites
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
  menuButton = this.add
    .text(910, 570, 'Menu', {
      fontSize: '24px',
      fill: '#000',
    })
    .setInteractive()
    .on('pointerup', () => menuOpen());
  shopButton = this.add
    .text(16, 16, 'Shop', {
      fontSize: '24px',
      fill: '#000',
    })
    .setInteractive()
    .on('pointerup', () => shopOpen());

  //start intervals
  decreaseValuesInterval = setInterval(decayValues, decayspeed);
  increaseMoneyInterval = setInterval(increaseMoney, earnspeed);
  console.log('autosave begins');
  autosave = setInterval(savestate, 1000);

  //cat
  cat = this.add.sprite(500, 300, 'cat');

  //movement
  moveTo = new MoveTo(cat, { speed: 100 });
  //on canvas click movement
  this.input.on('pointerup', function (pointer) {
    let touchX = pointer.x;
    let touchY = pointer.y;
    if (touchY > 200) {
      moveTo.moveTo(touchX, touchY);
    }
  });

  randomMovementInterval = setInterval(randomMovement, 1500);
  cat.setInteractive({ useHandCursor: true }).on('pointerup', () => catOpen());
}

function update() {
  this.physics.arcade.collide(cat, walls);
}
//============================================================================================================
//modal window close buttons
closeAlert.onclick = function () {
  modalAlert.style.display = 'none';
};
closeMenu.onclick = function () {
  modalMenu.style.display = 'none';
};
closeShop.onclick = function () {
  modalShop.style.display = 'none';
};
closeCat.onclick = function () {
  modalCat.style.display = 'none';
};
//modal window open
function menuOpen() {
  modalMenu.style.display = 'block';
}
function shopOpen() {
  modalShop.style.display = 'block';
}
function catOpen() {
  modalCat.style.display = 'block';
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
  //button visibility
  if (food < 1) {
    btnUseFood.disabled = true;
  } else {
    btnUseFood.disabled = false;
  }
  if (medicine < 1) {
    btnUseMedicine.disabled = true;
  } else {
    btnUseMedicine.disabled = false;
  }
}
//random movement
function randomMovement() {
  randomX = Math.floor(Math.random() * 1000);
  randomY = Math.floor(Math.random() * 400) + 200;
  moveTo.moveTo(randomX, randomY);
  console.log(randomX, randomY);
}
//new method for decaying values
function decayValues() {
  //checks and decaying values
  if (catHunger !== 0) {
    isStarving = false;
  }

  if (isStarving == false && isGameEnd == false) {
    catHunger--;

    if (catHunger == 0) {
      document.getElementById('modalText').innerHTML = 'Your cat is starving!';
      modalAlert.style.display = 'block';
      isStarving = true;
    }
    if (catHunger < 0) {
      catHunger = 0;
    } else if (catHunger > 100) {
      catHunger = 100;
    }
  } else if (isStarving == true && isGameEnd == false) {
    catHealth--;
    if (catHealth <= 0) {
      isGameEnd = true;
    }
    if (catHealth < 0) {
      catHealth = 0;
    }
  } else if (isGameEnd == true) {
    document.getElementById('modalText').innerHTML = 'Your cat ran away!';
    modalAlert.style.display = 'block';
    cat.setActive(false).setVisible(false);
  }

  //domestication checks
  if (catHunger >= 50 && catHealth >= 70) {
    catDomestication++;
  } else if (catHunger < 20 || catHealth < 40) {
    catDomestication--;
    if (catDomestication < 0) {
      isGameEnd = true;
    }
    if (catDomestication < 0) {
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

function offscreenDecay(){
  if (catHunger !== 0) {
    isStarving = false;
  }

  if (isStarving == false && isGameEnd == false) {
    catHunger--;

    if (catHunger == 0) {
      isStarving = true;
    }
    if (catHunger < 0) {
      catHunger = 0;
    } else if (catHunger > 100) {
      catHunger = 100;
    }
  } else if (isStarving == true && isGameEnd == false) {
    catHealth--;
    if (catHealth <= 0) {
      isGameEnd = true;
    }
    if (catHealth < 0) {
      catHealth = 0;
    }
  } else if (isGameEnd == true) {
    cat.setActive(false).setVisible(false);
  }

  //domestication checks
  if (catHunger >= 50 && catHealth >= 70) {
    catDomestication++;
  } else if (catHunger < 20 || catHealth < 40) {
    catDomestication--;
    if (catDomestication < 0) {
      isGameEnd = true;
    }
    if (catDomestication < 0) {
      catDomestication = 0;
    }
  }


}

function increaseMoney() {
  money++;
  expendText.setText(
    'Money: ' + money + ' Food: ' + food + ' Medicine: ' + medicine
  );
  if (money - 20 < 0) {
    document.getElementById('foodAlert').innerHTML = ' < Not enough money! >';
    document.getElementById('foodAlert').style.color = 'red';
  } else {
    document.getElementById('foodAlert').innerHTML = '';
  }
  if (money - 100 < 0) {
    document.getElementById('medicineAlert').innerHTML =
      ' < Not enough money! >';
    document.getElementById('medicineAlert').style.color = 'red';
  } else {
    document.getElementById('medicineAlert').innerHTML = '';
  }
}
//============================================================================================================
btnCreateAcc.onclick = function () {
  //create new account, save current game and open new game for new account
};
btnDeleteAcc.onclick = function () {
  //delete current account, redirect to login page
};
btnClearAcc.onclick = function () {
  //clear storage of current account
};
btnLogOut.onclick = function () {
  //save current game and redirect to login page
};
//============================================================================================================
btnBuyFood.onclick = function () {
  if (money - 20 < 0) {
    document.getElementById('foodAlert').innerHTML = ' Not enough money!'; //todo: refract money alert
  } else {
    document.getElementById('foodAlert').innerHTML = '';
    food = food + 1;
    money = money - 20;
  }
};
btnBuyMedicine.onclick = function () {
  if (money - 100 < 0) {
    document.getElementById('medicineAlert').innerHTML = ' Not enough money!'; //todo: refract money alert
  } else {
    document.getElementById('medicineAlert').innerHTML = '';
    medicine = medicine + 1;
    money = money - 100;
  }
};
//============================================================================================================
btnUseFood.onclick = function () {
  food = food - 1;
  catHunger = catHunger + 10;
  if (food < 1) {
    btnUseFood.disabled = true;
  } else {
    btnUseFood.disabled = false;
  }
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
btnUseMedicine.onclick = function () {
  medicine = medicine - 1;
  catHealth = catHealth + 15;
  if (medicine < 1) {
    btnUseMedicine.disabled = true;
  } else {
    btnUseMedicine.disabled = false;
  }
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
//============================================================================================================
//time calculation
function getPassedTime() {
  //get current time
  //get last registered time
  //calculate difference
}
function calculateValues() {
  //get difference
  //with if statements change values
  //our changes depend on overall decay rating, good idea is to make constants
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
  for(var i=0;i<timediff;i++){
    if(i%(decayspeed/1000)==0)
      offscreenDecay();
    if(i%(earnspeed/1000)==0)
      money++;
  }
}
