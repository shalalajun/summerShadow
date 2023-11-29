import * as THREE from 'three';
import Project from '../Project';

//캐릭터 이동 관련 테스트 코드
export default class CheckDirection{

    constructor(camera, target, inputObserver){
        this.camera = camera;
        this.target = target;

        this.v = new THREE.Vector3();

        this._initBox();
        this._initDebugGUI();

        this.target.rotateY(THREE.MathUtils.degToRad(45));

        //카메라 위치 및 환경 초기화
        //camera.position.set(0, 20, -1);   //topview
        camera.position.set(0, 2, -20);
        camera.lookAt(target.position);
        Project.getInst().core.initControls(true);

        //world axis helper
        const helper = new THREE.AxesHelper(5);
        Project.getInst().add(helper);

        //
        if(inputObserver){
            inputObserver.on('down', viewport => this.handleDown(viewport));
            inputObserver.on('press', viewport => this.handleMove(viewport));
            inputObserver.on('up', () => this.handleUp());
        }

        //this.target.position.set(3, 0, 5);
    }

    _initBox(){

        const mat = new THREE.MeshStandardMaterial({
            color:new THREE.Color('blue'),
        });

        const geom = new THREE.BoxGeometry(1,2,1);

        this.box = new THREE.Mesh(geom, mat);
        Project.getInst().add(this.box);

        this.box.position.z = 3;
    }

    _initDebugGUI(){

        const folder = Project.getInst().debug.ui.addFolder('CheckDirection');
     
        this.params = {

            degree:20,  //한번 클릭할때 움직이는 각도
            distance:3, //target으로부터 떨어진 거리
            rotateAroundBox:() => {
                this._boxRotateAround(this.params.degree, this.params.distance)
            },
            boxToInitialPosition:() => {
                const {box, target} = this;
                const radian = Math.PI * 0.5;
                box.position.set(target.position.x, box.position.y, target.position.z);
                box.position.x = -this.params.distance * Math.cos(radian);
                box.position.z = this.params.distance * Math.sin(radian);
            },
            rotateAroundBoxFw:() => {
                const targetRad = this._getWorldRadian(this.target);
                this._boxRotateAround(this.params.degree, this.params.distance, targetRad);
            },
            boxToInitialPositionFw:() => {

                //먼저 타겟의 회전각도를 구해야함
                const {box, target, v} = this;

                const targetRadian = this._getWorldRadian(target);
                
                const radian = targetRadian + Math.PI * 0.5;
                box.position.set(target.position.x, box.position.y, target.position.z);
                box.position.x = -this.params.distance * Math.cos(radian);
                box.position.z = this.params.distance * Math.sin(radian);
            },

            lockOrbitControl:false,
        }
     
        folder.add(this.params, 'degree').min(0).max(360).step(1);
        folder.add(this.params, 'distance').min(1).max(10).step(0.001);
        folder.add(this.params, 'rotateAroundBox');
        folder.add(this.params, 'boxToInitialPosition');
        folder.add(this.params, 'rotateAroundBoxFw').name('rotateAroundBox+FW');
        folder.add(this.params, 'boxToInitialPositionFw').name('boxToInitialPosition+FW');
        
        folder.add(this.params, 'lockOrbitControl').onChange((newValue) => {
            Project.getInst().core.orbit.enabled = !newValue;
        })
    }

    /**
     * target 의 월드 회전값을 radian으로 구해서 리턴
     */
    _getWorldRadian(obj){

        const {v} = this;

        obj.getWorldDirection(v);
        const radian = Math.atan2(v.z, v.x);
        
        return radian;
    }

    /**
     * 박스를 target 을 기준으로 반시계방향으로 회전
     * @param {*} degree  회전할 각도
     * @param {*} distance 타겟으로부터 얼마나 떨어져 있을지 거리
     * @param {*} offsetRadian 회전 오프셋. target이 회전해 있을 경우 값을 추가해줘서 영점을 정면으로 조정
     */
    _boxRotateAround(degree, distance, offsetRadian = 0){

        const {target, box, v} = this;

        console.log('=================================');
        console.log(`params : degree=${degree}, distance=${distance}, offsetRadian=${offsetRadian}`);
        
        //현재각도 구하기
        v.copy(box.position).sub(target.position);
        let initialRad = Math.atan2(v.z, -v.x);
        console.log('start position', box.position, 'angle', THREE.MathUtils.radToDeg(initialRad));

        //현재 각도에 이동할 각도를 더해서 최종 회전할 각도 radian 구하기
        const finalDegree = degree + THREE.MathUtils.radToDeg(initialRad);
        const radian = THREE.MathUtils.degToRad(finalDegree) + offsetRadian;
        console.log('rotate angle', finalDegree, 'distance', distance);

        //x, z 축에 계산결과 반영
        box.position.set(target.position.x, box.position.y, target.position.z);
        box.position.x = -distance * Math.cos(radian);
        box.position.z = distance * Math.sin(radian);
        console.log('result', box.position);

        //최종각도 계산해보기
        let resultRad = Math.atan2(box.position.z, box.position.x) - (Math.PI * 0.5);
        console.log('result angle ', THREE.MathUtils.radToDeg(resultRad));
    }

    /**
     * 박스를 타겟 위치 기준으로 degree 각도에 배치시킨다. 회전이 아님
     * @param {*} radian
     * @param {*} distance 
     */
    _setBoxAroundAngle(radian, distance){

        const {target, box, v} = this;

        //축을 12시 방향으로 변경
        radian += (Math.PI * 0.5);

        //x, z 축에 계산결과 반영
        box.position.set(target.position.x, box.position.y, target.position.z);
        console.log('init box pos', box.position);
        box.position.x += -distance * Math.cos(radian);
        box.position.z += distance * Math.sin(radian);
        console.log('result', box.position);

        //최종각도 계산해보기
        let resultRad = Math.atan2(box.position.z, box.position.x) - (Math.PI * 0.5);
        console.log('result angle ', THREE.MathUtils.radToDeg(resultRad));
    }

    handleDown(viewport){
        //console.log('handleDown', viewport);

        
    }

    handleMove(viewport){
        //console.log('handleMove', viewport);

        //#시도 1차 : 클릭위치 뷰포트를 방향으로 전환해서 타겟위치 주변에 배치시키기
        //this._test1_JoysticDirectionToWorldXZ(viewport);

        //#시도 2차 : 1차 + 타겟 오브젝트의 forward 방향을 기준으로 회전시키게 반영하기
        //this._test2_JoysticDirectionToWorldXZAndApplyTargetMatrix(viewport);

        //#시도 3차 : 카메라 forward 방향으로 일정거리 떨어진 위치에 박스 갖다놓기
        this._test3_BoxToCameraForwardPosition(viewport);

        //#시도 4차 : 카메라 forwaed 방향으로 하되, target 위치를 기준으로 박스 배치
        //this._test4_ApplyCameraForward_ToTargetPositionBase(viewport);
        
    }

    handleUp(viewport){
        //console.log('handleUp', viewport);
    }


    //#mingming 1차 : 클릭한 위치 뷰포트를 방향으로 전환해서 타겟위치 주변으로 회전시켜서 갖다놓기
    _test1_JoysticDirectionToWorldXZ(viewport){
        console.log('_test1_JoysticDirectionToWorldXZ');

        const {v} = this;        
                
        //일단 viewport 를 direction으로 변환
        v.set(viewport.x, 0, viewport.y);
        v.normalize();

        let radian = Math.atan2(v.z, v.x) - (Math.PI * 0.5);

        //wrap angle to -180 ~ 180 TODO 타겟의 각도에서 가까운쪽으로 계산해야 될수도 있겠다
        if(radian < -Math.PI){
            radian += Math.PI * 2;
        }else if(radian > Math.PI){
            radian -= Math.PI * 2;
        }

        const degree = THREE.MathUtils.radToDeg(radian);
        console.log('joystic degree', degree);

        this._setBoxAroundAngle(radian, this.params.distance);
    }

    onUpdate({deltaScalar}){

        //타겟 이동시키기(테스트)
        if(!this.testParam){
            this.testParam = {
                directionX:1,
                directionZ:1,
                movedX:0,
                movedZ:0,
            }
        }
        
        this.target.position.x += 0.05 * this.testParam.directionX;
        this.target.position.z += 0.05 * this.testParam.directionZ;
        this.testParam.movedX += 0.05 * this.testParam.directionX;
        this.testParam.movedZ += 0.05 * this.testParam.directionZ;

        if(Math.abs(this.testParam.movedX) > 1){
            this.testParam.directionX *= -1;
            this.testParam.movedX = 0;
        }

        if(Math.abs(this.testParam.movedZ) > 2){
            this.testParam.directionZ *= -1;
            this.testParam.movedZ = 0;
        }

        this.target.rotateY(0.01);
    }


    _test2_JoysticDirectionToWorldXZAndApplyTargetMatrix(viewport){
        console.log('_test2_JoysticDirectionToWorldXZAndApplyTargetMatrix');
        //#mingming 1차 : 클릭한 위치 뷰포트를 방향으로 전환해서 타겟의 정면을 기준으로 주변으로 회전시켜서 갖다놓기
        const {v} = this;        
        
        //일단 viewport 를 direction으로 변환
        v.set(viewport.x, 0, viewport.y);
        v.normalize();
        let radian = Math.atan2(v.z, v.x) - (Math.PI * 0.5)

        console.log('joystic degree', THREE.MathUtils.radToDeg(radian));

        //오브젝트의 정면 방향을 구해서 반영
        v.set(0,0,-1);
        this.target.getWorldDirection(v);
        let radian2 = Math.atan2(v.z, v.x);

        radian -= radian2 - (Math.PI * 0.5);
        console.log('target degree', THREE.MathUtils.radToDeg(radian2));

        const matrix = new THREE.Matrix4();
        matrix.makeRotationY(radian);
        v.set(0,0,-1).applyMatrix4(matrix);

        //wrap angle to -180 ~ 180 TODO 타겟의 각도에서 가까운쪽으로 계산해야 될수도 있겠다
        if(radian < -Math.PI){
            radian += Math.PI * 2;
        }else if(radian > Math.PI){
            radian -= Math.PI * 2;
        }

        this._setBoxAroundAngle(radian, this.params.distance);
    }

    _test3_BoxToCameraForwardPosition(viewport){
        console.log('_test3_BoxToCameraForwardPosition');

        const {v, camera,target, box} = this;        
                        
        //뷰포트를 카메라 정면 기준 방향으로 전환
        camera.getWorldDirection(v);
        let radian = Math.atan2(v.z, -v.x) - (Math.PI * 0.5)
        

        //각도비교
        v.copy(target.position);
        v.x -= camera.position.x;
        v.z -= camera.position.z;
        v.normalize();

        let radian2 = Math.atan2(v.z, -v.x)// - (Math.PI * 0.5);

        console.log('angle', 
            THREE.MathUtils.radToDeg(radian),
            THREE.MathUtils.radToDeg(radian2),
        );


        //박스를 카메라 포지션 기준으로 10만큼 떨어진곳에 배치
        const distance = 2;

        box.position.copy(target.position);
        box.position.x += -distance * Math.cos(radian2);
        box.position.y = 0;        
        box.position.z += distance * Math.sin(radian2);

        console.log(box.position);
    }

    //이거다!!!!!!!!!
    _test4_ApplyCameraForward_ToTargetPositionBase(viewport){
        console.log('_test4_ApplyCameraForward_ToTargetPositionBase');

        const {v, camera, target, box} = this;    

        //카메라 정면 각도를 구함 - 이 각도가 영점이 됨
        v.set(0, 0, -1);
        v.applyMatrix4(camera.matrixWorld);
        v.normalize();
        
        let baseRadian = Math.atan2(-v.z, v.x);

        //viewport 를 direction으로 변환
        v.set(viewport.x, 0, viewport.y);
        v.normalize();
        let joysticRadian = Math.atan2(-v.z, -v.x) + (Math.PI * 0.5);

        //최종각도를 구함
        const finalRadian = baseRadian + joysticRadian;

        //x, z 축에 계산결과 반영
        const distance = 3;
        box.position.set(target.position.x, box.position.y, target.position.z);
        box.position.x = -distance * Math.cos(finalRadian);
        box.position.z = distance * Math.sin(finalRadian);        
    }
}