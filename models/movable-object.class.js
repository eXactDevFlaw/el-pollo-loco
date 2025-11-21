class MovableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 150;
    img;


    /**
     * 
     * @param {String} path 
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('move right!');
    }

    moveLeft() {
        console.log('move left!');
    }
}