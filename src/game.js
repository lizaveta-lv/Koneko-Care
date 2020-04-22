import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

import groundImg from '../www/img/back.png' 
import catImg from '../www/img/cat.png'


const loaderSceneConfig = {
  key: 'loader',
  active: true,
  preload: preload,
  create: create,
};

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1280,
  height: 720,
  scene: [loaderSceneConfig],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
//============================================================================================================
//modal windows
let modalAlert = document.getElementById('modalAlert');
let modalMenu = document.getElementById('modalMenu');
let modalShop = document.getElementById('modalShop');
let modalCat = document.getElementById('modalCat');
let modalOffer = document.getElementById('modalOffer');
//close button
let closeAlert = document.getElementsByClassName('close')[0];
let closeMenu = document.getElementsByClassName('close')[1];
let closeShop = document.getElementsByClassName('close')[2];
let closeCat = document.getElementsByClassName('close')[3];
let closeOffer = document.getElementsByClassName('close')[4];
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
//offer buttons and text
let btnKeepIt = document.getElementById('btnKeepIt');
let btnGiveAway = document.getElementById('btnGiveAway');
let offerMoney;
//sprites
let ground;
let cat;
//decaying stats boolean
let isStarving = new Boolean(false);
let isGameEnd = new Boolean(false);
//decaying stats
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
let adoptionButton;
//decay intervals values
let decayspeed = 1000;
let earnspeed = 1000;
//intervals
let increaseMoneyInterval;
let decreaseValuesInterval;
let autosave;
//movement
let moveTo;
let randomMovementInterval;
let randomX;
let randomY;
let adoptionModalShown = false;

//============================================================================================================
export function startGame() {
  const game = new Phaser.Game(config);
  screen.orientation.lock('landscape');
}

//loading from storage
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
  this.load.image('ground', groundImg);
  this.load.image('cat',  catImg);

  //loading bar
  let loadingBar = this.add.graphics({
    fillStyle: {
      color: 0xffffff
    }
  });
  this.load.on("progress", (percent)=>{
    loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
  })

}
function create() {
  //add background sprites
  ground = this.add.sprite(640, 360, 'ground');
  //UI
  statText = this.add.text(1100, 16, 'Cat Stats', {fontSize: '24px', fill: '#000'});
  expendText = this.add.text(16, 680, 'Money \nFood \nMedicine', {fontSize: '24px', fill: '#000'});
  menuButton = this.add.text(16, 16, 'Menu', {fontSize: '24px',fill: '#000'}).setInteractive().on('pointerup', () => menuOpen());
  shopButton = this.add.text(16, 50, 'Shop', {fontSize: '24px',fill: '#000'}).setInteractive().on('pointerup', () => shopOpen());
  adoptionButton = this.add.text(900, 16, 'Adoption \nOffer', {fontSize: '24px',fill: '#000'}).setInteractive().on('pointerup', () => offerOpen());
  adoptionButton.visible = false;

  //update ui before interval call function
  statText.setText(
    'Cat Stats:\nHealth\n' +
      catHealth +
      '\nHunger\n' +
      catHunger +
      '\nDomestication\n' +
      catDomestication +
      '%'
  );
  expendText.setText(
    'Money: ' + money + ' Food: ' + food + ' Medicine: ' + medicine
  );
  //start intervals
  decreaseValuesInterval = setInterval(decayValues, decayspeed);
  increaseMoneyInterval = setInterval(increaseMoney, earnspeed);
  randomMovementInterval = setInterval(randomMovement, 8000);
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
  cat.setInteractive({ useHandCursor: true }).on('pointerup', () => catOpen());


}

function update() {}

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
closeOffer.onclick = function () {
  modalOffer.style.display = 'none';
};

//modal window open
function menuOpen() {
  modalMenu.style.display = 'block';
}
function shopOpen() {
  shopMoneyCheck();
  modalShop.style.display = 'block';
}
function catOpen() {
  document.getElementById('catStatText').innerHTML = 'Hunger: ' + catHunger + '  Health: ' + catHealth;

  modalCat.style.display = 'block';
  
}
function offerOpen() {
  offerMoney = 100 + (catDomestication - 79) * 10;
  document.getElementById('offerText').innerHTML = 'Do want to give away your Koneko for ' + offerMoney + ' money?';

  modalOffer.style.display = 'block';
}

//random movement
function randomMovement() {
  randomX = Math.floor(Math.random() * 1000);
  randomY = Math.floor(Math.random() * 400) + 200;
  moveTo.moveTo(randomX, randomY);
}

//new method for decaying values
function decayValues() {
  if (catHunger !== 0) {isStarving = false;}

  if (isStarving == false && isGameEnd == false) {
    //hunger
    catHunger--;

    if (catHunger == 0) {
      document.getElementById('modalText').innerHTML = 'Your cat is starving!';
      modalAlert.style.display = 'block';
      navigator.vibrate(1000);
      isStarving = true;
    }
    if (catHunger < 0) {
      catHunger = 0;
    } else if (catHunger > 100) {
      catHunger = 100;
    }
  } else if (isStarving == true && isGameEnd == false) {
    //health
    catHealth--;
    if (catHealth <= 0) {
      isGameEnd = true;
    }
    if (catHealth < 0) {
      catHealth = 0;
    } else if (catHealth > 100) {
      catHealth = 100;
    }
  } else if (isGameEnd == true) {
    document.getElementById('modalText').innerHTML = 'Your cat ran away!';
    modalAlert.style.display = 'block';
    navigator.vibrate(1000);
    cat.setActive(false).setVisible(false);
  }

  //domestication checks
  if (catHunger >= 50 && catHealth >= 70) {
    catDomestication++;
    if (catDomestication > 80) {
      adoptionButton.visible = true;

      if (!adoptionModalShown) {
        document.getElementById('modalText').innerHTML =
        'Hey! Your koneko is ready for adoption!';
        modalAlert.style.display = 'block';
        navigator.vibrate(1000);
        adoptionModalShown = true;
      }

    }
  } else if (catHunger < 20 || catHealth < 40) {
    catDomestication--;
    if (catDomestication < 0) {
      catDomestication = 0;
      isGameEnd = true;
    } 
  }

  //update UI
  statText.setText(
    'Cat Stats:\nHealth\n' +
      catHealth +
      '\nHunger\n' +
      catHunger +
      '\nDomestication\n' +
      catDomestication +
      '%'
  );
}

function offscreenDecay() {
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
  if (money - 20 >= 0) {
    food = food + 1;
    money = money - 20;
    shopMoneyCheck();
  }
};
btnBuyMedicine.onclick = function () {

  if (money - 100 >= 0) {
    food = food + 1;
    money = money - 20;
    shopMoneyCheck();
  }
};
function shopMoneyCheck(){
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
btnUseFood.onclick = function () {
  food = food - 1;
  catHunger = catHunger + 10;
  itemUsageCheck();
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
btnUseMedicine.onclick = function () {
  medicine = medicine - 1;
  catHealth = catHealth + 15;
  itemUsageCheck();
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
function itemUsageCheck(){
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
//============================================================================================================
btnGiveAway.onclick = function () {
  cat.setActive(false).setVisible(false);
  money = money + offerMoney;
  modalOffer.style.display = 'none';
  document.getElementById('modalText').innerHTML =
    'New family of Koneko is very grateful! </br>Now is time to take care of new Koneko!';
  modalAlert.style.display = 'block';
};
btnKeepIt.onclick = function () {
  modalOffer.style.display = 'none';
};
//============================================================================================================
function savestate() {
  window.localStorage.setItem('catHealth', catHealth);
  window.localStorage.setItem('catHunger', catHunger);
  window.localStorage.setItem('catDomestication', catDomestication);
  window.localStorage.setItem('money', money);
  window.localStorage.setItem('food', food);
  window.localStorage.setItem('medicine', medicine);
  let timebefore = new Date();
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
  let timebefore = new Date();
  timebefore.setTime(parseInt(window.localStorage.getItem('timevalue')));
  timenow = new Date();
  timediff = timenow - timebefore;
  timediff /= 1000;
  console.log(timediff + ' seconds since last opened');
  for (var i = 0; i < timediff; i++) {
    if (i % (decayspeed / 1000) == 0) offscreenDecay();
    if (i % (earnspeed / 1000) == 0) money++;
  }
}
