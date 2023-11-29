import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';

export default class TreeInstance {

    constructor(octree) {     
        
        this.count = 40;
        this._initMesh();
        this._initTransform(octree);
    }

    _initMesh() {

        const project = Project.getInst();

        this.treeMap = project.assetLoader.items.treeTexture;
        this.treeMap.flipY = false;

        this.model = project.assetLoader.items.tree02;
        this.tree = this.model.scene;        
        this.treeMesh = this.tree.getObjectByName('SM_tree7');

        this.treeGeometry = this.treeMesh.geometry.clone();
        this.treeMaterial = new StyleMaterial({map:this.treeMap,  shadowColor: new THREE.Color(0.525,0.169,0.032)});

        this.instancedTree = new THREE.InstancedMesh(this.treeGeometry, this.treeMaterial, this.count);
        this.instancedTree.castShadow = true;
        // this.instancedTree.receiveShadow = true;
        project.add(this.instancedTree);
    }

    
    _initTransform(octree){

        const ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));        
        const dummy = new THREE.Object3D();

        //꼼수로 억지로 메쉬인척 해서 octree 지형에 추가
        dummy.geometry = new THREE.BoxGeometry(1.7, 8.5, 1.7);
        dummy.isMesh = true;

        for (let i=0 ; i<this.count ; ++i) {

            //
            dummy.position.set(
                (Math.random() - 0.5) * 150,
                100,
                (Math.random() - 0.5) * 150,
            );

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