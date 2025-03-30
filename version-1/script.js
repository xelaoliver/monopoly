const ctx = document.getElementById("canvas").getContext("2d");
canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;

var rotation = {x: 0, y: -Math.PI/2, spin: false}
var calculatedPolygon = [];
var calculatedDistance = [];

var playerPosition = 0;
var playerMoney = 1500;
var playerStreets = [];

var polygons = [
	[true, [18.9, 0, 18.9], [-18.9, 0, 18.9], [-18.9, 0, -18.9], [18.9, 0, -18.9], [18.9, 0, 18.9], "#CBE7D0"], // main board
	[true, [25.4, 0, 25.4], [18.9, 0, 25.4], [18.9, 0, 18.9], [25.4, 0, 18.9], [25.4, 0, 25.4], "#FFFFFF"], // goto jail
	[true, [-25.4, 0, 25.4], [-18.9, 0, 25.4], [-18.9, 0, 18.9], [-25.4, 0, 18.9], [-25.4, 0, 25.4], "#FFFFFF"], // free parking
	[true, [-25.4, 0, -25.4], [-18.9, 0, -25.4], [-18.9, 0, -18.9], [-25.4, 0, -18.9], [-25.4, 0, -25.4], "#FFFFFF"], // jail
	[true, [25.4, 0, -25.4], [18.9, 0, -25.4], [18.9, 0, -18.9], [25.4, 0, -18.9], [25.4, 0, -25.4], "#FFFFFF"], // go
	[[22.15, 0, -22.15], "favicon.png"], // 2d sprites will be the players
	[[0, -10, 0], "Monopoly but with capitalism."] // testing text
];

// street name, rent, rent w/colour set, 1 house, 2 houses, 3 houses, 4 houses, hotel, house cost, hotel cost, cost to buy, colour

const streets = [
	[
		["Mediterranean Avenue", 2, 4, 10, 30, 90, 160, 250, 50, 50, 60, "#965a38"],
		["Community Chest", "#ffffff"],
		["Baltic Avenue", 4, 8, 20, 60, 180, 320, 450, 50, 50, 60, "#965a38"],
		["Income Tax", "#ffffff"],
		
		["Reading Railroad", 25, 50, 100, 200, null, null, null, null, null, 200, "#ffffff"],
		
		["Oriental Avenue", 6, 12, 30, 90, 270, 400, 550, 50, 50, 100, "#a8e1fb"],
		["Chance", "#ffffff"],
		["Vermont Avenue", 6, 12, 30, 90, 270, 400, 550, 50, 50, 100, "#a8e1fb"],
		["Connecticut Avenue", 8, 16, 40, 100, 300, 450, 600, 50, 50, 120, "#a8e1fb"],
		["Jail", "#FFFFFF"]
	], [
		["St. Charles Place", 10, 20, 50, 150, 450, 625, 750, 100, 100, 140, "#d93a96"],
		["Electric Company", 4, 10, null, null, null, null, null, 75, null, 150, "#ffffff"],
		["States Avenue", 10, 20, 50, 150, 450, 625, 750, 100, 100, 140, "#d93a96"],
		["Virginia Avenue", 12, 24, 60, 180, 500, 700, 900, 100, 100, 160, "#d93a96"],
		
		["Pennsylvania Railroad", 25, 50, 100, 200, null, null, null, null, null, 200, "#ffffff"],
		
		["St. James Place", 14, 28, 70, 200, 550, 750, 950, 100, 100, 180, "#f7941d"],
		["Community Chest", "#ffffff"],
		["Tennessee Avenue", 14, 28, 70, 200, 550, 750, 950, 100, 100, 180, "#f7941d"],
		["New York Avenue", 16, 32, 80, 220, 600, 800, 1000, 100, 100, 200, "#f7941d"],
		["Free Parking", "#FFFFFF"]
	], [
		["Kentucky Avenue", 18, 36, 90, 250, 700, 875, 1050, 150, 150, 220, "#ed1b24"],
		["Chance", "#ffffff"],
		["Indiana Avenue", 18, 36, 90, 250, 700, 875, 1050, 150, 150, 220, "#ed1b24"],
		["Illinois Avenue", 20, 40, 100, 300, 750, 925, 1100, 150, 150, 240, "#ed1b24"],
		
		["B&O Railroad", 25, 50, 100, 200, null, null, null, null, null, 200, "#ffffff"],
		
		["Atlantic Avenue", 22, 44, 110, 330, 800, 975, 1150, 150, 150, 260, "#fefe22"],
		["Ventnor Avenue", 22, 44, 110, 330, 800, 975, 1150, 150, 150, 260, "#fefe22"],
		["Water Works", 4, 10, null, null, null, null, null, 75, null, 150, "#ffffff"],
		["Marvin Gardens", 24, 48, 120, 360, 850, 1025, 1200, 150, 150, 280, "#fefe22"],
		["Goto Jail", "#FFFFFF"]
	], [  
		["Pacific Avenue", 26, 52, 130, 390, 900, 1100, 1275, 200, 200, 300, "#1fb25a"],
		["North Carolina Avenue", 26, 52, 130, 390, 900, 1100, 1275, 200, 200, 300, "#1fb25a"],
		["Community Chest", "#ffffff"],
		["Pennsylvania Avenue", 28, 56, 150, 450, 1000, 1200, 1400, 200, 200, 320, "#1fb25a"],
		
		["Short Line Railroad", 25, 50, 100, 200, null, null, null, null, null, 200, "#ffffff"],
		
		["Chance", "#ffffff"],
		["Park Place", 35, 70, 175, 500, 1100, 1300, 1500, 200, 200, 350, "#0072bb"],
		["Luxury Tax", "#ffffff"],
		["Boardwalk", 50, 100, 200, 600, 1400, 1700, 2000, 200, 200, 400, "#0072bb"],
		["Go", "#FFFFFF"]
	]
];


for (let index = 0; index < 9; index ++) {
	let factor = index*4.2;
	polygons.push([[25.4, 0, -18.9+factor], [20.8, 0, -18.9+factor], [20.8, 0, -18.9+factor+4.2], [25.4, 0, -18.9+factor+4.2], [25.4, 0, -18.9+factor], streets[3][8-index][streets[3][8-index].length-1]]);
	polygons.push([[20.8, 0, -18.9+factor], [18.9, 0, -18.9+factor], [18.9, 0, -18.9+factor+4.2], [20.8, 0, -18.9+factor+4.2], [20.8, 0, -18.9+factor], streets[3][8-index][streets[3][8-index].length-1]]);
}
for (let index = 0; index < 9; index ++) {
	let factor = index*4.2;
	polygons.push([[-18.9+factor, 0, 20.8], [-18.9+factor+4.2, 0, 20.8], [-18.9+factor+4.2, 0, 25.4], [-18.9+factor, 0, 25.4], [-18.9+factor, 0, 25.4], streets[2][index][streets[2][index].length-1]]);
	polygons.push([[-18.9+factor, 0, 18.9], [-18.9+factor+4.2, 0, 18.9], [-18.9+factor+4.2, 0, 20.8], [-18.9+factor, 0, 20.8], [-18.9+factor, 0, 20.8], streets[2][index][streets[2][index].length-1]]);
}
for (let index = 0; index < 9; index ++) {
	let factor = index*4.2;
	polygons.push([[-25.4, 0, -18.9+factor], [-20.8, 0, -18.9+factor], [-20.8, 0, -18.9+factor+4.2], [-25.4, 0, -18.9+factor+4.2], [-25.4, 0, -18.9+factor], streets[1][index][streets[1][index].length-1]]);
	polygons.push([[-20.8, 0, -18.9+factor], [-18.9, 0, -18.9+factor], [-18.9, 0, -18.9+factor+4.2], [-20.8, 0, -18.9+factor+4.2], [-20.8, 0, -18.9+factor], streets[1][index][streets[1][index].length-1]]);
}
for (let index = 0; index < 9; index ++) {
	let factor = index*4.2;
    polygons.push([[-18.9+factor, 0, -20.8], [-18.9+factor+4.2, 0, -20.8], [-18.9+factor+4.2, 0, -25.4], [-18.9+factor, 0, -25.4], [-18.9+factor, 0, -25.4], streets[0][8-index][streets[0][8-index].length-1]]);
    polygons.push([[-18.9+factor, 0, -18.9], [-18.9+factor+4.2, 0, -18.9], [-18.9+factor+4.2, 0, -20.8], [-18.9+factor, 0, -20.8], [-18.9+factor, 0, -20.8], streets[0][8-index][streets[0][8-index].length-1]]);
}

function calculateVertex(x, y, z) {
	let nX, nY, nZ;

	nX = Math.sin(rotation.x)*z+Math.cos(rotation.x)*x;
	nZ = Math.cos(rotation.x)*z-Math.sin(rotation.x)*x;

	x = nX; z = nZ;

	nY = Math.sin(rotation.y)*z+Math.cos(rotation.y)*y;
	nZ = Math.cos(rotation.y)*z-Math.sin(rotation.y)*y;

	y = nY; z = nZ;

	z += 60;

	return [x, y, z];
}

function calculatePolygons() {
	calculatedPolygon = [];
	calculatedDistance = [];
	for (let polygonIndex = 0; polygonIndex < polygons.length; polygonIndex++) {
        	let avgDepth = 0;
        	calculatedPolygon.push([]);
			let validVertecies = 0;
        	for (let vertexIndex = 0; vertexIndex < polygons[polygonIndex].length - 1; vertexIndex++) {
            		let item = polygons[polygonIndex][vertexIndex];
					if (item.length == 1) {
						continue;
					}
            		let vertex = calculateVertex(item[0], item[1], item[2]);
            		avgDepth += vertex[2];
            		calculatedPolygon[polygonIndex].push(vertex);
					validVertecies ++;
        	}
			if (polygons[polygonIndex][0]) {
        		avgDepth /= 999;
			} else {
				avgDepth /= validVertecies;
			}
        	
		calculatedDistance.push({index: polygonIndex, depth: avgDepth});
        calculatedPolygon[polygonIndex].push(polygons[polygonIndex][polygons[polygonIndex].length-1]);
	}
    	
	calculatedDistance.sort((a, b) => b.depth-a.depth);
	
	calculatedPolygon = calculatedDistance.map(item => calculatedPolygon[item.index]);

	if (rotation.spin) {
		rotation.x += .01;
		rotation.y = (Math.sin(rotation.x)*.75)-.75;
	}
}

function drawAll() {
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFFFA1";
	ctx.fill();
	for (let polygonIndex = 0; polygonIndex < calculatedPolygon.length; polygonIndex ++) {
	 	let polygonOfPolygon = calculatedPolygon[polygonIndex];
		if (polygonOfPolygon.length == 2) {
			let vertexOfSprite = polygonOfPolygon[0];
			if (polygonOfPolygon[1].toString().substring(polygonOfPolygon[1].toString().length-4, polygonOfPolygon[1].toString().length) == ".png") {
				let sprite = new Image(); sprite.src = polygonOfPolygon[1];
				let calculatedVertex = {x: vertexOfSprite[0]*(400/vertexOfSprite[2])+canvas.width/2-15, y: vertexOfSprite[1]*(400/vertexOfSprite[2])+canvas.height/2-27}
				ctx.drawImage(sprite, calculatedVertex.x, calculatedVertex.y, 30, 30);
			} else {
				ctx.fillStyle = "#000000";
				ctx.font = "16px serif";
				ctx.fillText(polygonOfPolygon[1], vertexOfSprite[0]*(400/vertexOfSprite[2])+canvas.width/2-(ctx.measureText(polygonOfPolygon[1]).width/2), vertexOfSprite[1]*(400/vertexOfSprite[2])+canvas.height/2);
			}
		} else {
			ctx.beginPath();
			for (let vertexIndex = 0; vertexIndex < polygonOfPolygon.length; vertexIndex ++) {
				let vertexOfPolygon = polygonOfPolygon[vertexIndex];
				ctx.lineTo(vertexOfPolygon[0]*(400/vertexOfPolygon[2])+canvas.width/2, vertexOfPolygon[1]*(400/vertexOfPolygon[2])+canvas.height/2);	
			}
			ctx.fillStyle = polygonOfPolygon[polygonOfPolygon.length-1];
			ctx.fill();
			ctx.stroke();
		}
	}
}

function movePlayerPosition(coordinate, value, amount) {
    let step = value/20;
    let index = 0;

    function animate() {
        if (index < 20) {
            polygons[5][0][coordinate] += step*amount;
			polygons[5][0][1] = -Math.abs(Math.sin(index/6)*2.5);
            index ++;
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function movePlayer(random) {
	if (playerPosition == 1 || playerPosition == 10) {
		movePlayerPosition(0, -5.35, random); return;
	} else if (playerPosition == 11 || playerPosition == 20) {
		movePlayerPosition(2, 5.35, random); return;
	} else if (playerPosition == 21 || playerPosition == 30) {
		movePlayerPosition(0, 5.35, random); return;
	} else if (playerPosition == 40 || playerPosition == 31) {
		movePlayerPosition(2, -5.35, random); return;
	}

	if (playerPosition < 11 && playerPosition > 1) {
		movePlayerPosition(0, -4.2, random); return;
	} else if (playerPosition < 20 && playerPosition > 10) {
		movePlayerPosition(2, 4.2, random); return;
	} else if (playerPosition < 30 && playerPosition > 20) {
		movePlayerPosition(0, 4.2, random); return;
	} else if (playerPosition < 40 && playerPosition > 30) {
		movePlayerPosition(2, -4.2, random); return;
	}
}

function rollDice(one) {
	let random = Math.floor(Math.random()*7+1);
	if (one) {
		random = 1;
	}

	for (random; random > 0; random --) {
		if (playerPosition+1 > 40) {playerPosition = 1;} else {playerPosition ++;}
		if (playerPosition == 39) {playerMoney += 200;}
		movePlayer(1);
	}

	movePlayer(random);
}

function feature(argument) {
	if (argument == "askew") {
		rotation.y = -Math.PI/6;
		rotation.x = 0;
		rotation.spin = false;
		document.getElementById("spin").checked = false;
	} else if (argument == "topdown") {
		rotation.y = -Math.PI/2;
		rotation.x = 0;
		rotation.spin = false;
		document.getElementById("spin").checked = false;
	} else if (argument == "spin") {
		rotation.spin = !rotation.spin;
	} else {
		rotation.y = -Math.PI/2;
		rotation.x = 0;
		rotation.spin = false;
		document.getElementById("spin").checked = false;
	}
}

const sprite = new Image();
sprite.src = "favicon.png";

function all() {
	calculatePolygons(); drawAll(); 

	document.getElementById("money").innerHTML = playerMoney;

	let street = null;

	if (playerPosition == 0) {
		street = ["Go", null, null, null, null, null, null, null, null, null, "#ffffff"];
	} else {
		for (let index = 0; index < streets.length; index ++) {
			for (let streetIndex = 0; streetIndex < 10; streetIndex ++) {
				if (index*10+streetIndex+1 == playerPosition) {
					street = streets[index][streetIndex];
				}
			}
		}
	}
	
	/*
	displaying current street name and data
	document.getElementById("streetName").innerHTML = street[0];
	document.getElementById("header").style.backgroundColor = street[street.length-1];

	document.getElementById("rent").innerHTML = "£"+(street[1] == undefined?0:street[1]);
	document.getElementById("setRent").innerHTML = "£"+(street[2] == undefined?0:street[2]);
	document.getElementById("1HRent").innerHTML = "£"+(street[3] == undefined?0:street[3]);
	document.getElementById("2HRent").innerHTML = "£"+(street[4] == undefined?0:street[4]);
	document.getElementById("3HRent").innerHTML = "£"+(street[5] == undefined?0:street[5]);
	document.getElementById("4HRent").innerHTML = "£"+(street[6] == undefined?0:street[6]);
	document.getElementById("anHRent").innerHTML = "£"+(street[7] == undefined?0:street[7]);

	document.getElementById("hCost").innerHTML = "£"+(street[8] == undefined?0:street[8]);
	document.getElementById("anHCost").innerHTML = "£"+(street[9] == undefined?0:street[9]);
	*/

	document.getElementById("currentLocation").innerHTML = `FYI:<br>Current Position: <div style="background-color: ${street[street.length-1]};">`+street[0];
	if (street[10] != null || street[10] != undefined) {
		if (street[10].toString().substring(0, 1) != "#") {
			document.getElementById("currentLocation").innerHTML += "<br>Cost: £"+street[10];

			document.getElementById("currentLocation").innerHTML += `<br><div style="border: 1px solid black; width: 150px; padding: 3px; margin: 3px;"><div style="background-color: ${street[street.length-1]}; width: 150px; text-align: center;"><div style="font-size: 11px;">TITLE DEED</div><br>${street[0]}</div><br>Rent: £${street[1]}<br>With Colour Set: £${street[2]}<br>1 House: £${street[3]}<br>2 Houses: £${street[4]}<br>3 Houses: £${street[5]}<br>4 Houses: £${street[6]}<br>An Hotel: £${street[7]}<hr>House Cost: £${street[8]}<br>Hotel Cost: £${street[9]}<br></div>`;
		}
	}
}

function buy(item) {
	let street = null;
	for (let index = 0; index < streets.length; index ++) {
		for (let streetIndex = 0; streetIndex < 10; streetIndex ++) {
			if (index*10+streetIndex+1 == playerPosition) {
				street = streets[index][streetIndex];
			}
		}
	}
	if (item == "street" && playerStreets.includes(street[0]) == false && !([2, 4, 7, 10, 17, 20, 22, 30, 33, 36, 38]).includes(playerPosition) && playerMoney >= street[10]) {
		document.getElementById("streetInventory").innerHTML += `<div style="border: 1px solid black; width: 150px; padding: 3px; margin: 3px;"><div style="background-color: ${street[street.length-1]}; width: 150px; text-align: center;"><div style="font-size: 11px;">TITLE DEED</div><br>${street[0]}</div><br>Rent: £${street[1]}<br>With Colour Set: £${street[2]}<br>1 House: £${street[3]}<br>2 Houses: £${street[4]}<br>3 Houses: £${street[5]}<br>4 Houses: £${street[6]}<br>An Hotel: £${street[7]}<hr>House Cost: £${street[8]}<br>Hotel Cost: £${street[9]}<br></div>`;
		playerMoney -= street[10];
		playerStreets.push(street[0]);
		playerStreets.push(0);
		document.getElementById("streets").innerHTML = playerStreets.length/2+" : ";
		for (let index = 0; index < playerStreets.length; index += 2) {
            document.getElementById("streets").innerHTML += playerStreets[index]+", ";
        }
	} else if (item == "house") {
		if (playerStreets.includes(street[0])) {
			if (isNaN(playerStreets[playerStreets.indexOf(street[0])+1])) {
				playerStreets[playerStreets.indexOf(street[0])+1] = 1;
				playerMoney -= street[10]; 
			} else {
				if (playerStreets[playerStreets.indexOf(street[0])+1] < 4) {
					playerStreets[playerStreets.indexOf(street[0])+1] ++;
					playerMoney -= street[10]; 
				}
			}
		}
		console.log(playerStreets);

		polygons.push([[...polygons[5][0]], playerStreets[playerStreets.indexOf(street[0])+1]]);
	}
}

sprite.addEventListener("load", () => {
	setInterval(function() { all() }, 1000/60);
});
