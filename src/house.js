// import { fabric } from "fabric";

export default class House {
    constructor(pos, color, colors, num) {
        this.pos = pos;
        this.color = color;
        this.colors = colors;
        this.num = num;
        this.takenColors = [];
    }

    draw(canvas, house2) {
        let that = this
        fabric.Image.fromURL(`../assets/images/houses/${that.color}house.png`, function(house) {
            house.scale(0.049)
            house.set('left', that.pos[0]);
            house.set('top', that.pos[1]);
            house.set('selectable', false);
            house.set('hoverCursor', "pointer");
            canvas.add(house)
            house.sendToBack();
            if (house2) {
                house2.sendToBack()
                canvas.remove(house2)
            }
            
            
            house.on('mousedown', () => {
                that.changeColor();
                console.log(that.color);
                that.draw(canvas,house)
            })
        })
    }

    changeColor() {
        this.color = this.colors[(this.colors.indexOf(this.color) + 1) % this.colors.length] //change color to next color in arr
        if (this.takenColors.includes(this.color)) this.changeColor();
        
    }
}