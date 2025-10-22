const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.getElementById("canvas-parent").offsetWidth;
canvas.height = document.getElementById("canvas-parent").offsetHeight-16;

// setting up boardModel, tileData and meta about the game board
var boardModel = []
const tile = {"width": (200-(25.6*2))/9, "height": 25.6}
var cameraRotation = {"x": 0, "y": 0};

const colours = {"brown": "#8b4513", "aqua": "#87ceeb", "pink": "#0000", "orange": "#0000", "red": "#0000", "yellow": "#0000", "green": "#0000", "blue": "#0000"}
const tileData = [
    ["Old Kent Road", colours.brown, 60],
    ["Community Chest", true, true],
    ["Whitechapel Road", colours.brown, 60],
    ["Income Tax", true, 200],
    ["Kings Cross Station", true, 200],
    ["The Angel, Islington", colours.aqua, 100],
    ["Chance", true, true],
    ["Euston Road", colours.aqua, 100],
    ["Pentonville Road", colours.aqua, 120],
    ["Pall Mall", colours.pink, 140],
    ["Electric Company", true, 150],
    ["Whitehall", colours.pink, 140],
    ["Northumberland Avenue", colours.pink, 160],
    ["Marylebone Station", true, 200],
    ["Bow Street", colours.orange, 180],
    ["Community Chest", true, true],
    ["Great Marlborough Street", colours.orange, 180],
    ["Vine Street", colours.orange, 200],
    ["Strand", colours.red, 220],
    ["Chance", true, true],
    ["Fleet Street", colours.red, 220],
    ["Trafalgar Square", colours.red, 240],
    ["Fenchurch Street Station", true, 200],
    ["Leicester Square", colours.yellow, 260],
    ["Coventry Street", colours.yellow, 260],
    ["Water Works", true, 150],
    ["Piccadilly", colours.yellow, 280],
    ["Regent Street", colours.green, 300],
    ["Oxford Street", colours.green, 300],
    ["Community Chest", true, true],
    ["Bond Street", colours.green, 320],
    ["Liverpool Street Station", true, 900],
    ["Chance", true, true],
    ["Park Lane", colours.blue, 350],
    ["Super Tax", true, 100],
    ["Mayfair", colours.blue, 400]
]

// syntax for how tile coords are in the boardModel [x1, y1, x2, y2, tileData[tileIndex]]

// main board
boardModel.push([-100, -100, 100, 100, 0]);

// bottom
for (let i = 0; i < 9; i ++) {
    boardModel.push([(-100+tile.height)+(i*tile.width), -100, (-100+tile.height)+((i+1)*tile.width), -100+tile.height, i]);
}

// top
for (let i = 0; i < 9; i ++) {
    boardModel.push([(-100+tile.height)+(i*tile.width), 100, (-100+tile.height)+((i+1)*tile.width), 100-tile.height, i+9]);
}

// left
for (let i = 0; i < 9; i ++) {
    boardModel.push([-100, (100-tile.height)-(i*tile.width), -100+tile.height, (100-tile.height)-((i+1)*tile.width), i+18]);
}

// right
for (let i = 0; i < 9; i ++) {
    boardModel.push([100, (100-tile.height)-(i*tile.width), 100-tile.height, (100-tile.height)-((i+1)*tile.width), i+27]);
}

// rendering the boardModel, tokens and houses/hotels that will be on the board every frame (mostly stolen code from https://github.com/xelaoliver/monopoly/blob/main/version-2/script.js)

// rotates [x, y, z] around [0, 0, 0] and returns [x, y], projected onto 2d space (z not included)
function applyRotation(coords) {
    const x = coords[0], y = coords[1], z = coords[2];

    // yaw
    const yaw = cameraRotation.y;
    const x1 =  Math.cos(yaw)*x+Math.sin(yaw)*z;
    const z1 = -Math.sin(yaw)*x+Math.cos(yaw)*z;

    // pitch
    const pitch = cameraRotation.x;
    const y1 =  Math.cos(pitch)*y-Math.sin(pitch)*z1;
    const z2 =  Math.sin(pitch)*y+Math.cos(pitch)*z1;

    const depth = z2+400;
    if (depth <= 0.0001) {
        return null; // not in view
    }

    return [(x1*(400/depth))+canvas.width/2, (-y1*(400/depth))+canvas.height/2];
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < boardModel.length; i ++) {
        let tile = boardModel[i];
        
        let one = applyRotation([tile[0], tile[1], 0]);
        let two = applyRotation([tile[2], tile[3], 0]);

        console.log(one, two);

        ctx.beginPath();
        ctx.lineTo(one[0], one[1]);
        ctx.lineTo(two[0], one[1]);
        ctx.lineTo(two[0], two[1]);
        ctx.lineTo(one[0], two[1]);
        ctx.lineTo(one[0], one[1]);
        ctx.fillStyle = tileData[tile[4]][1];
        ctx.stroke();
        ctx.fill()
    }

    cameraRotation.x += .05;
    cameraRotation.y += .05;
}

setInterval(function () {loop()}, 1000/30);
// loop();
