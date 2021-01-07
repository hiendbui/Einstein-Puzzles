export default class ObjectContainer {
    constructor(pos) {
        this.pos = pos;
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
}