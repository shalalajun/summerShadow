import * as THREE from 'three';
import Project from '../../Project';
import StyleMaterial from '../../materials/styleMaterial';
import { Capsule } from 'three/examples/jsm/math/Capsule';

/**
 * 고양이 모델링 오브젝트
 * Capsule 컴포넌트를 사용하므로 위치 이동시 model.position 값을 직접 변경하면 안됩니다.
 */
export default class Cat {

    constructor(gltf){
        
        this.texList = [
            'yellowCatTex', 
            'grayCatTex',
            'grayLineCatTex',
            'blackCatTex',
            'halfCatTex',
        ];

        this.gltf = gltf;
        this.model = null;  //_initModel();
        this.material = null;   //_initModel();
        this.mixer = null;  //_initAnimation();
        this.actions = {};  //_initAnimation();
        this.currentAction = null;

        this.physics = {
            ray:new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(0, -1, 0)),
            offsetY:0.3
        };

        this.v = new THREE.Vector3();

        const project = Project.getInst();
        this._initModel(project);
        this._initAnimation();
        this._initCapsule();
    }

    
    _initModel(project){

        this.model = this.gltf.scene;

        const map =  project.assetLoader.items.blackCatTex;
        map.flipY = false;

        const mat = new StyleMaterial({
            color:'#ffffff', 
            //map: map, 
            shadowColor: new THREE.Color(0.525,0.169,0.032)
        });

        project.add(this.model);

        this.model.traverse((child) => {

            if(child instanceof THREE.Mesh){
                child.material = mat;
                child.castShadow = true;

                if(child.name === 'face_type02'){
                    child.visible = false;
                }
            }
        });

        this.material = mat;
    }

    setTexture(idx){
        
        const texName = this.texList[idx];
        const map = Project.getInst().assetLoader.items[texName];
        map.flipY = false;

        this.material.setMap(map);
    }

    _initAnimation(){

        this.mixer = new THREE.AnimationMixer(this.model);
        this.actions = {};
        
        this.gltf.animations.forEach(clip => {
            
            const newClip = clip.clone();
            const action = this.mixer.clipAction(newClip);

            action.name = clip.name;
            this.actions[newClip.name] = action;
        });

        this.play('idle');
    }

    _initCapsule(){

        //
        const box = (new THREE.Box3).setFromObject(this.model);
        const length = box.max.y - box.min.y;
        const radius = box.max.x;   //한쪽변의 길이만 사용해도 무방

        this.capsule = new Capsule(
            new THREE.Vector3(0, box.min.y + radius + this.physics.offsetY, 0),
            new THREE.Vector3(0, box.max.y - radius + this.physics.offsetY, 0),
            radius,
        );

        const center = this.capsule.getCenter(new THREE.Vector3());
        this.capsuleCenterY = center.y;
        
        //시각화 캡슐
        // const wireCapsule = new THREE.Mesh(
        //     new THREE.CapsuleGeometry(radius, length - (radius*2)),
        //     new THREE.MeshBasicMaterial({
        //         color:new THREE.Color('orange'),
        //         //transparent:true, opacity:0.5,
        //         wireframe:true,
        //     })
        // );
        // this.model.add(wireCapsule);
        // wireCapsule.position.y = center.y - this.physics.offsetY;
    }

    
    /**
     * 애니메이션 실행
     * @param {*} actionName 
     */
    play(actionName){

        if(this.currentAction?.name === actionName){
            return;
        }

        const newAction = this.actions[actionName];

        if(!newAction){
            console.warn(`model has no action. [${actionName}`);
            return;
        }

        newAction.reset();
        newAction.play();

        if(this.currentAction){
            newAction.crossFadeFrom(this.currentAction, 0.25);
        }        

        this.currentAction = newAction;
    }

    setPosition(x, y, z){
        this.model.position.set(x, y, z);
    }

    setRotation(x, y, z){
        this.model.rotation.set(x, y, z);
    }

    //이동시키기
    translate(x, y, z){

        this.v.set(x,y,z);
        this.capsule.translate(this.v);

        this.model.position.set(
            this.capsule.start.x,
            this.capsule.start.y - this.capsule.radius,
            this.capsule.start.z
        );
    }

    onUpdate({deltaScalar}){

        //animation update
        this.mixer?.update(deltaScalar);
    }

    dispose(){
        
        const project = Project.getInst();
        project.remove(this.model);

        this.model.traverse(item => {
            
            if(item instanceof THREE.Mesh){
                item.geometry.dispose();
                item.material.dispose();
                //텍스처는 공용사용하므로 안함
            }
        });

        this.gltf = null;
        this.model = null;
        this.material = null;
        this.mixer = null;
        this.actions = null;
        this.currentAction = null;
    }


    /**
     * 충돌체크
     */
    updatePhysics(octree, gravityDelta){
        
        const {capsule, capsuleCenterY, physics, model, v} = this;
        const result = octree.capsuleIntersect(capsule);
            
        if(result){
            
            if(result.depth > 0.01){
                v.copy(result.normal).normalize().multiplyScalar(result.depth);
                capsule.translate(v);
                //capsule.translate(result.normal.normalize().multiplyScalar(result.depth));
            }

        }else{

            physics.ray.origin.copy(model.position);
            physics.ray.origin.y += capsuleCenterY;
            const hit = octree.rayIntersect(physics.ray);

            if(hit && hit.distance > 0.02){
                v.set(0, -hit.distance + capsuleCenterY, 0);
                capsule.translate(v);
            }
        }

        //충돌이 반영된 위치를 모델에 반영
        this.model.position.set(
            capsule.start.x,
            capsule.start.y - capsule.radius,
            capsule.start.z
        );
    }
}