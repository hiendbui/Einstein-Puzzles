export default class Drink {
    constructor(type,pos) {
        this.type = type
        this.pos = pos;
    }

    draw(canvas) {
        let that = this;
        fabric.Image.fromURL(`../assets/images/drinks/${this.type}.png`, function(img) {
            img.scale(.2)
            img.set('hasControls', false)
            img.set('left', that.pos[0])
            img.set('top', that.pos[1])
            img.set('index', 9999)
            canvas.add(img);
            
            img.on('moving', () => {
                that.updatePos([img.left,img.top])
                
                console.log(that.pos)
            })
        });
    }

    updatePos(pos) {
        this.pos = pos
    }
}