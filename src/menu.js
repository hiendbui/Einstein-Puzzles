export default class Menu {
    draw(canvas) {
        fabric.Image.fromURL(`../assets/images/einstein-menu.png`, function(img) {
            img.scale(.5)
            img.set('left', 445)
            img.set('top', 150)
            img.set('selectable', false);
            img.set('hoverCursor', "default");
            canvas.add(img)
        })
        fabric.Image.fromURL(`../assets/images/title.png`, function(title) {
          title.set('left', 295)
          title.set('top', 50)
          title.set('selectable', false);
          title.set('hoverCursor', "default");
          canvas.add(title)
        })
    }
}
