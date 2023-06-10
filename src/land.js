import * as THREE from 'three'

export class Land{

    drawLand(scene,gui){
        const textureLoader = new THREE.TextureLoader()
        var landTexture = textureLoader.load("/texture/grass.jpg");
        var geometry =  new THREE.PlaneGeometry( 1000, 1000 )
        const material = new THREE.MeshBasicMaterial({ map: landTexture ,side: THREE.DoubleSide} );
        var plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2;
        plane.position.y = -15
        plane.frustumCulled = false;
        scene.add(plane);
        const planeFolder = gui.addFolder('plane')
        planeFolder.add(material, "wireframe");
    }
    drawIntro(scene){
        
        for(var i = 0; i < 100 ; i++)
        {
            const material = new THREE.MeshNormalMaterial()
            material.flatShading = true 
            let rand = (Math.random() - 0.5) * 16
            const geometry = new THREE.SphereBufferGeometry(0.5, rand, 16)
            const mesh = new THREE.Mesh(geometry, material)
            let randx = (Math.random() - 0.5) * 20
            let randy = (Math.random() - 0.5) * 20
            let randz = (Math.random() - 0.5) * 20
            mesh.name = 'majd'
            mesh.position.set(randx,randy,randz) 

            scene.add(mesh)
            
        }
    }
    removeIntro(scene){
        setTimeout(()=>{
            for(var i = 0 ; i < 100 ; i++)
            {
                setTimeout(()=>{this.removeEntity(scene,'majd')},)
            }
            },1000)
            this.removeEntity(scene,'startText')
    }
    removeEntity(scene ,name) {
        var selectedObject = scene.getObjectByName(name);
        scene.remove( selectedObject );
    }
}
