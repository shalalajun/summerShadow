import * as THREE from 'three';
import Project from '../../Project';
import { checkHash } from '../../utils/utils';
import Cat from './Cat';

export default class MyCat extends Cat {

    constructor(gltf){
        super(gltf);
        
        this.isMyCat = true;

        //이동관련 변수
        this.moveSpeed = 3;
        this.desiredDirection = new THREE.Vector3();
        this.vector = new THREE.Vector3();  //계산시 사용할 임시변수 
        this.prevPosition = new THREE.Vector3();
        this.rotationSpeed = 10;
        this.isMove = false;
        //이동 시작시 캐릭터의 뷰포트 포지션을 저장
        this.viewportOffsetY = 0;

        this.targetPosition = new THREE.Vector3();

        //
        if(checkHash('#pc')){
            this._initDebugGUI();
            this._initDirectionHelper();
        }
    }

    _initModel(project){
        super._initModel(project);

        //랜덤하게 텍스처 선택
        this.characterIdx = Math.floor(Math.random() * this.texList.length);
        this.setTexture(this.characterIdx);
    }

    _initDirectionHelper(){
        
        //forward
        const dir = new THREE.Vector3(0, 0, 1);
        dir.normalize();
        const origin = new THREE.Vector3(0, 1, 0);
        const length = 3;
        let hex = 0xff0000;

        const forwardArrow = new THREE.ArrowHelper(dir, origin, length, hex);
        this.model.add(forwardArrow);

        //desired direction
        hex = 0x0000ff;

        this.directionHelper = new THREE.ArrowHelper(this.desiredDirection, origin, length, hex);
        this.model.add(this.directionHelper);
    }

    _initDebugGUI(){
        
        const project = Project.getInst();

        if(project.debug.active) {

            const folder = project.debug.ui.addFolder('Player Cat');
                
            const debugObject = {
                playIdle: () => { this.play('idle') },
                playWalking: () => { this.play('walk') },
                playRunning: () => { this.play('run') },
                playIdle4: () => { this.play('idle_quad')},
                playBread: () => { this.play('breadpose')},
            };

            // folder.add(debugObject, 'playIdle');
            // folder.add(debugObject, 'playWalking');
            // folder.add(debugObject, 'playRunning');
            // folder.add(debugObject, 'playIdle4');
            //folder.add(debugObject, 'playBread');

            folder.add(this, 'moveSpeed').min(1).max(10).step(0.001);
            folder.add(this, 'rotationSpeed').min(0).max(20).step(0.001);
        }
    }

    
    onMoveStart(viewport, camera){
        this.play('walk');
        this.isMove = true;
        
        if(this.box){
            this.box.visible = true;
        }

        //다운시 캐릭터 뷰포트 위치계산
        //TODO 캐릭터 위치가 고정이라면 매번 계산할 필요 없는데 지금은 필요
        this.model.getWorldPosition(this.vector);
        this.vector.project(camera);
        this.viewportOffsetY = this.vector.y;
    }

    onMoveStop(){
        this.play('idle');
        this.isMove = false;

        if(this.box){
            this.box.visible = false;
        }
    }

    /**
     * 캐릭터를 viewport를 참고하여 이동
     *      캐릭터는 직선으로만 이동
     *      카메라의 forward 방향을 기준으로 viewport 의 방향을 반영한 후 이 회전 목표 방향을 향해 매 프레임 회전
     * @param {THREE.Vector2} viewport 화면 전체의 중심을 기준으로 상하좌우로 -1~1 사이의 값을 가짐(left:-1, botom:-1)
     */
    move(viewport){

        const {camera} = Project.getInst().core;
        const {deltaScalar} = Project.getInst().time;
        const {vector, model, targetPosition, moveSpeed, rotationSpeed} = this;

        let distance = 1;

        //카메라 정면 각도를 구함 - 영점으로 사용
        vector.copy(model.position);
        vector.x -= camera.position.x;
        vector.z -= camera.position.z;
        vector.normalize();

        const baseRadian = Math.atan2(-vector.z, vector.x);

        //카메라 정면 방향에 박스 배치 - 확인용
        if(this.box){
            const radian = Math.atan2(vector.z, -vector.x);
            const distance = 5;
            this.box.position.copy(model.position);
            this.box.position.x += -distance * Math.cos(radian);
            this.box.position.y = 0;
            this.box.position.z += distance * Math.sin(radian);
        }

        //viewport를 direction으로 변환
        vector.set(viewport.x, 0, viewport.y);
        vector.z -= this.viewportOffsetY;
        vector.normalize();

        const joysticRadian = Math.atan2(vector.z, vector.x);

        //최종각도
        const finalRadian = baseRadian + joysticRadian;

        //최종 각도를 통해 가려는 위치를 계산
        distance = 3;
        targetPosition.copy(model.position);
        targetPosition.x += -distance * Math.cos(finalRadian + (Math.PI * 0.5));
        targetPosition.z += distance * Math.sin(finalRadian + (Math.PI * 0.5));

        //회전
        let rotateRadian = this._wrapAngle(finalRadian - model.rotation.y);
        model.rotation.y += rotateRadian * deltaScalar * rotationSpeed;

        //한 프레임 전방으로 전진
        vector.set(0, 0, 1);

        this.prevPosition.copy(model.position);
        model.translateOnAxis(vector, deltaScalar * moveSpeed);
        
        //캡슐에 적용
        vector.copy(model.position).sub(this.prevPosition);
        this.capsule.translate(vector);
    }

    _wrapAngle(radian){
        
        if(radian < -Math.PI){
            radian += Math.PI * 2;
        }else if(radian > Math.PI){
            radian -= Math.PI * 2;
        }
        return radian;
    }

    onUpdate(time){
        super.onUpdate(time); 

        if(this.directionHelper){

            this.vector.copy(this.targetPosition).sub(this.model.position).normalize();
            //방향을 로컬 좌표계로 변환
            this.vector.applyQuaternion(this.model.quaternion.clone().invert());
            this.directionHelper?.setDirection(this.vector);
        }
    }


    createDebugMesh(){

        if(checkHash('#pc')){
            //테스트용 박스 - 카메라의 정면 체크용
            this.box = new THREE.Mesh(
                new THREE.BoxGeometry(1,1,1),
                new THREE.MeshStandardMaterial({color:new THREE.Color('blue')})
            );
            Project.getInst().add(this.box);
        }
    }
}