const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / (container.clientHeight - 16),
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( container.clientWidth, container.clientHeight-16 );
container.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const texture = new THREE.TextureLoader().load("board.jpg");
const material = new THREE.MeshLambertMaterial({ map: texture });
// Or: const material = new THREE.MeshBasicMaterial({ map: texture });
texture.wrapS = THREE.RepeatWrapping; 
texture.wrapT = THREE.RepeatWrapping;
const geometry = new THREE.PlaneGeometry( 5, 5 );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

camera.position.z = 5;

// thanks https://jsfiddle.net/MadLittleMods/n6u6asza/
/*
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
container.addEventListener('mousedown', function(e) {
    isDragging = true;
})
container.addEventListener('mousemove', function(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {
            
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                (deltaMove.x * 1) * (Math.PI / 180), // No rotation around X
                (deltaMove.y * 1) * (Math.PI / 180), // Y axis
                0, // (deltaMove.y * 1) * (Math.PI / 180), // Z axis
                'XYZ'
            ));

        plane.quaternion.multiplyQuaternions(deltaRotationQuaternion, plane.quaternion);
    }
    
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});
*/

container.addEventListener('mouseup', function(e) {
    isDragging = false;
});

function animate() {
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
