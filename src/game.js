import ObjectContainer from './object_container';
import House from './house';
import Person from './person';
import Pet from './pet';
import Drink from './drink';
import Food from './food';
import Clue from './clue';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.colors = [];
        this.names = [];
        this.foods = [];
        this.drinks = [];
        this.pets = [];
    }

    start(canvas){
        this.createHouses(canvas)
            
        const colors = ['transparent', 'blue', 'green', 'red', 'white', 'yellow' ]    
        const names = ['joe', 'michelle', 'mike', 'vanessa', 'walker']
            
        let x = 50;
        names.forEach(name => {
          const person = new Person(name,[x, 275])
          person.draw(canvas);
          x += 50
        });
    
        x= 325
        const pets = ['bird', 'fish', 'cat',  'dog', 'horse']
        pets.forEach(type => {
        
          const pet = new Pet(type,[x, 250])
          pet.draw(canvas);
          x+=50
        });
    
        x= 325
        const foods = ['burgers', 'sushi', 'pizza',  'tacos', 'spaghetti',]
        foods.forEach(type => {
          const food = new Food(type, [x, 310])
          food.draw(canvas);
          x+=50
        });
    
        x= 325
        const drinks = ['beer', 'boba', 'coffee', 'wine','tea']
        drinks.forEach(type => {
          const drink = new Drink(type, [x, 370])
          drink.draw(canvas);
          x+=50
        });

        const text = "Each house displayed has a unique color and a person \nliving in it. Each person has a specific pet they own, a \ndistinct type of food they like, an exclusive favorite drink. \nUse the clues below to place each item with the correct \nhouse and click on the house to change it to its \nappropriate color."
        const instructions = new fabric.Text(text,{ fontSize: 18, fontFamily:'fantasy',top:260, left: 625 })
        canvas.add(instructions)

        const realColors = [...colors].slice(1)
        this.shuffle(realColors)
        this.shuffle(names);
        this.shuffle(foods);
        this.shuffle(drinks);
        this.addClues(realColors, names, foods, drinks);
    }

    addClues(colors, names,foods,drinks) {
        const namesCap = names.map((name) => name[0].toUpperCase() + name.slice(1));
        const clues = [
            `The person who keeps a horse as a pet lives next to the person who eats ${foods[0]}.`,
            `The person who eats ${foods[1]} lives next to the one who keeps a cat as a pet.`,
            `The ${colors[3]} house is exactly to the left of the ${colors[4]} house.`,
            `The person who eats ${foods[1]} has a neighbour who drinks ${drinks[0]}.`,
            `The person living in the center house drinks ${drinks[2]}.`,
            `The owner of the ${colors[3]} house drinks ${drinks[3]}.`,
            `The owner of the ${colors[0]} house eats ${foods[1-1]}.`,
            `The person who eats ${foods[2]} keeps a bird as a pet.`,
            `The person who eats ${foods[4]} drinks ${drinks[4]}.`,
            `${namesCap[0]} lives next to the ${colors[1]} house.`,
            `${namesCap[2]} lives in the ${colors[2]} house.`,
            `${namesCap[4]} keeps a dog as a pet.`,
            `${namesCap[1]} drinks ${drinks[1]}.`,
            `${namesCap[0]} lives in the first house.`,
            `${namesCap[3]} eats ${foods[3]}.`,
        ];

        let y = 440
        clues = clues.map((clue, idx) => {
            if (idx < 5) {
                new Clue(clue,[25, y]).draw(this.canvas);
                y += 20;
            } else if (idx > 9) {
                new Clue(clue,[880,y]).draw(this.canvas);
                y += 20;
            } else {
                new Clue(clue,[545,y]).draw(this.canvas);
                y += 20
            }

            if (y === 540) y = 440;
        })
        
    }
    createHouses(canvas) {
        const colors = ['transparent', 'blue', 'green', 'red', 'white', 'yellow' ]
        new House([100, 40],"transparent", colors, '1').draw(canvas)
        new ObjectContainer([60,35]).draw(canvas)
        new House([300, 40], "transparent", colors, '2').draw(canvas)
        new ObjectContainer([260,35]).draw(canvas)
        new House([500, 40], "transparent", colors, '3').draw(canvas)
        new ObjectContainer([460,35]).draw(canvas)
        new House([700, 40],"transparent", colors, '4').draw(canvas)
        new ObjectContainer([660,35]).draw(canvas)
        new House([900, 40],"transparent", colors, '5').draw(canvas) 
        new ObjectContainer([860,35]).draw(canvas)
    }

    shuffle(arr) {
        for(let i = arr.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        return arr
    }
}