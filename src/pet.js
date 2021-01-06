export default class Pet {
    constructor(type,pos) {
        this.type = type
        this.pos = pos;
    }

    draw(canvas) {
        fabric.Image.fromURL(`../assets/images/pets/${this.type}.png`, function(img) {
            img.scale(.2)
            img.set('hasControls', false)
            canvas.add(img);
        });
    }
}