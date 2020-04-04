import Phaser from 'phaser'
import groundImage from './assets/back.png'
import wallImage from './assets/walls.png'
import catImg from './assets/cat.png'

var loaderSceneConfig = {
    key: 'loader',
    active: true,
    preload: preload,
    create: create
};

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [ loaderSceneConfig ] 
};


var game = new Phaser.Game(config);
//srites
let ground;
let walls;
let cat;
//decaying stats
let catHealth = 100; //for the purpose of debuging add values
let catHunger = 100;
let catDomestication = 0;
//expendables
let money = 200;
let food = 0;
let medicine = 0;
//UI
let statText;
let expendText;
//decaying intervals
let increaseMoneyInterval;
let decreaseHungerInterval;
let decreaseHealthInterval;
let changeDomesticationInterval;

function preload(){
    this.load.image('ground', groundImage);
    this.load.image('cat', catImg);
    this.load.image('walls', wallImage);    
}
function create(){
    //add background sprites
    ground = this.add.sprite(500, 300, 'ground');
    walls = this.add.sprite(500, 300, 'walls');
    //UI
    statText = this.add.text(16, 16, 'Cat Stats', { fontSize: '24px', fill: '#000' });
    expendText = this.add.text(850, 16, 'Money \nFood \nMedicine', { fontSize: '24px', fill: '#000' });
    //start intervals
    startStarvation();
    changeDomesticationInterval = setInterval(checkDomestication, 350);
    increaseMoneyInterval = setInterval(increaseMoney, 500);
    //cat
    cat = this.add.sprite(500, 300, 'cat')
    this.physics.add.existing(cat);
    cat.body.setVelocity(150, 200);
    cat.body.setBounce(1, 1);
    cat.body.setCollideWorldBounds(true);
    cat.setInteractive({ useHandCursor: true }).on('pointerup', () => feedCat());
    
 

}
function update(){
    this.physics.arcade.collide(cat, walls)
}
function startStarvation(){
    decreaseHungerInterval = setInterval(decayHunger, 350);
}
function feedCat(){
    if(catHunger == 0){
        clearInterval(decreaseHealthInterval); //when we feed cat from 0 hunger, stop health decay
        startStarvation();
    }
    catHunger = catHunger + 10;
    expendText.setText('Money\n' + money + '\nFood\n' + food + '\nMedicine\n' + medicine);

}
function increaseMoney(){
    money++;
    expendText.setText('Money\n' + money + '\nFood\n' + food + '\nMedicine\n' + medicine);
}
function decayHunger(){
    if(catHunger >0 && catHunger <= 100){ //TODO: remove hardcoded values later
        catHunger--;
        statText.setText('Cat Stats:\nHealth: '+ catHealth + '\nHunger: ' + catHunger + '\nDomestication: ' + catDomestication + '%');
    }else if(catHunger == 0){
        clearInterval(decreaseHungerInterval); 
        alert('Your cat is starving!'); 
        decreaseHealthInterval = setInterval(decayHealth, 350); 
        decayHealth();
    }else if(catHunger > 100){
        catHunger = 100;
        statText.setText('Cat Stats:\nHealth: '+ catHealth + '\nHunger: ' + catHunger + '\nDomestication: ' + catDomestication + '%');
    }
}
function decayHealth(){
    if(catHealth >0 && catHealth <= 100){ //TODO: remove hardcoded values later
        catHealth--;
        statText.setText('Cat Stats:\nHealth: '+ catHealth + '\nHunger: ' + catHunger + '\nDomestication: ' + catDomestication + '%');
    }else if(catHealth == 0){
        clearInterval(decreaseHealthInterval); 
        clearInterval(changeDomesticationInterval);
        cat.setActive(false).setVisible(false); 
        alert('Your cat ran away!'); 
         
    }
}
function checkDomestication(){

    if(catHunger >= 50 && catHealth >= 70){ //positive effect
        catDomestication++;
        statText.setText('Cat Stats:\nHealth: '+ catHealth + '\nHunger: ' + catHunger + '\nDomestication: ' + catDomestication + '%');
    }else if(catHunger < 20 || catHealth < 40){// negative effect
        catDomestication--;
        statText.setText('Cat Stats:\nHealth: '+ catHealth + '\nHunger: ' + catHunger + '\nDomestication: ' + catDomestication + '%');
    }
    if(catDomestication < 0){ //cannot go over 0
        clearInterval(decreaseHealthInterval);
        clearInterval(changeDomesticationInterval);
        cat.setActive(false).setVisible(false); 
        alert('Your cat ran away!');
    }
}