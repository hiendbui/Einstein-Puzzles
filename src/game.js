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
        this.solved = false;
    }

    start(canvas){
        this.createHouses(canvas)
            
        let colors = ['blue', 'green', 'red', 'orange', 'yellow' ]    
        let people = ['joe', 'michelle', 'mike', 'vanessa', 'walker']
        let pets = ['bird', 'fish', 'cat',  'dog', 'horse']
        let foods = ['burgers', 'sushi', 'pizza',  'tacos', 'spaghetti']
        let drinks = ['beer', 'boba', 'coffee', 'wine','tea']
        
        //randomize order of items
        this.colors = this.shuffle(colors);
        this.shuffle(people);
        this.shuffle(pets);
        this.shuffle(foods);
        this.shuffle(drinks);

        //create items
        let x = 25;
        this.people = people.map(name => {
          const person = new Person(name,[x, 255])
          person.draw(canvas);
          x += 60
          return person;
        });
    
        x= 325
        this.pets = pets.map(type => {
        
          const pet = new Pet(type,[x, 230])
          pet.draw(canvas);
          x+= 65
          return pet;
        });
    
        x= 325
        this.foods = foods.map(type => {
          const food = new Food(type, [x, 290])
          food.draw(canvas);
          x+= 65
          return food;
        });
    
        x= 325
        this.drinks = drinks.map(type => {
          const drink = new Drink(type, [x, 350])
          drink.draw(canvas);
          x+= 65
          return drink;
        });

        people = this.shuffle(this.people).map(person => person.name);
        pets = this.shuffle(this.pets).map(pet => pet.type);
        foods = this.shuffle(this.foods).map(food => food.type);
        drinks = this.shuffle(this.drinks).map(drink => drink.type);

        this.addClues(colors, people, pets, foods, drinks);
        
        const text = `Instructions: Each house displayed has a unique color and \na person living in it. Each person has exactly one pet they \nown, exactly one favorite type of food, and exactly one \nfavorite type of drink. Use the clues below to place each \nitem with the correct house and click on the house to \nchange it to its appropriate color. Your task is to figure out \nthe following question: Who owns the ${pets[3]}?`
        const instructions = new fabric.Text(text,{ fontSize: 16.25, fontFamily:'Helvetica Neue',top:250, left: 660, fill: "#041405" })
        canvas.add(instructions)
        instructions.set('selectable', false);
        instructions.set('hoverCursor', "default");

        //update status of game everytime object is moved or mouse is clicked
        canvas.on("mouse:up", () => {
            this.step(canvas)
        })
        canvas.on("mouse:down", () => {
            this.step(canvas)
            setInterval(this.updateColors.bind(this),100)
        })
    }

    step() {
        // clues[0] - clues[2] checks
        
        this.neighboringItemsCheck(this.pets[1], this.foods[0],this.pets,this.foods,0)
        this.neighboringItemsCheck(this.foods[1], this.pets[0],this.foods,this.pets,1)
        this.neighboringItemsCheck(this.foods[1], this.drinks[0],this.foods,this.drinks,2)

        //clues[3] check
        const color1 = this.colorContainer(this.colors[3])
        const color2 = this.colorContainer(this.colors[4])
        if (color1 === color2-1) {
            this.clues[3].changeColor('green');
        } else if (color1 === 4 || (color1 > -1 && (color2 > -1 || this.houses[color1 + 1].color !== 'white'))) {
            this.clues[3].changeColor('red');
        } else this.clues[3].changeColor('black');

        if (color2 === color1+1) {
            this.clues[3].changeColor('green');
        } else if (color2 === 0 || (color2 > -1 && (color1 > -1 || this.houses[color2 - 1].color !== 'white'))) {
            this.clues[3].changeColor('red');
        } 
        
        //clues[4] check
        if (this.whichContainer(this.drinks[2]) === 2) {
            this.clues[4].changeColor('green')
        } else if (this.inOtherContainer(this.containers[2], this.drinks[2]) || this.containers[2].hasAnyOf(this.drinks)) {
            this.clues[4].changeColor('red');
        } else this.clues[4].changeColor('black');

        //clues[5], clues[6] checks
        this.checkItemColorPair(3,this.drinks,5);
        this.checkItemColorPair(0,this.foods,6);

        //clues[7], clues[8] check
        this.checkItemPair(2, this.foods, this.pets, 7);
        this.checkItemPair(4, this.foods, this.drinks, 8);

        //clues[9]-clues[13] check
        this.checkPersonColorNeighbors(this.people[0],this.colors[1], 9);
        this.checkItemColorPair(2, this.people, 10);
        this.checkItemPair(4, this.people, this.pets,11);
        this.checkItemPair(1,this.people, this.drinks, 12);
        this.checkItemPair(3, this.people, this.foods, 13);
        
        if (this.whichContainer(this.people[0]) === 0) this.clues[14].changeColor('green')
        else if (this.whichContainer(this.people[0]) === undefined && !this.containers[0].hasAnyOf(this.people)) this.clues[14].changeColor('black')
        else this.clues[14].changeColor('red')
        
        if (this.clues.filter(clue => clue.color === 'green').length === 15 && this.whichContainer(this.pets[3]) === 3) {
            if (this.solved === false) this.gameOver();
        }
    }
    
    gameOver() {
        let that = this;
        fabric.Image.fromURL(`./assets/images/einstein.png`, function(img1) {
            fabric.Image.fromURL(`./assets/images/text-box.png`, function(img2) {
            img1.scale(.2)
            img2.scale(.2)
            img2.set('left', 100)
            img2.set('top', -35)
            
            const name = that.people[3].name[0].toUpperCase() + that.people[3].name.slice(1);
            const message = new fabric.Text(`Congrats! You deduced \ncorrectly that it was \n${name} who owned the \n${that.pets[3].type}.`, { left: 120, top: -10, fontSize: 12, fontFamily:'fantasy' });
            const obj = new fabric.Group([img1, img2, message], {
                left: 50,
                top: 225,
            })
            obj.set('selectable', false);
            obj.set('hoverCursor', "default");
            that.canvas.add(obj);
            })
        });

        this.solved = true;
    }
    addClues(colors, names, pets, foods,drinks) {
        const namesCap = names.map((name) => name[0].toUpperCase() + name.slice(1));
        const clues = [
            `The person who keeps a ${pets[1]} as a pet lives next to the person who eats ${foods[0]}.`,
            `The person who eats ${foods[1]} lives next to the one who keeps a ${pets[0]} as a pet.`,
            `The person who eats ${foods[1]} has a neighbor who drinks ${drinks[0]}.`,
            `The ${colors[3]} house is exactly to the left of the ${colors[4]} house.`,
            `The person living in the center house drinks ${drinks[2]}.`,
            `The owner of the ${colors[3]} house drinks ${drinks[3]}.`,
            `The owner of the ${colors[0]} house eats ${foods[0]}.`,
            `The person who eats ${foods[2]} keeps a ${pets[2]} as a pet.`,
            `The person who eats ${foods[4]} drinks ${drinks[4]}.`,
            `${namesCap[0]} lives next to the ${colors[1]} house.`,
            `${namesCap[2]} lives in the ${colors[2]} house.`,
            `${namesCap[4]} keeps a ${pets[4]} as a pet.`,
            `${namesCap[1]} drinks ${drinks[1]}.`,
            `${namesCap[3]} eats ${foods[3]}.`,
            `${namesCap[0]} lives in the first house.`,
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

    updateColors() {
        const takenColors = [];
        this.houses.forEach((house) => {
            if (house.color !== 'white') takenColors.push(house.color)
        });
        
        this.houses.forEach(house => {
            house.takenColors = takenColors;
        })
    }

    createHouses(canvas) {
        const colors = ['white', 'blue', 'green', 'red', 'orange', 'yellow' ]
        let a = 0
        let b = 0
        for (let i = 1; i < 6; i++) {
            const house = new House([a, 0],"white", colors, i)
            house.draw(canvas)
            this.houses.push(house)
            a += 220
            
            const container =  new ObjectContainer([b,35])
            container.draw(canvas)
            this.containers.push(container)
            b += 220
        }

        let x = -20
        for (let i = 0; i < 4; i++){
            fabric.Image.fromURL(`./assets/images/houses/fence.png`, function(fence) {
                fence.scale(0.028)
                fence.set('left', x += 220);
                fence.set('top', 123);
                fence.set('selectable', false);
                fence.set('hoverCursor', "pointer");
                canvas.add(fence)
            })
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

    checkItemPair(idx, item1Type, item2Type, clueNum) {
        const container1 = this.whichContainer(item1Type[idx]);
        const container2 = this.whichContainer(item2Type[idx]);
        if (container1 === container2 && container1 > -1) {
            this.clues[clueNum].changeColor('green');
        } else if ((container1 > -1 && container2  > -1) || (container1 > -1 && this.containers[container1].hasAnyOf(item2Type)) || (container2 > -1 && this.containers[container2].hasAnyOf(item1Type))) {
            this.clues[clueNum].changeColor('red');
        } else this.clues[clueNum].changeColor('black');
    }
    
    neighboringItemsCheck(item1, item2, item1Type, item2Type, clueNum) {
        const container1 = this.whichContainer(item1);
        const container2 = this.whichContainer(item2);
        if (container1 === container2 + 1 || container1 === container2 - 1) {
            this.clues[clueNum].changeColor('green');
        } else if ((container1 > -1 && container2  > -1) || (container1 > -1 && this.neighborsHaveItem(container1,item2Type)) || (container2 > -1 && this.neighborsHaveItem(container2, item1Type))) {
            this.clues[clueNum].changeColor('red');
        } else this.clues[clueNum].changeColor('black');
    }


    neighborsHaveItem(num,itemType) {
        if (num === 0) return this.containers[num+1].hasAnyOf(itemType)
        else if (num === 4) return this.containers[num-1].hasAnyOf(itemType)
        else return this.containers[num-1].hasAnyOf(itemType) && this.containers[num+1].hasAnyOf(itemType) 
    }

    colorContainer(color) {
        let idx;
        this.houses.forEach((house,i) => {
            if (house.color === color) idx = i;
        })
        
        return idx;
    }

    checkItemColorPair(idx,itemType,  clueNum) {
        const colorContainer = this.colorContainer(this.colors[idx]);
        const itemContainer = this.whichContainer(itemType[idx]);
        if (colorContainer === itemContainer && colorContainer > -1) {
            this.clues[clueNum].changeColor('green')
        } else if ((colorContainer > -1 && itemContainer > -1) || (colorContainer > -1 && this.containers[colorContainer].hasAnyOf(itemType)) || (itemContainer > -1 && this.houses[itemContainer].color !== 'white')) {
            this.clues[clueNum].changeColor('red')
        } else this.clues[clueNum].changeColor('black');
    }

    checkPersonColorNeighbors(person, color, clueNum) {
        const colorContainer = this.colorContainer(color);
        const personContainer = this.whichContainer(person);
        if (colorContainer === personContainer + 1 || colorContainer === personContainer - 1){ 
            this.clues[clueNum].changeColor('green')
        } else if ((colorContainer > -1 && personContainer > -1) || (colorContainer > -1 && this.neighborsHaveItem(colorContainer, this.people)) || (personContainer > -1 && this.houses[personContainer-1]?.color !== 'white' && this.houses[personContainer+1]?.color !== 'white')) {
            this.clues[clueNum].changeColor('red')
        } else this.clues[clueNum].changeColor('black');
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