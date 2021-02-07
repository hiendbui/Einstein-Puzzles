import {fabric} from 'fabric';
import Menu from './menu';
import Easy from './easy';
import Medium from './medium';
import Hard from './hard';

window.addEventListener('DOMContentLoaded', () => {
  const width = 1000;
  const height = 500;
       
  window.resizeTo(width, height)
  
  
  const canvas = new fabric.Canvas("game-canvas", {
    backgroundColor: '#94d3f3',
  })
  canvas.selection = false;
  canvas.preserveObjectStacking = true;
  
  const menu = new Menu(canvas);
  menu.draw(canvas);
  const playEasy = document.getElementById("easy")
  const playMedium = document.getElementById("medium");
  const playHard = document.getElementById("hard");
  const playbtns = document.getElementById("play-btns");
  const gamebtns = document.getElementById("game-btns");
  let game;

  playEasy.onclick = function () {
    game = new Easy(canvas)
    setUpGame();
  }

  playMedium.onclick = function () {
    game = new Medium(canvas)
    setUpGame();
  }

  playHard.onclick = function () {
    game = new Hard(canvas)
    setUpGame();
  }

  const returnbtn = document.getElementById('return');
  returnbtn.onclick = function () {
    canvas.clear();
    gamebtns.style = "display:none"
    playbtns.style = "display:"
    canvas.set('backgroundColor','#94d3f3')
    const menu = new Menu(canvas);
    menu.draw(canvas);
  }

  const reshuffle = document.getElementById('shuffle');
  reshuffle.onclick = function () {
    setUpGame();
  }
  
  const setUpGame = () => {
    canvas.clear();
    playbtns.style = "display:none"
    game.start(canvas);  
    canvas.set('backgroundColor', '#e9f8ed')
    gamebtns.style = "display:block"
  }
});
