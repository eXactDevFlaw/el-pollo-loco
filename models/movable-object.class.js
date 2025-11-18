class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 150;


    /**
     * 
     * @param {String} path 
     */
    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    moveRight(){
        console.log('move right!');
    }

    moveLeft() {
        console.log('move left!');
    }
}