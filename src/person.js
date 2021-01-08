export default class Person {
    constructor(name,pos) {
        this.name = name;
        this.pos = pos;
        
    }

    draw(canvas) {
        let that = this;
        
        //format shorter names to make them centered
        let formatted = this.name[0].toUpperCase() + this.name.slice(1)
        while (formatted.length < 6) {
            formatted = " " + formatted
        }
        if (this.name == "joe") formatted = " " + formatted 
        const person = new fabric.Text(formatted, { top: -12.5, fontSize: 12, fontFamily:'fantasy' });
        
        fabric.Image.fromURL(`../assets/images/people/${this.name}.svg`, function(img) {
            img.scale(0.08)

           
            const obj = new fabric.Group([img, person], {
                left: that.pos[0],
                top: that.pos[1],
                
            })
            obj.set('hasControls', false)
            canvas.add(obj);
            
            obj.on('modified', () => {
                that.updatePos([obj.left,obj.top])
                console.log(that.pos)
            })
            
            
            
            obj.on('mouseover', () => {
                obj.scale(1.02)
                canvas.remove(obj);
                canvas.add(obj);
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