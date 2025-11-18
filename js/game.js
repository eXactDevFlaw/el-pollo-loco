let canvas;
let world;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);

    console.log('My Chatracter is', world.character)
    console.log('My Enemyies are', world.enemies)
}

window.addEventListener('DOMContentLoaded', () => {
    init()
})