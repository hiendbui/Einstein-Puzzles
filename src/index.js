import {fabric} from 'fabric';
import ObjectContainer from './object_container';
import House from './house';
import Person from './person';
import Pet from './pet';
import Drink from './drink';
import Food from './food';
import Game from './game';

window.addEventListener('DOMContentLoaded', () => {
 
  
  
  const canvas = new fabric.Canvas("game-canvas", {
    backgroundColor: '#E8E8E8',
  })
  
  canvas.selection = false
  canvas.preserveObjectStacking = true;
  const game = new Game(canvas)
  game.start(canvas);  

  
  
});
