import * as THREE from 'three';
import Project from '../../Project';
import { checkHash } from '../../utils/utils';
import Cat from './Cat';

export default class MovableCat extends Cat {

    constructor(gltf){
        super(gltf);

        //이동관련 변수
        this.speed = 3;
        this.rotationLerp = 0.3;
        this.desiredPosition = new THREE.Vector3();
        this.desiredRotation = new THREE.Euler();
        this.isMove = false;
        //서버에서는 움직임이 멈췄지만 desiredPosition과 거리가 있는경우 위치보정
        this.allowRamainMovement = false;   

        //계산시 사용할 임시변수 
        this.vector = new THREE.Vector3();  
        this.euler = new THREE.Euler();
    }

    _initModel(project){
        super._initModel(project);
        
        const map = project.assetLoader.items.blackCatTex;
        map.flipY = false;
        this.material.setMap(map);
    }

    changeMoveState(newState){

        if(this.isMove == newState){
            return;
        }

        this.isMove = newState;

        if(newState){
            this.play('walk');
            this.allowRamainMovement = false;
        }else{
            //this.play('idle');
            this.allowRamainMovement = true;
        }
    }

    setDesiredPosition(x, y, z){
        this.desiredPosition.set(x,y,z);
        //this.model.lookAt(x,this.model.position.y,z);
    }

    setDesiredRotation(x, y, z){
        this.desiredRotation.set(x,y,z);
    }

    onUpdate(time){
        super.onUpdate(time);

        const {deltaScalar} = time;

        if(this.isMove || this.allowRamainMovement){

            const {vector, euler, model, 
                desiredPosition, desiredRotation, 
                speed, rotationLerp
            } = this;

            //update position
            vector.copy(desiredPosition).sub(model.position);
                
            if(vector.length() > 0.01){

                const newLength = this.speed * deltaScalar;

                if(vector.length() > newLength){
                    
                    vector.setLength(speed * deltaScalar);
                    model.position.add(vector);

                }else{
                    model.position.copy(desiredPosition);

                    if(this.allowRamainMovement){
                        this.allowRamainMovement = false;
                        this.play('idle');
                    }
                }

            }else{
                model.position.copy(desiredPosition);

                if(this.allowRamainMovement){
                    this.allowRamainMovement = false;
                    this.play('idle');
                }
            }

            //update rotation
            model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, desiredRotation.x, rotationLerp);
            model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, desiredRotation.y, rotationLerp);
            model.rotation.z = THREE.MathUtils.lerp(model.rotation.z, desiredRotation.z, rotationLerp);
        }
    }
}