import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';


export default class Apple {

    constructor(octree)
    {
        this.count = 5;
        this._initMesh();
        this._initTransform(octree);
    }

    _initMesh() {

        const project = Project.getInst();

        this.model = project.assetLoader.items.apple
        this.appleMap = project.assetLoader.items.appleTex
        this.appleMap.flipY = false

        this.apple = this.model.scene
        console.log(this.apple)
        this.appleMesh = this.apple.getObjectByName( 'AppleBox' )
        
        this.appleGeometry = this.appleMesh.geometry.clone();        
        this.appleMaterial = new StyleMaterial({map:this.appleMap, shadowColor: new THREE.Color(0.525,0.169,0.032)});

        this.instancedApple = new THREE.InstancedMesh(this.appleGeometry, this.appleMaterial, this.count );
        this.instancedApple.castShadow = true
        this.instancedApple.receiveShadow = true

        project.add(this.instancedApple);
    }


    _initTransform(octree){

        const ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));        
        const dummy = new THREE.Object3D();

        //꼼수로 억지로 메쉬인척 해서 octree 지형에 추가
        dummy.geometry = this.appleGeometry;
        dummy.isMesh = true;

        for(let i=0; i<this.count; ++i) {

            //
            dummy.position.set(
                (Math.random() - 0.5) * 10,
                100,
                (Math.random() - 0.5) * 10,
            );
            
         //   dummy.scale.setScalar(0.5 + Math.random() * 0.8);
            dummy.rotation.y = Math.random() * 0.5 *  Math.PI;
                
            //octree로 raycast
            ray.origin.copy(dummy.position);
            const hit = octree.rayIntersect(ray);

            if(hit){
                dummy.position.y -= hit.distance;
            }

            //apply matrix
            dummy.updateMatrix();
            this.instancedApple.setMatrixAt(i, dummy.matrix);

            //
            octree.fromGraphNode(dummy);
        }
    }

}