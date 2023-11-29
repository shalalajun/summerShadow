import * as THREE from 'three';
import Project from '../Project';
import { checkHash } from '../utils/utils';

export default class FollowCamera {

    constructor(target, followObject){

        this.target = target;
        this.followObject = followObject;

        this.options = {
            distance:14,        //카메라와 타겟오브젝트의 거리. x,z축 계산시 사용
            rotationSpeed:1,    //타겟 주변을 회전하는 속도. 높을수록 빠르게 타겟의 뒤로 돌아가는 힘이 강함.
            lookOffset: 0,
            smoothY:{
                enabled:true,
                force:0.1,  
            },
            offsetY:followObject.position.y - target.position.y,  //카메라와 타겟 오브젝트의 y축 간격
        }

        //계산시 사용할 변수
        this.v = new THREE.Vector3();
        this.targetForward = new THREE.Vector3();

        //
        if(checkHash('#followCam')){

            window.addEventListener('wheel', e => {
                this.options.distance += e.deltaY * 0.01;
                this.options.distance = THREE.MathUtils.clamp(this.options.distance, 2, 100);
                this.debugFolder.userData.distance.updateDisplay();
            }, true);

            this._initDebugGUI();
        }
    }

    onUpdate({deltaScalar}){

        const {v, targetForward, target, followObject} = this;
        const {distance, rotationSpeed, lookOffset, offsetY, smoothY} = this.options;
        
        if(true){

            //타겟(캐릭터)의 월드기준 backward 방향 벡터로 월드각도를 구함
            target.getWorldDirection(targetForward);
            targetForward.negate();

            const targetBackwardRadian = Math.atan2(targetForward.z, targetForward.x);
            
            //타겟(캐릭터) 기준 followObject로의 방향벡터로 각도 구하기
            v.copy(followObject.position).sub(target.position);
            v.y = 0;
            v.normalize();

            const taretToCameraRadian = Math.atan2(v.z, v.x);

            //카메라 위치 반영
            let gap = this._wrapAngle(targetBackwardRadian - taretToCameraRadian); 
            
            //내적을 두 벡터가 나란히 있을때와 직교할떄에 때라 -1~1 사이의 값을 가진다
            //옆에서 볼떄는 회전하지만 정면이나 뒤에서는 회전이 느리도록 곱해준다
            followObject.getWorldDirection(v);
            let multiplier = targetForward.dot(v);
            
            let newAngle = taretToCameraRadian + (gap * deltaScalar * rotationSpeed * (1-Math.abs(multiplier)));

            followObject.position.x = target.position.x;
            followObject.position.z = target.position.z;

            followObject.position.x += distance * Math.cos(newAngle);            
            followObject.position.z += distance * Math.sin(newAngle);

            //
            if(smoothY.enabled){
                followObject.position.y += ((target.position.y + offsetY) - this.followObject.position.y) * smoothY.force;
                                //console.log(followObject.position.y)
            }else{
                followObject.position.y = target.position.y + offsetY;
            }
        }

        //TODO 카메라 둥실 효과를 여기서 offset x, y 값을 조정하면 어떨까?


        //쳐다보기
        v.copy(target.position);
        v.y += lookOffset;
        followObject.lookAt(v);
    }

    _wrapAngle(radian){
        
        if(radian < -Math.PI){
            radian += Math.PI * 2;
        }else if(radian > Math.PI){
            radian -= Math.PI * 2;
        }
        return radian;
    }

    _initDebugGUI(){

        this.debugFolder = Project.getInst().debug.ui.addFolder('Follow Camera');

        const distanceGUI = this.debugFolder.add(this.options, 'distance').min(1).max(100).step(0.01);
        this.debugFolder.add(this.options, 'rotationSpeed').min(0.01).max(10).step(0.01);
        this.debugFolder.add(this.options, 'lookOffset').min(-10).max(20).step(0.01);
        this.debugFolder.add(this.options, 'offsetY').min(0).max(30).step(0.01);

        this.debugFolder.userData = {
            [distanceGUI.property]:distanceGUI
        };

        const folder = this.debugFolder.addFolder('smoothY');
        folder.add(this.options.smoothY, 'enabled').name('SmoothY On');
        folder.add(this.options.smoothY, 'force').min(0.001).max(1).step(0.001);
    }
}