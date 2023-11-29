import * as THREE from 'three';
import Project from '../../Project';
import grassVert from '../../shaders/grassShader/grassVert.glsl'
import grassFrag from '../../shaders/grassShader/grassFrag.glsl'
import { Time } from '../../core';
import GrassMaterial from '../../materials/GrassMaterial/GrassMaterial.js'
import GrassDepthMaterial from '../../materials/GrassMaterial/GrassDepthMaterial.js'

export default class Grass {

    constructor() {

        //console.log(this.time)
        this.instanceNumber = 250
        this.uniforms = {
            time: {
              value: 0
          }
        }

        this._initModel()
    }

    _initModel() {

        const project = Project.getInst()

        //인스턴스를 배치할 오브젝트
        this.dummy = new THREE.Object3D();

        this.model = project.assetLoader.items.grass
        this.grass = this.model.scene
        this.grassMesh = this.grass.getObjectByName( 'Grass' )
        //this.grassMesh.customDepthMaterial = new GrassDepthMaterial();
        //\this.grassMesh.doubleSided = true;
        //BufferGeometry
        this.grassGeometry = this.grassMesh.geometry.clone()



        //인스턴스지오메트리 테스트
        
 
        // this.grassMaterial = new THREE.ShaderMaterial({
        //     uniforms: this.uniforms,
        //     vertexShader: grassVert,
        //     fragmentShader: grassFrag
        // })



        this.grassMaterial = new GrassMaterial({color: 0xffffff})
       // this.grassMaterial = new THREE.MeshLambertMaterial({color: 0xffffff})



        this.grass.traverse((child)=>
        {
            if(child instanceof THREE.Mesh )
            {       
                child.material = this.grassMaterial
                child.material.side = THREE.DoubleSide
                child.castShadow = true
                child.receiveShadow = true
            }
        })

     
    
        // grassMesh.castShadow = true;



       this.instancedGrass = new THREE.InstancedMesh(this.grassGeometry, this.grassMaterial, this.instanceNumber );
       //this.instancedGrass.DoubleSide = true
       //this.instancedGrass.castShadow = true
       this.instancedGrass.receiveShadow = true
        project.add(this.instancedGrass)


        for ( let i=0 ; i < this.instanceNumber ; i++ ) {

          this.dummy.position.set(( Math.random() - 0.5 ) * 80, 0, ( Math.random() - 0.5 ) * 80 );
          this.dummy.rotation.y = 10;
          if(this.dummy.position.x < 0.8 && this.dummy.position.x > -0.8 && this.dummy.position.z < 0.8 && this.dummy.position.z > -0.8)
          {
            this.dummy.scale.setScalar( 0.5 + Math.random() * 0.3 );
            
          }else{
            this.dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
          }
          
        
          
          //this. dummy.rotation.y = Math.random() * Math.PI / 4;
          
          this.dummy.updateMatrix();
          this.instancedGrass.setMatrixAt( i, this.dummy.matrix );
        
        }
    }

    onUpdate(time) {
        
        const {elapsed} = time;
       //console.log(elapsed)
        this.grassMaterial.uniforms.time.value = elapsed * 0.001;
        this.grassMaterial.uniformsNeedUpdate = true;
    }
}
