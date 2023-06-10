import './style.css'
import { Land } from './land.js';
import { BalloonClass } from './balloon.js';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

const textureLoader = new THREE.TextureLoader()
const skyTexture = textureLoader.load("/texture/sky.jpg")
const gui = new dat.GUI({
    // closed: true,
    width: 400
})
var land = new Land()




const fontLoader = new THREE.FontLoader()
var text ;
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        var textGeometry = new THREE.TextGeometry( 'Air Balloon launching Simulation', {
            font:font,
            size: 1,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 0.1
        });
        textGeometry.center()
        const textMaterial = new THREE.MeshNormalMaterial()
        text = new THREE.Mesh(textGeometry,textMaterial)
        text.name = 'startText'
        scene.add(text)
        
    }
)

scene.background = skyTexture;


land.drawIntro(scene);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)

camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    logarithmicDepthBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug
 */


var balloonClassObject = new BalloonClass()

balloonClassObject.balloonFolder(gui)

/**
 * Animatex
 */

const tick = () =>
{
    // Update controls
    controls.update();
    if(balloonClassObject.balloon!=null)
    {
        if(balloonClassObject.launch){
            balloonClassObject.verticalMovement();
        }
    }
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if(e.keyCode == '13')
    {
        camera.rotation.x = Math.PI / 1.5;
        camera.rotation.y = Math.PI / 1;
        gsap.to(camera.position,{z:-100,duration:1.5})
        land.removeIntro(scene)
        balloonClassObject.launch = true ;
    }
}

var mouse = new THREE.Vector2(0, 0)
window.addEventListener('mousemove', (ev) => {
    mouse.set((ev.clientX / window.innerWidth) * 2 - 1,
    -(ev.clientY / window.innerHeight) * 2 + 1,)
    gsap.to(text.position, { duration: 2, x: -mouse.y ,y :mouse.x * (Math.PI)});
})


land.drawLand(scene,gui);

balloonClassObject.load3DObject(scene,balloonClassObject)

addLight()
function addLight(){
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
}