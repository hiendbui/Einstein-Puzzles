import Game from './game';
import House from './house';
import Person from './person';
import Pet from './pet';
import Drink from './drink';
import Clue from './clue';

export default class Easy extends Game {
    constructor(canvas) {
        super(canvas);
    }

    start(canvas){
        this.solved = false;
        let colors = ['blue', 'green', 'red', 'orange', 'yellow' ]    
        let people = ['joe', 'michelle', 'mike', 'vanessa', 'walker']
        let pets = ['bird', 'fish', 'cat',  'dog', 'horse']
        let drinks = ['beer', 'boba', 'coffee', 'wine','tea']
        
        //randomize order of items
        this.colors = this.shuffle(colors).slice(0,3);
        people = this.shuffle(people).slice(0,3);
        pets = this.shuffle(pets).slice(0,3);
        drinks = this.shuffle(drinks).slice(0,3);

        //create items
        this.houses = [];
        this.createHouses(canvas);

        let x = 100;
        this.people = people.map(name => {
          const person = new Person(name,[x, 255])
          person.draw(canvas);
          x += 80
          return person;
        });
    
        x= 400
        this.pets = pets.map(type => {
        
          const pet = new Pet(type,[x, 260])
          pet.draw(canvas);
          x+= 80
          return pet;
        });
    
        x= 400
        this.drinks = drinks.map(type => {
          const drink = new Drink(type, [x, 320])
          drink.draw(canvas);
          x+= 80
          return drink;
        });

        people = this.shuffle(this.people).map(person => person.name);
        pets = this.shuffle(this.pets).map(pet => pet.type);
        drinks = this.shuffle(this.drinks).map(drink => drink.type);

        this.addClues(colors, people, pets, drinks);
        
        const text = `Instructions: Each house displayed has a unique color and \na person living in it. Each person has exactly one pet they \nown and exactly one favorite type of drink. Use the clues \nbelow to place each item with the correct house and click \non the house to change it to its appropriate color. Your \ntask is to figure out the following question: Who drinks \n${drinks[1]}?`
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
        // clues[0]
        this.oneHouseBtwItemColor(this.drinks[0], this.drinks, this.colors[2], 0)
        
        // clues[1]
        const house0color = this.colorHouse(this.colors[0])
        const petInHouse = num => this.whichHouse(this.pets[num]);
        
        this.neighboringItemsCheck(this.pets[0], this.pets[1],this.pets,this.pets,1)
        if (house0color > 0) {
            this.clues[1].changeColor('red');
        } else if (house0color !== 0) this.clues[1].changeColor('black');

        if (petInHouse(0) >= petInHouse(1) ||
            petInHouse(1) === 0 || petInHouse(0) === 2 ||
            petInHouse(0)+1 ===  petInHouse(2) || 
            petInHouse(1)-1 ===  petInHouse(2)
            ) {
            this.clues[1].changeColor('red');
        }

        //clues[2]
        this.checkPersonColorNeighbors(this.pets[2],this.colors[1], 2);
        if (petInHouse(2) <= this.colorHouse(this.colors[1]) ||
            petInHouse(2) === 0 || this.colorHouse(this.colors[1]) === 2 || 
            this.houses[this.colorHouse(this.colors[1])+1]?.hasAnyOf(this.pets.slice(0,2))) {
            this.clues[2].changeColor('red');
        }

        //clues[3]
        if (this.whichHouse(this.people[0]) === 1) {
            this.clues[3].changeColor('red');
        } else if (this.whichHouse(this.people[0]) >= 0) {
            this.clues[3].changeColor('green');
        } else this.clues[3].changeColor('black');

        //clues[4]
        this.checkItemPair(2,this.pets,this.drinks, 4);

        //clues[5]
        if (this.whichHouse(this.people[2]) === 2) {
            this.clues[5].changeColor('green');
        } else if (this.whichHouse(this.people[2]) < 2 || this.houses[2].hasAnyOf(this.people.slice(0,2))) {
            this.clues[5].changeColor('red');
        } else this.clues[5].changeColor('black');

        if (this.clues.filter(clue => clue.color === 'green').length === 6 && 
            this.whichHouse(this.drinks[1]) === 1 && 
            this.whichHouse(this.people[1]) === 1) {
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
            const message = new fabric.Text(`Congrats! You deduced \ncorrectly that it was \n${name} who drinks \n${that.drinks[1].type}. Return to menu \nto try Medium or Hard!`, { left: 120, top: -20, fontSize: 12, fontFamily:'fantasy' });
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
    addClues(colors, names, pets, drinks) {
        const namesCap = names.map((name) => name[0].toUpperCase() + name.slice(1));
        const clues = [
            `There is one house between the house of the person who drinks ${drinks[0]} and the ${colors[2]} house on the right.`,
            `The person with the ${pets[0]} lives in the ${colors[0]} house directly to the left of the person with the ${pets[1]}.`,
            `The person with the ${pets[2]} lives directly to the right of the ${colors[1]} house.`,
            `${namesCap[0]} does not live in the center house.`,
            `The person with the ${pets[2]} drinks ${drinks[2]}.`,
            `${namesCap[2]} lives in the last house.`,
        ];

        let y = 465
        this.clues = clues.map((clueStr, idx) => {
            let clue;
            if (y === 525) y = 465;
            if (idx < 3) {
                clue = new Clue(clueStr,[20, y])
            } else  {
                clue = new Clue(clueStr,[750,y])
            };
            clue.draw(this.canvas,15);
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
        this.addEmptySpace(canvas,0);
        this.addEmptySpace(canvas,880);
        let a = 220
        for (let i = 0; i < 3; i++) {
            const house = new House([a, 0],"white", [...this.colors,'white'], i, canvas)
            house.draw()
            this.houses.push(house)
            a += 220
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
}