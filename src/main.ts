
import { Body } from './physics/body';
import { Simulation } from './physics/simulation';
import { Vector } from './physics/vector';
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.SphereGeometry(20, 12, 8);
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
// const sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 200, 600 );
controls.update();
controls.enableDamping = true

function animate() {
  for (let i = 0; i < 10; i++) {
    simulation.step(1/600);
  }
for ( const [body, mesh] of bodiesMap) {
  mesh.position.set(body.position.x, body.position.y, body.position.z)
}
  controls.update();
	renderer.render( scene, camera );
}


const cx = 0;
const cy = 0;
const cz = 0
const simulation = new Simulation();

const m = 2000000
const d = 200


const v = Math.sqrt((1 * m) / d)
simulation.addBody(new Body(new Vector(cx, cy, cz), new Vector(0, 0, 0), m))
simulation.addBody(new Body(new Vector(cx + d, cy, cz), new Vector(0, 0, v), 1))

const bodiesMap = new Map<Body, THREE.Mesh>();

for ( const body of simulation.bodies) {
  const geometry = new THREE.SphereGeometry(20, 12, 8);
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
  const sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  
  bodiesMap.set(body, sphere)
  
}

renderer.setAnimationLoop( animate );

// function loop() {
//   for (let i = 0; i < 10; i++) {
//     simulation.step(1/600);
//   }
//   render(ctx, simulation)
//   requestAnimationFrame(loop)
// }

// loop()