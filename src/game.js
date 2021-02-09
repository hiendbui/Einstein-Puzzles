
export default class Game {
    constructor(canvas) {
        this.canvas = canvas;

        this.houses = [];
        this.colors = [];
        this.people = [];
        this.foods = [];
        this.drinks = [];
        this.pets = [];
        this.clues = [];
        this.solved = false;
    }

    whichHouse(item) {
        let idx;
        this.houses.forEach((house, i) => {
            if (house.hasItem(item)) idx = i;
        })
        return idx
    }

    

    inOtherHouse(house, item) {
        let insideOther = false
        this.houses.forEach((other, i) => {
            if (i !== this.houses.indexOf(house) && other.hasItem(item)) insideOther = true;
        })
        return insideOther;
    }

    checkItemPair(idx, item1Type, item2Type, clueNum) {
        const house1 = this.whichHouse(item1Type[idx]);
        const house2 = this.whichHouse(item2Type[idx]);
        if (house1 === house2 && house1 > -1) {
            this.clues[clueNum].changeColor('green');
        } else if ((house1 > -1 && house2  > -1) || (house1 > -1 && this.houses[house1].hasAnyOf(item2Type)) || (house2 > -1 && this.houses[house2].hasAnyOf(item1Type))) {
            this.clues[clueNum].changeColor('red');
        } else this.clues[clueNum].changeColor('black');
    }
    
    neighboringItemsCheck(item1, item2, item1Type, item2Type, clueNum) {
        const house1 = this.whichHouse(item1);
        const house2 = this.whichHouse(item2);
        if (house1 === house2 + 1 || house1 === house2 - 1) {
            this.clues[clueNum].changeColor('green');
        } else if ((house1 > -1 && house2  > -1) || (house1 > -1 && this.neighborsHaveItem(house1,item2Type)) || (house2 > -1 && this.neighborsHaveItem(house2, item1Type))) {
            this.clues[clueNum].changeColor('red');
        } else this.clues[clueNum].changeColor('black');
    }


    neighborsHaveItem(num,itemType) {
        if (num === 0) return this.houses[num+1].hasAnyOf(itemType)
        else if (num === 4) return this.houses[num-1].hasAnyOf(itemType)
        else return this.houses[num-1]?.hasAnyOf(itemType) && this.houses[num+1]?.hasAnyOf(itemType) 
    }

    colorHouse(color) {
        let idx;
        this.houses.forEach((house,i) => {
            if (house.color === color) idx = i;
        })
        
        return idx;
    }

    checkItemColorPair(idx,itemType,  clueNum) {
        const colorHouse = this.colorHouse(this.colors[idx]);
        const itemHouse = this.whichHouse(itemType[idx]);
        if (colorHouse === itemHouse && colorHouse > -1) {
            if (this.clues[clueNum].color !== 'green') this.clues[clueNum].changeColor('green')
        } else if ((colorHouse > -1 && itemHouse > -1) || (colorHouse > -1 && this.houses[colorHouse].hasAnyOf(itemType)) || (itemHouse > -1 && this.houses[itemHouse].color !== 'white')) {
            if (this.clues[clueNum].color !== 'red') this.clues[clueNum].changeColor('red')
        } else if (this.clues[clueNum].color !== 'black') this.clues[clueNum].changeColor('black');
    }

    checkPersonColorNeighbors(person, color, clueNum) {
        const colorHouse = this.colorHouse(color);
        const personHouse = this.whichHouse(person);
        if (colorHouse === personHouse + 1 || colorHouse === personHouse - 1){ 
            this.clues[clueNum].changeColor('green')
        } else if ((colorHouse > -1 && personHouse > -1) || (colorHouse > -1 && this.neighborsHaveItem(colorHouse, this.people)) || (personHouse > -1 && this.houses[personHouse-1]?.color !== 'white' && this.houses[personHouse+1]?.color !== 'white')) {
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