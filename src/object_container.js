export default class ObjectContainer {
    constructor(pos) {
        this.pos = pos;
        this.coords = [pos[0]-10, pos[0]+170, 20, 190] //left of obj must be in btw coords[0] and coords[1], top must be btw coords[2] and coords[3]
    }

    draw(canvas) {
        const container = new fabric.Rect({
            left: this.pos[0],
            top: this.pos[1],
            width: 200,
            height: 200,
            stroke: "black",
            fill: "transparent",
        })

        container.set('selectable', false);
        container.set('hoverCursor','default');
        canvas.add(container)
        container.sendToBack();
        container.on('mouseover', () => {
            container.sendToBack()
        })
        container.on('mousedown', () => {
            container.sendToBack()
        })
        
        container.on('mouseup', () => {
            container.sendToBack()
        })
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