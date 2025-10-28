const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.getElementById("canvas-parent").offsetWidth;
canvas.height = document.getElementById("canvas-parent").offsetHeight-16;

// setting up boardModel, tileData and meta about the game board
var boardModel = [];
var sprites = [];
const tile = {"width": (200-(25.6*2))/9, "height": 25.6}
var cameraRotation = {"x": 0, "y": 0};

const colours = {
    "brown": "#934926", "aqua": "#b9e0f5", "pink": "#d52c87",
    "orange": "#f29104", "red": "#de1a18", "yellow": "#fcdb10",
    "green": "#3c934c", "blue": "#0668b1"
}
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

// syntax for how tile coords are in the boardModel [x1, y1, x2, y2, x3, y3, x4, y4, tileData[tileIndex]]

// main board
boardModel.push([
    -100, -100, 0,
    100, -100, 0,
    100, 100, 0,
    -100, 100, 0,
    1
]);

// bottom
for (let i = 0; i < 9; i ++) {
    boardModel.push([
        (-100+tile.height)+(i*tile.width), -100, 0,
        (-100+tile.height)+((i+1)*tile.width), -100, 0,
        (-100+tile.height)+((i+1)*tile.width), -100+tile.height, 0,
        (-100+tile.height)+(i*tile.width), -100+tile.height, 0,
        8-i
    ]);
}

// top
for (let i = 0; i < 9; i ++) {
    boardModel.push([
        (-100+tile.height)+(i*tile.width), 100, 0,
        (-100+tile.height)+((i+1)*tile.width), 100, 0,
        (-100+tile.height)+((i+1)*tile.width), 100-tile.height, 0,
        (-100+tile.height)+(i*tile.width), 100-tile.height, 0,
        i+18
    ]);
}

// left
for (let i = 0; i < 9; i ++) {
    boardModel.push([
        -100, (100-tile.height)-(i*tile.width), 0,
        -100+tile.height, (100-tile.height)-(i*tile.width), 0,
        -100+tile.height, (100-tile.height)-((i+1)*tile.width), 0,
        -100, (100-tile.height)-((i+1)*tile.width), 0,
        17-i
    ]);
}

// right
for (let i = 0; i < 9; i ++) {
    boardModel.push([
        100, (100-tile.height)-(i*tile.width), 0,
        100-tile.height, (100-tile.height)-(i*tile.width), 0,
        100-tile.height, (100-tile.height)-((i+1)*tile.width), 0,
        100, (100-tile.height)-((i+1)*tile.width), 0,
        i+27
    ]);
}

// adding a test sprite to sprites
sprites.push([
    80, 80, 0,
    "battleship"
]);

sprites.push([
    70, 80, 0,
    "boot"
]);

sprites.push([
    60, 80, 0,
    "dog"
]);

// rendering the boardModel, tokens and houses/hotels that will be on the board every frame (mostly stolen code from https://github.com/xelaoliver/monopoly/blob/main/version-2/script.js)

// rotates [x, y, z] around [0, 0, 0] and returns [x, y], projected onto 2d space (z not included)
function applyRotation(coords) {
    const x = coords[0], y = coords[1], z = coords[2];

    // roll
    const x1 =  Math.cos(cameraRotation.y)*x-Math.sin(cameraRotation.y)*y;
    const y1 =  Math.sin(cameraRotation.y)*x+Math.cos(cameraRotation.y)*y;
    const z1 = z;

    // pitch (rotate around X)
    const y2 =  Math.cos(cameraRotation.x)*y1-Math.sin(cameraRotation.x)*z1;
    const z2 =  Math.sin(cameraRotation.x)*y1+Math.cos(cameraRotation.x)*z1;

    const depth = z2+250;
    if (depth <= 0.0001) {
        return null; // not in view
    }

    return [(x1*(400/depth))+canvas.width/2, (-y2*(400/depth))+canvas.height/2, depth];
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw models
    for (let i = 0; i < boardModel.length; i ++) {
        let tile = boardModel[i];

        // draw board based on the quad and colour in tileData
        ctx.beginPath();
        for (let j = 0; j < 4; j ++) {
            let k = j*3;
            let coords = applyRotation([tile[k], tile[k+1], tile[k+2]]);

            // line to tile vertex with applied rotation
            ctx.lineTo(coords[0], coords[1]);
        }

        // colour tile correctly
        let colour = tileData[tile[tile.length-1]][1];
        if (colour == true) {
            ctx.fillStyle = "#dce7d7";
        } else {
            ctx.fillStyle = tileData[tile[tile.length-1]][1];
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    // sort sprites

    let distances = [];
    for (let i = 0; i < sprites.length; i ++) {
        let tile = sprites[i];

        let depth = applyRotation([tile[0], tile[1], tile[2]]);

        distances.push([i, depth[2]]); // or sqrt([0]^2+[1]^2+[2]^2)
    }

    distances.sort((a, b) => a[1] - b[1]);
    distances.reverse();

    // draw sprites
    for (let i = 0; i < sprites.length; i ++) {
        let tile = sprites[distances[i][0]];
        let coords = applyRotation([tile[0], tile[1], tile[2]]);

        let size = 180/coords[2];
        let width = 32*size; let height = 32*size;

        console.log(width, height);
        ctx.drawImage(document.getElementById(`player-token-${tile[3]}`), coords[0]-width/2, coords[1]-height, width, height);
    }

    // change camera rotation
    cameraRotation.y += .02;
}

cameraRotation.x += Math.PI/3;
setInterval(function () {loop()}, 1000/30);
// loop();
