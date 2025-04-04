var ctx;

var planeInformation = new Array();
var planeDistances = new Array();
var boardInformation = new Array();
var cameraRotation = {x: 0, y: -Math.PI/2};

// street name, color, cost to buy
const streets = [
    ["Go", true, true],
    ["Old Kent Road", "#8b4513", 60],
    ["Community Chest", true, true],
    ["Whitechapel Road", "#8b4513", 60],
    ["Income Tax", true, 200],
    ["Kings Cross Station", true, 200],
    ["The Angel, Islington", "#87ceeb", 100],
    ["Chance", true, true],
    ["Euston Road", "#87ceeb", 100],
    ["Pentonville Road", "#87ceeb", 120],
    ["Jail", true, true],
    ["Pall Mall", "#ff69b4", 140],
    ["Electric Company", true, 150],
    ["Whitehall", "#ff69b4", 140],
    ["Northumberland Avenue", "#ff69b4", 160],
    ["Marylebone Station", true, 200],
    ["Bow Street", "#ffa500", 180],
    ["Community Chest", true, true],
    ["Great Marlborough Street", "#ffa500", 180],
    ["Vine Street", "#ffa500", 200],
    ["Free parking", true, true],
    ["Strand", "#ff0000", 220],
    ["Chance", true, true],
    ["Fleet Street", "#ff0000", 220],
    ["Trafalgar Square", "#ff0000", 240],
    ["Fenchurch Street Station", true, 200],
    ["Leicester Square", "#ffff00", 260],
    ["Coventry Street", "#ffff00", 260],
    ["Water Works", true, 150],
    ["Piccadilly", "#ffff00", 280],
    ["Go to jail", true, true],
    ["Regent Street", "#008000", 300],
    ["Oxford Street", "#008000", 300],
    ["Community Chest", true, true],
    ["Bond Street", "#008000", 320],
    ["Liverpool Street Station", true, 900],
    ["Chance", true, true],
    ["Park Lane", "#00008b", 350],
    ["Super Tax", true, 100],
    ["Mayfair", "#00008b", 400]
]

function translateVertex(vertecies, i) {
    let nX = Math.sin(cameraRotation.x)*vertecies[i+2] + Math.cos(cameraRotation.x)*vertecies[i];
    let nZ = Math.cos(cameraRotation.x)*vertecies[i+2] - Math.sin(cameraRotation.x)*vertecies[i];
    let nY = Math.sin(cameraRotation.y)*nZ + Math.cos(cameraRotation.y)*vertecies[i+1];
    nZ = Math.cos(cameraRotation.y)*nZ - Math.sin(cameraRotation.y)*vertecies[i+1];
    nZ += 2300;

    return {nX: nX, nY: nY, nZ: nZ};
}

function createPlane(vertecies, colour, back) {
    let thisPlanesDistances = new Array();
    planeInformation.push([[], colour]);

    for (let i = 0; i < vertecies.length; i += 3) {
        let nX = translateVertex(vertecies, i).nX;
        let nY = translateVertex(vertecies, i).nY;
        let nZ = translateVertex(vertecies, i).nZ;

        thisPlanesDistances.push(Math.sqrt(Math.pow(nX, 2)+Math.pow(nY, 2)+Math.pow(nZ, 2)));
        planeInformation[planeInformation.length-1][0].unshift((nX*(400/nZ))+canvas.width/2, (nY*(400/nZ))+canvas.height/2);
    }

    if (back) {
        planeDistances.push([Infinity, planeInformation.length-1]);
    } else {
        planeDistances.push([thisPlanesDistances.reduce((acc, c) => acc+c, 0)/thisPlanesDistances.length, planeInformation.length-1]);
    }
}

function createSprite(vertex, image) {
    let nX = translateVertex(vertex, 0).nX;
    let nY = translateVertex(vertex, 0).nY;
    let nZ = translateVertex(vertex, 0).nZ;

    planeInformation.push([[(nX*(400/nZ))+canvas.width/2, (nY*(400/nZ))+canvas.height/2], image]);
    planeDistances.push([Math.sqrt(Math.pow(nX, 2)+Math.pow(nY, 2)+Math.pow(nZ, 2)), planeInformation.length-1]);
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    planeDistances.sort(function (a, b) {
        return b[0]-a[0];
    });

    for (let i = 0; i < planeDistances.length; i ++) {
        let l = planeDistances[i][1];

        function drawPlane() {
            ctx.beginPath();
            for (let j = 0; j < 8; j += 2) {
                ctx.lineTo(planeInformation[l][0][j], planeInformation[l][0][j+1]);
            }
            if (typeof planeInformation[l][1] === "string" && planeInformation[l][1].startsWith("#")) {
                ctx.fillStyle = planeInformation[l][1];
                ctx.fill();
            }
            
            ctx.closePath();
            if (!boardInformation[l][2]) {
                ctx.stroke();
            }
        }

        if (planeInformation[l][1].toString().substring(0, 1) == "#") {
            drawPlane();
        } else {
            if (planeInformation[l][1] == true) {
                drawPlane();
            } else {
                ctx.drawImage(planeInformation[l][1], planeInformation[l][0][0]-15, planeInformation[l][0][1]-30, 30, 30);
            }
        }
    }
}

function getVertexFromPosition(position) {
    if (position == 0) {
        return {nX: 872, nZ: -872}
    } else if (position < 10) {
        return {nX: 661.4-((position-1)*165.3), nZ: -872}
    } else if (position == 10) {
        return {nX: -872, nZ: -872}
    } else if (position < 20) {
        return {nX: -872, nZ: -661.35+((position-11)*165.3)}
    } else if (position == 20) {
        return {nX: -872, nZ: 872}
    } else if (position < 30) {
        return {nX: -661.35+((position-21)*165.3), nZ: 872}
    } else if (position == 30) {
        return {nX: 872, nZ: 872}
    } else {
        return {nX: 872, nZ: 661.35-((position-31)*165.3)}
    }
}

window.onload = () => {
    ctx = document.getElementById("canvas").getContext("2d");

    boardInformation.push([[
        1000, 0, -1000,
        744, 0, -1000,
        744, 0 , -744,
        1000, 0, -744
    ], "#ff0000"]);
    boardInformation.push([[
        -1000, 0, -1000,
        -744, 0, -1000,
        -744, 0 , -744,
        -1000, 0, -744
    ], "#ffaa00"]);
    boardInformation.push([[
        -1000, 0, 1000,
        -744, 0, 1000,
        -744, 0 , 744,
        -1000, 0, 744
    ], "#00ff00"]);
    boardInformation.push([[
        1000, 0, 1000,
        744, 0, 1000,
        744, 0 , 744,
        1000, 0, 744
    ], "#0000ff"]);

    for (let i = 0; i < 10; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128
        ], true, false, true]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+56,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+56
        ], streets[i][1], true, true]);
    }

    for (let i = 10; i < 20; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX+56, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX+56, 0, getVertexFromPosition(i).nZ-82.6
        ], streets[i][1], true, true]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-82.6
        ], true, false, true]);
    }

    for (let i = 20; i < 30; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128
        ], true, false, true]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-56,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-56
        ], streets[i][1], true, true]);
    }

    for (let i = 30; i < 40; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-56, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-56, 0, getVertexFromPosition(i).nZ-82.6
        ], streets[i][1], true, true]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-82.6
        ], true, false, true]);
    }

    const sprites = new Image();
    sprites.src = "favicon.png";
    sprites.onload = function() {
        var position = 0;
        function monopolyGameGoBrrr() {
            planeInformation = new Array();
            planeDistances = new Array();

            for (let i = 0; i < boardInformation.length; i ++) {
                createPlane([
                    boardInformation[i][0][0], boardInformation[i][0][1], boardInformation[i][0][2],
                    boardInformation[i][0][3], boardInformation[i][0][4], boardInformation[i][0][5],
                    boardInformation[i][0][6], boardInformation[i][0][7], boardInformation[i][0][8],
                    boardInformation[i][0][9], boardInformation[i][0][10], boardInformation[i][0][11]
                ], boardInformation[i][1], boardInformation[i][3]);
            }

            createSprite([
                getVertexFromPosition(Math.floor(position)).nX, 0, getVertexFromPosition(Math.floor(position)).nZ
            ], sprites);

            drawAll();

            cameraRotation.x += .01;
            cameraRotation.y = Math.sin(cameraRotation.x)*Math.PI/4-Math.PI/4;

            // displaying current street name and data
            const street = streets[Math.floor(position)];
            document.getElementById("streetName").innerHTML = street[0];
            document.getElementById("header").style.backgroundColor = street[1];

            document.getElementById("rent").innerHTML = "£"+(street[1] == undefined?0:street[2]);
            document.getElementById("setRent").innerHTML = "£"+(street[2] == undefined?0:street[2]);
            document.getElementById("1HRent").innerHTML = "£"+(street[3] == undefined?0:street[3]);
            document.getElementById("2HRent").innerHTML = "£"+(street[4] == undefined?0:street[4]);
            document.getElementById("3HRent").innerHTML = "£"+(street[5] == undefined?0:street[5]);
            document.getElementById("4HRent").innerHTML = "£"+(street[6] == undefined?0:street[6]);
            document.getElementById("anHRent").innerHTML = "£"+(street[7] == undefined?0:street[7]);

            document.getElementById("hCost").innerHTML = "£"+(street[8] == undefined?0:street[8]);
            document.getElementById("anHCost").innerHTML = "£"+(street[9] == undefined?0:street[9]);

            if (Math.floor(position) < 40) {
                position += .025;
            } else {
                position = 0;
            }
        }

        setInterval(function () {monopolyGameGoBrrr()}, 1000/30);

        monopolyGameGoBrrr();
    }
}
