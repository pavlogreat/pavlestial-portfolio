import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

const COUNT = 10000;
const geometry = new THREE.BufferGeometry();
const offsets = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT * 3; i++) {
    offsets[i] = (Math.random() - 0.5) * 4.0;
}
geometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 3));

const vertexShader = `
    uniform float time;
    uniform vec3 paramsA;
    uniform vec3 paramsB;
    uniform float morph;
    attribute vec3 offset;

    vec3 pattern(vec3 p, vec3 k) {
        p += vec3(
            sin(p.y * k.x + time),
            sin(p.z * k.y + time),
            sin(p.x * k.z + time)
        );
        return p;
    }

    void main() {
        vec3 pa = pattern(offset, paramsA);
        vec3 pb = pattern(offset, paramsB);
        vec3 pos = mix(pa, pb, morph);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 2.0;
    }
`;

const fragmentShader = `
    void main() {
        float d = length(gl_PointCoord - 0.5);
        if(d > 0.5) discard;
        gl_FragColor = vec4(1.0);
    }
`;

const patterns = [
    [new THREE.Vector3(1.2, 1.3, 1.1), new THREE.Vector3(2.0, 1.7, 2.3)],
    [new THREE.Vector3(0.8, 2.3, 1.5), new THREE.Vector3(1.5, 1.0, 2.5)],
    [new THREE.Vector3(1.4, 0.8, 2.1), new THREE.Vector3(2.2, 2.5, 0.7)]
];
let current = 0;
const uniforms = {
    time: { value: 0 },
    paramsA: { value: patterns[0][0].clone() },
    paramsB: { value: patterns[0][1].clone() },
    morph: { value: 0 }
};

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
composer.addPass(bloom);

window.addEventListener('click', () => {
    current = (current + 1) % patterns.length;
    uniforms.paramsA.value = patterns[current][0];
    uniforms.paramsB.value = patterns[current][1];
    uniforms.morph.value = 0;
});

function animate(ms) {
    uniforms.time.value = ms * 0.001;
    if (uniforms.morph.value < 1) {
        uniforms.morph.value += 0.01;
    }
    controls.update();
    composer.render();
    requestAnimationFrame(animate);
}

animate(0);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
