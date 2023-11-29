import * as THREE from 'three';
import Project from '../Project';
import { Sky } from 'three/examples/jsm/objects/Sky';

export default class CustomSky {
    
    constructor() {

        this.project = Project.getInst();
        this.assetLoader = this.project.assetLoader;

        this.setSky()
   
        //
        // this.setGeometry();
        // this.setTextures();
        // this.setMaterial();
        // this.setMesh();
    }

    setSky()
    {
        this.sky = new Sky();
        this.sun = new THREE.Vector3();
        this.sky.scale.setScalar( 450000 );
        this.elevation = 20
        this.azimuth = 64.7
        this.phi = THREE.MathUtils.degToRad( 90 -  this.elevation );
	    this.theta = THREE.MathUtils.degToRad( this.azimuth );

        this.sun.setFromSphericalCoords(1, this.phi, this.theta)

        this.sky.material.uniforms.sunPosition.value.copy(this.sun)


        //console.log(this.sky)
        
        
        this.sky.material.uniforms.turbidity.value = 0.8
        this.sky.material.uniforms.rayleigh.value =  10
        this.sky.material.uniforms.mieCoefficient.value = 0.56;
        this.sky.material.uniforms.mieDirectionalG.value = 1.0;
        // this.sky.material.uniforms.elevation.value = 2
        this.sky.exposure = 0.3
		
		this.project.add( this.sky );
    }

    setGeometry(){
        this.geometry = new THREE.SphereGeometry(50, 32, 16 ); 
    }

    setTextures(){
        this.texture =  this.assetLoader.pop('skyTexture');
        console.log(this.texture)
    }

    setMaterial(){
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            side:  THREE.BackSide
        });
    }

    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.project.add(this.mesh);
    }

}