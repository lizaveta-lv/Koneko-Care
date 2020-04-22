import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

import groundImg from '../www/img/back.png';
import catImg1 from '../www/img/cat1.png';
import catImg2 from '../www/img/cat2.png';
import catImg3 from '../www/img/cat3.png';

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
//cat menu buttons
let btnUseFood = document.getElementById('btnUseFood');
let btnUseMedicine = document.getElementById('btnUseMedicine');
//offer buttons and text
let offerMoney;
//sprites
let ground;
let cat;
let domestication1;
let domestication2;
let domestication3;
//decaying stats boolean
let isStarving = false;
let isGameEnd = false;
//decaying stats
let catHealth;
let catHunger;
let catDomestication;

let money;
let food;
let medicine;

let choise;
//UI
let getCatButton;
let statText;
let expendText;
let menuButton;
let shopButton;
let adoptionButton;
//decay intervals values
const decayspeed = 1000;
const earnspeed = 1000;
//movement
let moveTo;
let randomX;
let randomY;
//intervals
let decayInterval;
let randomMovInterval;
//alerts
let adoptionModalShown = false;
let gameEndModalShown = false;
//
const vibrDuration = 200;

let shake;

//============================================================================================================
export function startGame() {
  const game = new Phaser.Game(config);
  screen.orientation.lock('landscape');
}

//loading from storage
//window.localStorage.clear(); //use this to reset stats
if (window.localStorage.getItem('catHealth') == null) {
  //default values
  catHealth = 100;
  catHunger = 100;
  catDomestication = 0;
  money = 200;
  food = 0;
  medicine = 0;
  choise = 0;
  console.log('storage is empty');
  savestate();
} else {
  loadstate();
  console.log('info being loaded');
  console.log("after load state:", catHealth, catHunger, catDomestication, money, food, medicine, choise);
}

function preload() {
  //load sprites
  this.load.image('ground', groundImg);
  this.load.image('cat1', catImg1);
  this.load.image('cat2', catImg2);
  this.load.image('cat3', catImg3);

  //loading bar TODO: make in pink and slower
  let loadingBar = this.add.graphics({
    fillStyle: {
      color: 0xffffff,
    },
  });
  this.load.on('progress', (percent) => {
    loadingBar.fillRect(
      0,
      this.game.renderer.height / 2,
      this.game.renderer.width * percent,
      50
    );
  });
}
function create() {
  //add background sprites
  ground = this.add.sprite(640, 360, 'ground');

  let textStyle = {
    fontSize: '40px',
    fill: '#000',
    align: 'right'
  }
  //UI
  statText = this.add.text(950, 16, 'Cat Stats', textStyle);
  expendText = this.add.text(16, 680, 'Money \nFood \nMedicine', textStyle);
  menuButton = this.add
    .text(16, 16, 'Menu', textStyle)
    .setInteractive()
    .on('pointerup', () => menuOpen());
  shopButton = this.add
    .text(16, 100, 'Shop', textStyle)
    .setInteractive()
    .on('pointerup', () => shopOpen());
  adoptionButton = this.add
    .text(500, 16, 'Adoption \nOffer', textStyle)
    .setInteractive()
    .on('pointerup', () => offerOpen());
  adoptionButton.visible = false;
  getCatButton = this.add.text(800, 680, 'Get new Koneko', textStyle).setInteractive()
  .on('pointerup', () => getCat());
  getCatButton.visible = false;

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
  
  setInterval(increaseMoney, earnspeed);
  console.log('autosave begins');
  setInterval(savestate, 1000);

  cat = this.add.sprite(1000, 600, 'cat1');
  cat.setScale(2);
  cat.visible = false;
  if (choise = 0){
    getCat();
  }else if (choise >= 1 && choise <= 3){
    cat.setTexture('cat' + choise.toString(10));
    cat.visible = true;
  }
  
  decayInterval = setInterval(decayValues, decayspeed);
  randomMovInterval = setInterval(randomMovement, 8000);

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

let onShake = function() {
  for (let i = -180; i < 180; i++){
    cat.rotation = i;
  }
  navigator.vibrate(vibrDuration);
}

//============================================================================================================
function getCat(){
  domestication1 = Math.floor(Math.random() * 12);
  domestication2 = Math.floor(Math.random() * 12);
  domestication3 = Math.floor(Math.random() * 12);

  document.getElementById('catDomest1').innerText = 'Domestication: ' + domestication1 + '%';
  document.getElementById('catDomest2').innerText = 'Domestication: ' + domestication2 + '%';
  document.getElementById('catDomest3').innerText = 'Domestication: ' + domestication3 + '%';
  
  document.getElementById('modalGetCat').style.display = 'block';
}

document.getElementById('catChoise1').addEventListener("click", getChoise1);
document.getElementById('catChoise2').addEventListener("click", getChoise2);
document.getElementById('catChoise3').addEventListener("click", getChoise3);
function getChoise1() {
  for (let i = 0; i < 3; i++){
    document.getElementsByClassName('choise')[i].style.backgroundColor = 'transparent';
  }
  document.getElementById('choiseAlert').style.display = 'none';
  document.getElementsByClassName('choise')[0].style.backgroundColor = "orange";
  choise = 1;
}

function getChoise2() {
  for (let i = 0; i < 3; i++){
    document.getElementsByClassName('choise')[i].style.backgroundColor = 'transparent';
  }
  document.getElementById('choiseAlert').style.display = 'none';
  document.getElementsByClassName('choise')[1].style.backgroundColor = 'orange';
  choise = 2;
}
function getChoise3() {
  for (let i = 0; i < 3; i++){
    document.getElementsByClassName('choise')[i].style.backgroundColor = 'transparent';
  }
  document.getElementById('choiseAlert').style.display = 'none';
  document.getElementsByClassName('choise')[2].style.backgroundColor = 'orange';
  choise = 3;
}
document.getElementById('btnChoise').onclick = function () {
  if (choise >= 1 && choise <= 3){
    document.getElementById('modalGetCat').style.display = 'none';

    switch (choise){
      case 1:
        catDomestication = domestication1;
        cat.setTexture('cat1');
        cat.visible = true;
        break;
      case 2:
        catDomestication = domestication2;
        cat.setTexture('cat2');
        cat.visible = true;
        break;
      case 3:
        catDomestication = domestication3;
        cat.setTexture('cat3');
        cat.visible = true;
        break;
      default:
        catDomestication = 0;
    };

    getCatButton.visible= false;
    catHealth = 100;
    catHunger = 100;
    isGameEnd = false;
    isStarving = false;
  
    //start decay and random movement intervals
    //decayInterval = setInterval(decayValues, decayspeed);
    //randomMovInterval = setInterval(randomMovement, 8000);
  }else{
    document.getElementById('choiseAlert').style.display = 'block';
  }

}
function gameEnd(){
  if (!gameEndModalShown){
    document.getElementById('modalText').innerHTML = 'Your cat ran away!';
    modalAlert.style.display = 'block';
    navigator.vibrate(vibrDuration);
    cat.visible = false;
    choise = 0;
    clearInterval(decayInterval);
    clearInterval(randomMovInterval);
    gameEndModalShown = true;
    getCatButton.visible = true;
  }
  
  //delete values and cat sprite

  //stop decay and random movement values
  //show alert
}
//============================================================================================================
//modal window close buttons
document.getElementsByClassName('close')[0].onclick = function () {
  modalAlert.style.display = 'none';
};
document.getElementsByClassName('close')[1].onclick = function () {
  document.getElementById('modalMenu').style.display = 'none';
};
document.getElementsByClassName('close')[2].onclick = function () {
  document.getElementById('modalShop').style.display = 'none';
};
document.getElementsByClassName('close')[3].onclick = function () {
  document.getElementById('modalCat').style.display = 'none';
};
document.getElementsByClassName('close')[4].onclick = function () {
  document.getElementById('modalOffer').style.display = 'none';
};

//modal window open
function menuOpen() {
  document.getElementById('modalMenu').style.display = 'block';
}
function shopOpen() {
  document.getElementById('foodCount').innerHTML = ' x' + food;
  document.getElementById('medicineCount').innerHTML = ' x' + medicine;
  shopMoneyCheck();
  document.getElementById('modalShop').style.display = 'block';
}
function catOpen() {
  itemUsageCheck();
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;

  document.getElementById('modalCat').style.display = 'block';
}
function offerOpen() {
  offerMoney = 100 + (catDomestication - 79) * 10;
  document.getElementById('offerText').innerHTML =
    'Do want to give away your Koneko for ' + offerMoney + ' money?';

    document.getElementById('modalOffer').style.display = 'block';
}

//random movement
function randomMovement() {
  randomX = Math.floor(Math.random() * 1000);
  randomY = Math.floor(Math.random() * 400) + 200;
  moveTo.moveTo(randomX, randomY);
}

//new method for decaying values
function decayValues() {
  if (catHunger !== 0) {
    isStarving = false;
  }

  if (isStarving == false && isGameEnd == false) {
    //hunger
    catHunger--;

    if (catHunger == 0) {
      document.getElementById('modalText').innerHTML = 'Your cat is starving!';
      modalAlert.style.display = 'block';
      navigator.vibrate(vibrDuration);
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
    gameEnd();
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
        navigator.vibrate(vibrDuration);
        adoptionModalShown = true;
      }
    }
  } else if (catHunger < 20 || catHealth < 40) {
    catDomestication--;
    if (catDomestication <= 0) {
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
    cat.visible = false;
  }

  //domestication checks
  if (catHunger >= 50 && catHealth >= 70) {
    catDomestication++;
  } else if (catHunger < 20 || catHealth < 40) {
    catDomestication--;
    if (catDomestication = 0) {
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
document.getElementById('btnCreateAcc').onclick = function () {
  //create new account, save current game and open new game for new account
};
document.getElementById('btnDeleteAcc').onclick = function () {
  //delete current account, redirect to login page
};
document.getElementById('btnClearAcc').onclick = function () {
  //clear storage of current account
};
document.getElementById('btnLogOut').onclick = function () {
  //save current game and redirect to login page
};
//============================================================================================================
document.getElementById('btnBuyFood').onclick = function () {
  if (money - 20 >= 0) {
    food = food + 1;
    money = money - 20;
    document.getElementById('foodCount').innerHTML = ' x' + food;
    shopMoneyCheck();
  }
};
document.getElementById('btnBuyMedicine').onclick = function () {
  if (money - 100 >= 0) {
    food = food + 1;
    money = money - 20;
    document.getElementById('medicineCount').innerHTML = ' x' + medicine;
    shopMoneyCheck();
  }
};
function shopMoneyCheck() {
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
  if (catHunger > 100){
    catHunger = 100;
  }
  itemUsageCheck();
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
btnUseMedicine.onclick = function () {
  medicine = medicine - 1;
  catHealth = catHealth + 15;
  if (catHealth > 100){
    catHealth = 100;
  }
  itemUsageCheck();
  //update ui
  document.getElementById('catStatText').innerHTML =
    'Hunger: ' + catHunger + '  Health: ' + catHealth;
};
function itemUsageCheck() {
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
document.getElementById('btnGiveAway').onclick = function () {
  cat.visible = false;
  money = money + offerMoney;
  document.getElementById('modalOffer').style.display = 'none';
  document.getElementById('modalText').innerHTML =
    'New family of Koneko is very grateful! </br>Now is time to take care of new Koneko!';
  modalAlert.style.display = 'block';
  getCatButton.visible = true;
  adoptionButton.visible = false;
};
document.getElementById('btnKeepIt').onclick = function () {
  document.getElementById('modalOffer').style.display = 'none';
};
//============================================================================================================
function savestate() {
  
  window.localStorage.setItem('catHealth', catHealth);
  window.localStorage.setItem('catHunger', catHunger);
  window.localStorage.setItem('catDomestication', catDomestication);
  window.localStorage.setItem('money', money);
  window.localStorage.setItem('food', food);
  window.localStorage.setItem('medicine', medicine);
  window.localStorage.setItem('choise', choise);
  
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
  choise = parseInt(window.localStorage.getItem('choise'));
  let timebefore = new Date();
  timebefore.setTime(parseInt(window.localStorage.getItem('timevalue')));
  let timenow = new Date();
  let timediff = timenow - timebefore;
  timediff /= 1000;
  console.log("before: ", catHealth, catHunger, catDomestication, money, food, medicine, choise);
  console.log(timediff + ' seconds since last opened');
  for (var i = 0; i < timediff; i++) {
    if (i % (decayspeed / 1000) == 0) offscreenDecay();
    if (i % (earnspeed / 1000) == 0) money++;
  }
  console.log("after: ", catHealth, catHunger, catDomestication, money, food, medicine, choise);
}
