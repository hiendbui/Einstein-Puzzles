import Game from './game';
import House from './house';
import Person from './person';
import Pet from './pet';
import Food from './food';
import Clue from './clue';

export default class Medium extends Game {
    constructor(canvas) {
        super(canvas);
    }

    start(canvas){
        this.solved = false;
        let colors = ['blue', 'green', 'red', 'orange', 'yellow' ]    
        let people = ['joe', 'michelle', 'mike', 'vanessa', 'walker']
        let pets = ['bird', 'fish', 'cat',  'dog', 'horse']
        let foods = ['burgers', 'sushi', 'pizza',  'tacos', 'spaghetti']
        
        //randomize order of items
        this.colors = this.shuffle(colors).slice(0,4);
        people = this.shuffle(people).slice(0,4);
        pets = this.shuffle(pets).slice(0,4);
        foods = this.shuffle(foods).slice(0,4);

        //create items
        this.houses = [];
        this.createHouses(canvas);

        let x = 50;
        this.people = people.map(name => {
          const person = new Person(name,[x, 255])
          person.draw(canvas);
          x += 70
          return person;
        });
    
        x= 375;
        this.pets = pets.map(type => {
        
          const pet = new Pet(type,[x, 260])
          pet.draw(canvas);
          x+= 70
          return pet;
        });
    
        x= 375;
        this.foods = foods.map(type => {
          const food = new Food(type, [x, 320])
          food.draw(canvas);
          x+= 70
          return food;
        });

        people = this.shuffle(this.people).map(person => person.name);
        pets = this.shuffle(this.pets).map(pet => pet.type);
        foods = this.shuffle(this.foods).map(food => food.type);

        this.addClues(colors, people, pets, foods);
        
        const text = `Instructions: Each house displayed has a unique color and \na person living in it. Each person has exactly one pet they \nown and exactly one favorite type of food. Use the clues \nbelow to place each item with the correct house and click \non the house to change it to its appropriate color. Your \ntask is to correctly place each person and item with its \nappropriate house.`
        const instructions = new fabric.Text(text,{ fontSize: 16, fontFamily:'Helvetica Neue',top:260, left: 667.5, fill: "#041405" })
        const close = new fabric.Text('X',{ fontSize: 18, fontFamily:'Helvetica Neue',top:235, left: 1065  })
        const background = new fabric.Rect({top:225, left: 660, width: 430, height: 200, fill: 'white', rx: 20, ry:20 })
        const box = new fabric.Group([background,instructions])
        const btn = document.getElementById('instructions');
        btn.onclick = function () {
            canvas.add(box)
            canvas.add(close)
            document.getElementById("game-btns").style = "display:none"
        }
        box.set('selectable', false);
        box.set('hoverCursor', "default");
        close.set('selectable', false);
        close.set('hoverCursor', "pointer");
        close.on("mousedown" , () =>{
            canvas.remove(box)
            canvas.remove(close)
            document.getElementById("game-btns").style = "display:block"
        })

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
        //clues[0]-clues[1]
        this.twoHousesBtw(this.pets,0);
        if(this.whichHouse(this.pets[0]) > 0 || this.whichHouse(this.pets[3]) < 3) {
            this.clues[0].changeColor('red')
        }
        this.twoHousesBtw(this.foods,1);
        
        //clues[2]-clues[3]
        this.oneHouseBtwItemColor(this.foods[1], this.foods, this.colors[3], 2);
        this.oneHouseBtwItemColor(this.pets[0],this.pets, this.colors[2],3);

        //clues[4]
        const leftFoodHouse = this.whichHouse(this.foods[2]);
        const rightFoodHouse = this.whichHouse(this.foods[3]);
        const allFoodOnEitherSide = (leftIdx,rightIdx) => {
            let allTaken = true;

            for (let i=leftIdx+1; i < this.houses.length; i++) {
                if (!this.houses[i].hasAnyOf(this.foods)) allTaken = false;
            }
            if (allTaken && leftIdx+1) return true;

            for (let i=rightIdx-1; i >= 0; i--) {
                if (!this.houses[i].hasAnyOf(this.foods)) allTaken = false;
            }
            if (rightIdx+1) return allTaken;
        }
        if (leftFoodHouse < rightFoodHouse) {
            this.clues[4].changeColor('green');
        } else if (leftFoodHouse >= rightFoodHouse || allFoodOnEitherSide(leftFoodHouse,rightFoodHouse)) {
            this.clues[4].changeColor('red');
        } else this.clues[4].changeColor('black');

        //clues[5]
        this.oneHouseBtwItems(this.foods[1],this.foods,this.people[3],this.people,5);

        //clues[6]
        if (this.colorHouse(this.colors[1]) ===  1 && [0,2].includes(this.colorHouse(this.colors[0]))) {
            this.clues[6].changeColor('green');
        } else if (!['white',this.colors[1]].includes(this.houses[1].color) || this.houses[3].color === this.colors[0]) {
            this.clues[6].changeColor('red');
        } else if (!['white',this.colors[0]].includes(this.houses[0].color) && !['white',this.colors[0]].includes(this.houses[2].color)) {
            this.clues[6].changeColor('red');
        } else if (this.colorHouse(this.colors[1])+1 && this.colorHouse(this.colors[1]) !==  1 ) {
            this.clues[6].changeColor('red');
        } else this.clues[6].changeColor('black');
       
        this.neighboringItemsCheck(this.people[1], this.pets[2], this.people, this.pets, 7);
        if (this.whichHouse(this.people[1]) === 3 || this.whichHouse(this.pets[2]) === 0) {
            this.clues[7].changeColor('red');
        }
        if (this.whichHouse(this.people[1]) > this.whichHouse(this.pets[2]) === 0) {
            this.clues[7].changeColor('red');
        }

        if (this.whichHouse(this.people[0]) === 0) this.clues[8].changeColor('green')
        else if (this.whichHouse(this.people[0]) === undefined && !this.houses[0].hasAnyOf(this.people)) this.clues[8].changeColor('black')
        else this.clues[8].changeColor('red')

        if (this.clues.filter(clue => clue.color === 'green').length === 9 && this.whichHouse(this.pets[1])===1 && this.whichHouse(this.people[2])===2) {
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
            
            const name = that.people[1].name[0].toUpperCase() + that.people[1].name.slice(1);
            const message = new fabric.Text(`Congrats! You correctly \nplaced each person and \nitem with the house it\nbelongs to. Return to the \nmenu to try Hard!`, { left: 120, top: -20, fontSize: 12, fontFamily:'fantasy' });
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
    addClues(colors, names, pets, foods) {
        const namesCap = names.map((name) => name[0].toUpperCase() + name.slice(1));
        const clues = [
            `There are two houses between the person with the ${pets[0]} and the person with the ${pets[3]} on the right.`,
            `There are two houses between the person who eats ${foods[3]} and the person who eats ${foods[0]}.`,
            `There is one house between the person who eats ${foods[1]} and the ${colors[3]} house on the right.`,
            `There is one house between the person with the ${pets[0]} and the ${colors[2]} house on the right.`,
            `The person who eats ${foods[3]} lives somewhere to right of the person who eats ${foods[2]}.`,
            `There is one house between ${namesCap[3]} and the one who eats ${foods[1]} on the left.`,
            `The second house is ${colors[1]} and is next to the ${colors[0]} house.`,
            `${namesCap[1]} lives directly to the left of the person with the ${pets[2]}.`,
            `${namesCap[0]} lives in the first house.`
        ];

        let y = 445
        this.clues = clues.map((clueStr, idx) => {
            let clue;
            if (y === 545) y = 445;
            if (idx < 5) {
                clue = new Clue(clueStr,[10, y])
            } else  {
                clue = new Clue(clueStr,[610,y])
            };
            clue.draw(this.canvas,13.5);
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
        this.addEmptySpace(canvas,-110);
        this.addEmptySpace(canvas,990);
        let a = 110
        for (let i = 0; i < 4; i++) {
            const house = new House([a, 0],"white", [...this.colors,'white'], i, canvas)
            house.draw()
            this.houses.push(house)
            a += 220
        }


        let x = -130
        for (let i = 0; i < 5; i++){
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

    addEmptySpace(canvas, pos) {
        fabric.Image.fromURL(`./assets/images/houses/nohouse.png`, function(house) {
            house.scale(0.049)
            house.set('left', pos);
            house.set('selectable', false);
            house.set('hoverCursor', "default");
            canvas.add(house)
            house.sendToBack();
        }); 
    }

    twoHousesBtw(type, clueIdx) {
        const notIn = [1,2]
        const itemInHouse = idx => this.whichHouse(type[idx]);
        if (Math.abs(itemInHouse(0)-itemInHouse(3)) === 3) {
            this.clues[clueIdx].changeColor('green')
        } else if  (notIn.includes(itemInHouse(0)) || 
                    notIn.includes(itemInHouse(3)) ||
                    this.houses[0].hasAnyOf(type) &&
                    this.houses[3].hasAnyOf(type)) {
            this.clues[clueIdx].changeColor('red');         
        } else this.clues[clueIdx].changeColor('black');
    }
}