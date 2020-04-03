import Phaser from 'phaser'
import groundImage from './assets/back.png'
import wallImage from './assets/walls.png'
import catImg from './assets/cat.png'

// 
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
let ground;
let walls;
let cat;
function preload(){
    console.log("preload is called")
    this.load.image('ground', groundImage);
    this.load.image('cat', catImg);
    this.load.image('walls', wallImage);    
}
function create(){
    ground = this.add.sprite(500, 300, 'ground');
    walls = this.add.sprite(500, 300, 'walls');
    walls.enableBody = true
    //walls.body.immovable = true
    cat = this.add.sprite(500, 300, 'cat')
    this.physics.add.existing(cat);

    cat.body.setVelocity(150, 200);
    cat.body.setBounce(1, 1);
    cat.body.setCollideWorldBounds(true);
 

}
function update(){
    this.physics.arcade.collide(cat, walls)
}