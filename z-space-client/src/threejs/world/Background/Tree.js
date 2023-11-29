import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';

export default class Tree {

    constructor(gltf) {        
        this.gltf = gltf
        this._initModel()
    }

    _initModel() {
        const project = Project.getInst()
        // this.model = project.assetLoader.items.tree01
        this.model = this.gltf.scene
        this.treeMap = project.assetLoader.items.treeTexture
        this.treeMap.flipY = false
    
        this.treeMaterial = new StyleMaterial(
            {
                map:this.treeMap,
                shadowColor: new THREE.Color(0.525,0.169,0.032)

            }
        )

        this.model.traverse((child)=>
        {
            if(child instanceof THREE.Mesh )
            {       
                child.material = this.treeMaterial
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        // for(const i=0; i<this.treeLength; i++)
        // {
        //     this.trees = this.tree[i]
        // }

      //  this.tree.position.set(2,0,5)

        project.add( this.model)
        //console.log(this.model)
    }
}