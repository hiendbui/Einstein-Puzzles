// import { fabric } from "fabric";

export default class House {
    constructor(pos, color, colors) {
        this.pos = pos;
        this.color = color;
        this.colors = colors;
    }

    draw(canvas) {
        
        const base = new fabric.Rect({
            left: 10,
            top:50,
            width: 100,
            height: 75,
            fill: this.color,
            stroke: "black"
        })

        const roof = new fabric.Triangle({
            left: 0, 
            top: 0,
            width: 120, 
            height: 50, 
            fill: this.color, 
            stroke: "black"
        })
        const door =  new fabric.Rect({
            left: 25,
            top: 85,
            width: 25,
            height: 40,
            fill: "#8b4513",
            stroke: "black"
        })
        
        const handle = new fabric.Circle({
            radius:2,
            left: 26,
            top: 105,
            fill: "gold",
            stroke: "black"
        })

        const window = new fabric.Rect({
            left: 70,
            top: 80,
            width: 25,
            height: 25,
            fill: "#E0FFFF",
            stroke: "black"
        })

        
        const house = new fabric.Group([base, roof, door, handle, window], {
            left: this.pos[0],
            top: this.pos[1]
        })
        house.set('selectable', false);
        house.set('hoverCursor', "pointer");
        canvas.add(house)


        house.on('mousedown', () => {
            this.changeColor()
            canvas.remove(house)
            this.draw(canvas)
        })
        
        // ctx.lineWidth = 5
        
        // ctx.strokeRect(this.pos[0], this.pos[1], 100, 75)

    
        // ctx.fillStyle= "#8b4513"
        // ctx.fillRect(this.pos[0]+37.5, this.pos[1]+ 50, 25, 50);
    }

    changeColor() {
        this.color = this.colors[this.colors.indexOf(this.color) + 1] //change color to next color in arr
    }
}