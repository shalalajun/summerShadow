import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';

export default class SummerShadow {
    
    constructor() {

        this.project = Project.getInst();
        this.assetLoader = this.project.assetLoader;
        //
        this._initModel();
        // this.setGeometry();
        // this.setMaterial();
        // this.setMesh();
    }

    _initModel(){

       
     
        // this.resource = this.assetLoader.items.ground;
        // this.model = this.resource.scene;
        // this.model.name = 'Floor';
        // this.mesh = this.model.children.find(i => i instanceof THREE.Mesh);
        // this.tex = this.assetLoader.items.groundTex;
        // this.tex.flipY = false
        // this.material = new StyleMaterial({map: this.tex})
        // this.model.traverse((child) => {

        //     if(child instanceof THREE.Mesh){
        //         child.material = this.material;
        //         child.castShadow = true;
        //         child.receiveShadow = true;
        //     }
        // });
       
        // //this.model.position.set(0,-2,0);
        this.texture =  this.assetLoader.items.summerTex;
        this.texture.flipY = false
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set( 10, 10 );
        this.geometry = new THREE.PlaneGeometry(80,80)
        this.material = new THREE.MeshStandardMaterial({transparent: true, alphaTest: 0.5, alphaMap:this.texture, map:this.texture,side:THREE.DoubleSide})
        this.mesh = new THREE.Mesh(this.geometry,this.material)
        this.mesh.position.set(0,15,0)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
       // this.mesh2 = new THREE.Mesh(this.geometry,this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.project.add(this.mesh);
    }

    setGeometry(){
      //  this.geometry = new THREE.CircleGeometry(150, 32);
       
    }
    
    setMaterial(){

      
       // this.material = new StyleMaterial({color:'#a4ba0c', shadowColor: new THREE.Color(0.525,0.169,0.032)})//#a4ba0c
    }

    setMesh(){
        // this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.mesh.rotation.x = - Math.PI * 0.5;
      
       
    }
}