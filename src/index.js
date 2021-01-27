import {fabric} from 'fabric';
import Menu from './menu';
import Game from './game';

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
  const playbtn = document.getElementById("play-btn");
  const gamebtns = document.getElementById("game-btns");
  playbtn.onclick = function () {
    const game = new Game(canvas)
    canvas.clear();
    playbtn.style = "display:none"
    game.start(canvas);  
    canvas.set('backgroundColor', '#e9f8ed')
    gamebtns.style = "display:block"
  }
  const returnbtn = document.getElementById('return');
  returnbtn.onclick = function () {
    canvas.clear();
    gamebtns.style = "display:none"
    playbtn.style = "display:"
    canvas.set('backgroundColor','#94d3f3')
    const menu = new Menu(canvas);
    menu.draw(canvas);
  }

  const reshuffle = document.getElementById('shuffle');
  reshuffle.onclick = function () {
    const game = new Game(canvas)
    playbtn.style = "display:none"
    canvas.clear();
    canvas.set('backgroundColor','#e9f8ed')
    game.start(canvas);  
    gamebtns.style = "display:block"
  }
  
});
