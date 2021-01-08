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
        this.containers = [];
        this.houses = [];
        this.colors = [];
        this.people = [];
        this.foods = [];
        this.drinks = [];
        this.pets = [];
        this.clues = [];
    }

    start(canvas){
        this.createHouses(canvas)
            
        let colors = ['blue', 'green', 'red', 'white', 'yellow' ]    
        let people = ['joe', 'michelle', 'mike', 'vanessa', 'walker']
        let pets = ['bird', 'fish', 'cat',  'dog', 'horse']
        let foods = ['burgers', 'sushi', 'pizza',  'tacos', 'spaghetti']
        let drinks = ['beer', 'boba', 'coffee', 'wine','tea']
        
        //randomize order of items
        this.shuffle(colors);
        this.shuffle(people);
        this.shuffle(pets);
        this.shuffle(foods);
        this.shuffle(drinks);

        //create items
        let x = 25;
        this.people = people.map(name => {
          const person = new Person(name,[x, 275])
          person.draw(canvas);
          x += 60
          return person;
        });
    
        x= 325
        this.pets = pets.map(type => {
        
          const pet = new Pet(type,[x, 250])
          pet.draw(canvas);
          x+= 65
          return pet;
        });
    
        x= 325
        this.foods = foods.map(type => {
          const food = new Food(type, [x, 310])
          food.draw(canvas);
          x+= 65
          return food;
        });
    
        x= 325
        this.drinks = drinks.map(type => {
          const drink = new Drink(type, [x, 370])
          drink.draw(canvas);
          x+= 65
          return drink;
        });

        people = this.shuffle(this.people).map(person => person.name);
        pets = this.shuffle(this.pets).map(pet => pet.type);
        foods = this.shuffle(this.foods).map(food => food.type);
        drinks = this.shuffle(this.drinks).map(drink => drink.type);

        this.addClues(colors, people, pets, foods, drinks);
        
        const text = `Each house displayed has a unique color and a person \nliving in it. Each person has a specific pet they own, a \ndistinct type of food they like, an exclusive favorite drink. \nUse the clues below to place each item with the correct \nhouse and click on the house to change it to its \nappropriate color. Your task is to figure out the following \nquestion: Who owns the ${pets[3]}?`
        const instructions = new fabric.Text(text,{ fontSize: 18, fontFamily:'Lucida Sans',top:255, left: 660 })
        canvas.add(instructions)
        instructions.set('selectable', false);
        instructions.set('hoverCursor', "default");

        //update status of game everytime object is moved or mouse is clicked
        canvas.on("mouse:up", () => {
            this.step(canvas)
        })
        canvas.on("mouse:down", () => {
            this.step(canvas)
        })
    }

    step() {
        //pet1 refers to which container pets[1] is in
        const pet1 = this.whichContainer(this.pets[1]);
        const food0 = this.whichContainer(this.foods[0]);
        if (pet1 === food0 + 1 || pet1 === food0 - 1) {
            this.clues[0].changeColor('green');
        } else if ((pet1 > -1 && food0  > -1) || this.neighborsHaveItem(pet1,this.foods) || this.neighborsHaveItem(food0, this.pets)) {
            this.clues[0].changeColor('red');
        } else this.clues[0].changeColor('black');
        //update for clues[4]
        if (this.whichContainer(this.drinks[2]) === 2) {
            this.clues[4].changeColor('green')
        } else if (this.inOtherContainer(this.containers[2], this.drinks[2])) {
            this.clues[4].changeColor('red');
        } else this.clues[4].changeColor('black');
        
    }
    
    addClues(colors, names, pets, foods,drinks) {
        const namesCap = names.map((name) => name[0].toUpperCase() + name.slice(1));
        const clues = [
            `The person who keeps a ${pets[1]} as a pet lives next to the person who eats ${foods[0]}.`,
            `The person who eats ${foods[1]} lives next to the one who keeps a ${pets[0]} as a pet.`,
            `The ${colors[3]} house is exactly to the left of the ${colors[4]} house.`,
            `The person who eats ${foods[1]} has a neighbor who drinks ${drinks[0]}.`,
            `The person living in the center house drinks ${drinks[2]}.`,
            `The owner of the ${colors[3]} house drinks ${drinks[3]}.`,
            `The owner of the ${colors[0]} house eats ${foods[0]}.`,
            `The person who eats ${foods[2]} keeps a ${pets[2]} as a pet.`,
            `The person who eats ${foods[4]} drinks ${drinks[4]}.`,
            `${namesCap[0]} lives next to the ${colors[1]} house.`,
            `${namesCap[2]} lives in the ${colors[2]} house.`,
            `${namesCap[4]} keeps a ${pets[4]} as a pet.`,
            `${namesCap[1]} drinks ${drinks[1]}.`,
            `${namesCap[0]} lives in the first house.`,
            `${namesCap[3]} eats ${foods[3]}.`,
        ];

        let y = 440
        this.clues = clues.map((clueStr, idx) => {
            let clue;
            if (y === 540) y = 440;
            if (idx < 5) {
                clue = new Clue(clueStr,[20, y])
            } else if (idx > 9) {
                clue = new Clue(clueStr,[877.5,y])
            } else {
                clue = new Clue(clueStr,[542.5,y])
              
            }
            clue.draw(this.canvas);
            y += 20;
            return clue
        })
    }

    createHouses(canvas) {
        const colors = ['transparent', 'blue', 'green', 'red', 'white', 'yellow' ]
        let a = 100
        let b = 60
        for (let i = 1; i < 6; i++) {
            const house = new House([a, 40],"transparent", colors, '1')
            house.draw(canvas)
            this.houses.push(house)
            a += 200
            
            const container =  new ObjectContainer([b,35])
            container.draw(canvas)
            this.containers.push(container)
            b += 200
        }
    }

    whichContainer(item) {
        let idx;
        this.containers.forEach((container, i) => {
            if (container.hasItem(item)) idx = i;
        })
        return idx
    }

    

    inOtherContainer(container, item) {
        let insideOther = false
        this.containers.forEach((other, i) => {
            if (i !== this.containers.indexOf(container) && other.hasItem(item)) insideOther = true;
        })
        return insideOther;
    }

    neighborsHaveItem(num,itemType) {
        if (num === 0) return this.containers[num+1]?.hasAnyOf(itemType)
        else if (num === 4) return this.containers[num-1]?.hasAnyOf(itemType)
        else return this.containers[num-1]?.hasAnyOf(itemType) && this.containers[num+1]?.hasAnyOf(itemType) 
    }

    shuffle(arr) {
        for(let i = arr.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1))
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        return arr
    }
}