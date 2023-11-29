import * as THREE from 'three';

/**
 * 초기화시 root object와 follower 오브젝트의 위치 차이를 저장 후
 * 매 프레임 같은 거리를 유지하도록 followObject의 포지션을 업데이트
 */
export default class SyncObjectPosition{

    constructor(targetObject, followObject){

        //따라갈 목표물체
        this.target = targetObject;
        //따라다니는 오브젝트
        this.follower = followObject;

        //
        this.interval = new THREE.Vector3();
        this.interval.copy(this.follower.position).sub(this.target.position);
    }

    onUpdate(time){
        this.follower.position.copy(this.target.position).add(this.interval);
    }
}