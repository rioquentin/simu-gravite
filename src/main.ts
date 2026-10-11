
import { Body } from './physics/body';
import { Simulation } from './physics/simulation';
import { Vector } from './physics/vector';
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 300, 450 );
controls.update();
controls.enableDamping = true

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// Background stars, purely decorative
const starPositions = new Float32Array(1500 * 3);
for (let i = 0; i < starPositions.length; i++) {
  starPositions[i] = (Math.random() - 0.5) * 6000;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x888888, size: 2 })));

const cx = 0;
const cy = 0;
const cz = 0
const simulation = new Simulation();

const m = 2000000
const d = 200

// Circular orbit speed: v^2 / d = G * M / d^2  =>  v = sqrt(G * M / d)
const v = Math.sqrt((1 * m) / d)
simulation.addBody(new Body(new Vector(cx, cy, cz), new Vector(0, 0, 0), m))
simulation.addBody(new Body(new Vector(cx + d, cy, cz), new Vector(0, 0, v), 1))

const colors = [0xffb347, 0x4fc3f7, 0xef5350, 0x81c784];
const TRAIL_LENGTH = 400;

type BodyView = { mesh: THREE.Mesh, trail: THREE.Line, positions: Float32Array, count: number };
const bodiesMap = new Map<Body, BodyView>();

simulation.bodies.forEach((body, index) => {
  const color = colors[index % colors.length];

  // Radius grows with the cube root of the mass (volume ∝ mass), clamped so light bodies stay visible
  const radius = Math.max(6, Math.cbrt(body.mass) * 0.25);
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  // Fixed-size buffer: three.js cannot grow a BufferAttribute after creation
  const positions = new Float32Array(TRAIL_LENGTH * 3);
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  trailGeometry.setDrawRange(0, 0);
  const trail = new THREE.Line(
    trailGeometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })
  );
  scene.add( trail );

  bodiesMap.set(body, { mesh, trail, positions, count: 0 })
});

function animate() {
  for (let i = 0; i < 10; i++) {
    simulation.step(1/600);
  }
  for ( const [body, view] of bodiesMap) {
    view.mesh.position.set(body.position.x, body.position.y, body.position.z)

    // Drop the oldest point once the buffer is full, then append the current position
    if (view.count === TRAIL_LENGTH) {
      view.positions.copyWithin(0, 3);
      view.count--;
    }
    view.positions.set([body.position.x, body.position.y, body.position.z], view.count * 3);
    view.count++;
    view.trail.geometry.setDrawRange(0, view.count);
    view.trail.geometry.attributes.position.needsUpdate = true;
  }
  controls.update();
  renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
