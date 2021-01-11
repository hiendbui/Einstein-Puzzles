export default class Clue {
    constructor(text,pos) {
        this.text = text;
        this.pos = pos;
        this.color;
        this.clue
    }

    draw(canvas) {
        this.clue = new fabric.Text(this.text,{ fontSize: 13.5, fontFamily:'Helvetica Neue',left: this.pos[0], top: this.pos[1], stroke: this.color})
        canvas.add(this.clue);
        this.clue.set('selectable', false);
        this.clue.set('hoverCursor', "default");
    }

    changeColor(color) {
        this.color = color
        this.clue.set('fill',color);
        if (color === 'green' ) {
            this.clue.set('linethrough' , true);
            // this.clue.set('fill','grey')
        } else this.clue.set('linethrough' , false);
    }
}
// Person #3 lives in the Color#3 house.
// Person #5 keeps a dog as a pet.
// Person #2 drinks Drink#2.
// The Color#4 house is exactly to the left of the Color#5 house.
// The owner of the Color#4 house drinks drink#4.
// The person who eats Food#3 keeps a bird as a pet.
// The owner of the Color#1 house eats Food#1.
// The person living in the center house drinks Drink#3.
// Person#1 lives in the first house.
// The person who eats Food#2 lives next to the one who keeps a cat as a pet.
// The person who keeps a horse as a pet lives next to the person who eats Food#1.
// The person who eats Food#5 drinks Drink#5.
// Person#4 eats Food #4.
// Person#1 lives next to the Color#2 house.
// The person who eats Food#2 has a neighbour who drinks Drink#1.