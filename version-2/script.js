const canvas = document.createElement("canvas");
canvas.width = 800; 
canvas.height = 600;
const ctx = canvas.getContext("2d");

var planeInformation = new Array();
var planeDistances = new Array();
var boardInformation = new Array();
var cameraRotation = {x: 0, y: -Math.PI/2};

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

    if (back != undefined) {
        planeDistances.push([back, planeInformation.length-1]);
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
    document.body.appendChild(canvas);
    
    boardInformation.push([[
        -744, 0, -744,
        744, 0, -744,
        744, 0, 744,
        -744, 0, 744
    ], "#fff"]);

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

    for (let i = 1; i < 10; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128
        ], true, false, 100]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+56,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+56
        ], "#955436", true, 10000]);
    }

    for (let i = 11; i < 20; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-82.6
        ], true, false, 9999]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX+56, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX+56, 0, getVertexFromPosition(i).nZ-128
        ], "#ff00ff", true, 10000]);
    }

    for (let i = 21; i < 30; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128
        ], true, false, 9999]);

        boardInformation.push([[
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-56,
            getVertexFromPosition(i).nX+82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX-82.6, 0, getVertexFromPosition(i).nZ-56
        ], "#ff0000", true, 10000]);
    }

    for (let i = 31; i < 40; i ++) {
        boardInformation.push([[
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ-82.6,
            getVertexFromPosition(i).nX+128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+82.6,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-82.6
        ], true, false, 9999]);

        boardInformation.push([[
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ-128,
            getVertexFromPosition(i).nX-128, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-56, 0, getVertexFromPosition(i).nZ+128,
            getVertexFromPosition(i).nX-56, 0, getVertexFromPosition(i).nZ-128
        ], "#00ff00", true, 10000]);
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

            cameraRotation.x += .05;
            cameraRotation.y = Math.sin(cameraRotation.x)*Math.PI/4-Math.PI/4;

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