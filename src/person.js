export default class Person {
    constructor(name,pos) {
        this.name = name;
        this.pos = pos;
        
    }

    draw(canvas) {
        let that = this;
        const name = new fabric.Text(this.name[0].toUpperCase() + this.name.slice(1), { top: -12.5, fontSize: 12, fontFamily:'fantasy' });
        
        fabric.Image.fromURL(`../assets/images/people/${this.name}.svg`, function(img) {
            img.scale(0.08)

           
            const obj = new fabric.Group([img, name], {
                left: that.pos[0],
                top: that.pos[1],
                
            })
            obj.set('hasControls', false)
            canvas.add(obj);
            
            obj.on('moving', () => {
                that.updatePos([obj.left,obj.top])
                console.log(that.pos)
            })
            
            
            
            obj.on('mouseover', () => {
                obj.scale(1.02)
                canvas.remove(obj);
                canvas.add(obj);
                console.log('on obj')
            })
            
            obj.on('mouseout', () => {
                obj.scale(1/1.02);
                canvas.remove(obj);
                canvas.add(obj);
            })
            
        });
    }

    updatePos(pos) {
        this.pos = pos
    }
}