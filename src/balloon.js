
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export class BalloonClass {
    constructor() {
        this.launch = false;
        this.densityAir = 1.225; // Density of air in kg/m^3
        this.densityAirAtSeaLevel = 1.225; // Density of air in kg/m^3
        this.densityGas = this.densityAir; // Density of gas in kg/m^3
        this.g = 9.81; // Acceleration due to gravity in m/s^2
        this.balloon = null;
        this.radius = 1.5; // Radius of the balloon in meters
        this.volume = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
        this.mass = 2; // Mass of the balloon
        this.liftForce = this.densityAir * this.volume * this.g - this.densityGas * this.volume * this. g; // Lift force
        this.gravityForce = this.mass * this.g; // Gravity force
        this.airPressure = 1013.25 ;
        this.v = 0 ;
        this.cd = 0.47 ;
        this.A = Math.PI * Math.pow(this.radius , 2);
        this.drag = 0 ;
        this.T = 0 ;
        this.enginForce = 0 ;
        this.teta = 0 ;
        this.temprature1 = 303.15;
        this.temprature2 = this.temprature1;
        this.deltaTime = 0.01; // Time step
        this.airSpeed = 0;
        this.resistanceX = 0;
        this.resistanceY = 0;
        this.resistanceZ = 0;
        this.speedX = 0 ;
        this.speedY = 0 ;
        this.speedZ = 0 ;
        this.alphe = Math.PI * 2;
        this.beta = Math.PI * 2;
        this.airForce = 0;
    }
    balloonFolder (gui){
        const BalloonFolder = gui.addFolder('Balloon Folder')
        BalloonFolder.add(this, 'radius', 1, 2)
        BalloonFolder.add(this, 'temprature2', 303, 1500)
        BalloonFolder.add(this, 'airSpeed', 0 , 10)
        BalloonFolder.add(this, 'alphe', 0, (Math.PI * 2))
        BalloonFolder.add(this, 'beta', 0, (Math.PI * 2))
    }
    verticalMovement(){

        this.airForce = 1/2  * 0.47 * this.densityAir * this.A * Math.pow(this.airSpeed,2)
        console.log("airForce : " + this.airForce )

        this.A = Math.PI * Math.pow(this.radius , 2);
        this.volume = (4 / 3) * Math.PI * Math.pow(this.radius, 3)
        this.densityGas = this.densityAirAtSeaLevel * this.temprature1 / this.temprature2
        this.liftForce = this.densityAir * this.volume * this.g - this.densityGas * this.volume * this. g; // Lift force
        
        this.airResistance()

        console.log("resistanceX : " + this.resistanceX)
        console.log("resistanceY : " + this.resistanceY)
        console.log("resistanceZ : " + this.resistanceZ)

        console.log("liftForce : " + this.liftForce)

        var Fx = this.resistanceX * Math.cos(this.alphe) + this.airForce * Math.cos(this.alphe);
        var Fy = this.resistanceY * Math.sin(this.alphe) * Math.cos(this.beta) + this.airForce * Math.sin(this.alphe) * Math.cos(this.beta);
        var Fz = this.liftForce - this.gravityForce - this.resistanceZ * Math.sin(this.beta) - this.airForce * Math.sin(this.beta);
        if(this.balloon.position.y <= -10 && Fz < 0){
            Fz = 0 ;
        }

        console.log("Fx : " + Fx)
        console.log("Fy : " + Fy)
        console.log("Fz : " + Fz)

        var accelerationX = Fx / this.mass ;
        var accelerationY = Fy / this.mass ;
        var accelerationZ = Fz / this.mass ;

        this.speedX = accelerationX * this.deltaTime ;
        this.speedY = accelerationY * this.deltaTime ;
        this.speedZ = accelerationZ * this.deltaTime ;

        var displacementX = 1/2 * this.speedX ; // Change in position
        var displacementY = 1/2 * this.speedY ; // Change in position
        var displacementZ = 1/2 * this.speedZ ; // Change in position

        console.log("displacementX : " + displacementX)
        console.log("displacementY : " + displacementY)
        console.log("displacementZ : " + displacementZ)

        this.balloon.position.y = this.balloon.position.y + displacementZ;    
        this.balloon.position.x = this.balloon.position.x + displacementX;    
        this.balloon.position.z = this.balloon.position.z + displacementY;   

        this.densityAir =( 1.225 * Math.pow(1 - (0.0065 * this.balloon.position.y / 288.15),(9.8 * 0.02896) / (8.314 * 0.0065)))
    }
    airResistance(){
        console.log("speedX : " + this.speedX)
        console.log("speedY : " + this.speedY)
        console.log("speedZ : " + this.speedZ)

        this.resistanceX = -1/2 * 0.47 * this.densityAir * this.A * Math.pow(this.speedX,2) * Math.cos(this.alphe);
        this.resistanceY = -1/2 * 0.47 * this.densityAir * this.A * Math.pow(this.speedY,2) * Math.cos(this.beta);
        this.resistanceZ = -1/2 * 0.47 * this.densityAir * this.A * Math.pow(this.speedZ,2) * Math.sin(this.alphe) * Math.sin(this.beta);

    }
    load3DObject(scene,ob){
        var mtlLoader = new MTLLoader();
        mtlLoader.load('models/baloon/balloon.mtl', function (materials) {
    
        // Create an OBJLoader and assign the loaded materials
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        // Load the .obj file
        objLoader.load(
            // resource URL
            'models/baloon/balloon.obj',
            
            // called when resource is loaded
            function ( object ) {
                object.rotation.z = 2 * Math.PI 
                object.rotation.y = Math.PI /2
                object.position.y = -10
                object.position.z += 30
                object.scale.set(1,1,1);
                ob.balloon = object
                scene.add( ob.balloon );
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
                console.log(error);
            }
        );
        }, function(x){
            console.log(( x.loaded / x.total * 100 ));
        });
    
    }
  }