let canvas;
let world;


document.addEventListener('DOMContentLoaded', () => {
    init()
})

function init(){
    canvas = document.getElementById('canvas')
    world = new World(canvas)

    console.log('My character is ', world.character);

}