import * as THREE from 'three';
import StyleMaterial from '../../materials/styleMaterial';
import Project from '../../Project';
import gsap from 'gsap';
import { EventEmitter } from '../../core';

//event : dead
export default class DummyItem extends EventEmitter{

    constructor(color){
        super();

        this.rotateSpeed = 0.3;
        //거리 판정시 사용할 거리값
        this.distanceSquared = Math.pow(1.5, 2);
        //
        this.isDead = false;

        //
        this._initModel(color);
    }

    _initModel(color){

        const geom = new THREE.OctahedronGeometry(1, 0);
        const mat = new StyleMaterial({
            color:color,
        });

        this.mesh = new THREE.Mesh(geom, mat);
        Project.getInst().add(this.mesh);
    }

    onUpdate(time, myCatPosition){

        this.mesh.rotateY(Math.PI * 2 * time.deltaScalar * this.rotateSpeed);
        this._checkDistance(myCatPosition);
    }

    _checkDistance(catPosition){

        if(this.isDead){
            return;
        }

        const x = catPosition.x - this.mesh.position.x;
        const z = catPosition.z - this.mesh.position.z;

        const distance = x * x + z * z;
        //const distance = this.mesh.position.distanceToSquared(catPosition);

        if(distance <= this.distanceSquared){

            this.isDead = true;
            this.trigger('dead', [this]);

            const params = {
                duration:0.8,
                //ease:'bounce.in',
                ease:'back.inOut',
                y:10,
                onComplete:() => {
                    this.dispose();
                }
            };

            gsap.to(this.mesh.position, params);
        }
        
    }

    dispose(){
        Project.getInst().remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.mesh = null;
    }
}