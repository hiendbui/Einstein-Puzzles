// import { fabric } from "fabric";

export default class House {
    constructor(pos, color, colors, num, canvas) {
        this.pos = pos;
        this.color = color;
        this.colors = colors;
        this.num = num;
        this.takenColors = [];
        this.coords = [pos[0]-10, pos[0]+170, 0, 190]
        this.canvas = canvas;
    }

    draw(house2) {
        let that = this
        fabric.Image.fromURL(`./assets/images/houses/${that.color}house.png`, function(house) {
            if (house2) that.canvas.remove(house2);
            house.scale(0.049)
            house.set('left', that.pos[0]);
            house.set('top', that.pos[1]);
            house.set('selectable', false);
            house.set('hoverCursor', "pointer");
            that.canvas.add(house)
            house.sendToBack();
            
            house.on('mousedown:before', () => {
                house.on('mousedown:before', () => {});
                that.changeColor(house);
            })
            
        })
    }

    changeColor(house) {
        this.color = this.colors[(this.colors.indexOf(this.color) + 1) % this.colors.length] //change color to next color in arr
        if (this.takenColors.includes(this.color)) {
            this.changeColor(house);
        } else this.draw(house);
    }

    hasItem(item) {
        return item.pos[0] >= this.coords[0] && 
        item.pos[0] <= this.coords[1] && 
        item.pos[1] >= this.coords[2] && 
        item.pos[1] <= this.coords[3]
    }

    hasAnyOf(itemType) {
        let hasOne = false;
        itemType.forEach(item => {
            if (this.hasItem(item)) hasOne = true;
        })
        return hasOne;
    }
}