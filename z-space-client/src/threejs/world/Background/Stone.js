import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';

export default class Stone {

    constructor(octree){

        this.count = 100;
        this._initMesh();
        this._initTransform(octree);
    }

    _initMesh() {

        const project = Project.getInst();

        this.model = project.assetLoader.items.stone01
        this.stone = this.model.scene
        this.stoneMesh = this.stone.getObjectByName( 'Rock002' )
        
        this.stoneGeometry = this.stoneMesh.geometry.clone();        
        this.stoneMaterial = new StyleMaterial({color: '#747474', shadowColor: new THREE.Color(0.525,0.169,0.032)});

        this.instancedTree = new THREE.InstancedMesh(this.stoneGeometry, this.stoneMaterial, this.count );
        this.instancedTree.castShadow = true
        this.instancedTree.receiveShadow = true

        project.add(this.instancedTree);
    }


    _initTransform(octree){

        const ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));        
        const dummy = new THREE.Object3D();

        //꼼수로 억지로 메쉬인척 해서 octree 지형에 추가
        dummy.geometry = this.stoneGeometry;
        dummy.isMesh = true;

        for(let i=0; i<this.count; ++i) {

            //
            dummy.position.set(
                (Math.random() - 0.5) * 150,
                100,
                (Math.random() - 0.5) * 150,
            );
            
            dummy.scale.setScalar(0.5 + Math.random() * 0.8);
            dummy.rotation.y = Math.random() * 0.5 *  Math.PI;
                
            //octree로 raycast
            ray.origin.copy(dummy.position);
            const hit = octree.rayIntersect(ray);

            if(hit){
                dummy.position.y -= hit.distance;
            }

            //apply matrix
            dummy.updateMatrix();
            this.instancedTree.setMatrixAt(i, dummy.matrix);

            //
            octree.fromGraphNode(dummy);
        }
    }
}