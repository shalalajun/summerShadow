import * as THREE from 'three';
import Project from '../Project';
import Floor from './environment/Floor';
import FollowCamera from '../tools/FollowCamera';
import { netCallback, netEvent } from '../net';
import { assetLists } from '../assets';
import {Cat, NpcCat, MyCat, MovableCat} from './character';
import Grass from './Background/Grass';
import InputObserver from '../tools/InputObserver';
import SphereSky from './environment/SphereSky';
import Tree from './Background/Tree';
import TreeInstance from './Background/TreeInstance';
import Apple from './Background/Apple';
import Stone from './Background/Stone';
import CheckDirection from '../tools/CheckDirection';
import { IGNORE_SERVER, physics } from '../globals';
import EnvLighting from './environment/EnvLighting';
import DummyItem from './object/DummyItem';
import Snow from './environment/Snow';
import SyncObjectPosition from '../tools/SyncObjectPosition';
import {Octree} from 'three/examples/jsm/math/Octree';
import SummerShadow from './environment/summerShadow';

export default class World {

    constructor() {
        
        this.project = Project.getInst();
        this.guiParams = {};
        this.playerCats = {};

        const {camera, canvas} = this.project.core;
        this.inputObserver = new InputObserver(camera, canvas);
        this.followCamera = null;
        this.octree = new Octree();

        this.lstUpdate = [];
        this.lstPhysicsTargets = [];

        // 격자배치 테스트(나중에 적합한 방식으로 수정필요)

        this.GRID_SIZE = 12; // 각 격자의 크기
        this.AREA_SIZE = 50; // 전체 배치 영역의 크기
        this.NUM_GRIDS = this.AREA_SIZE / this.GRID_SIZE; // 격자의 수
    }

    createWorld(){

        const {assetLoader} = this.project;
        const res = assetLoader.pop('catModel');

        this.summerShadow = new SummerShadow()
        
        this.cats = [];
        this.myCat = null;
        this.playerCats = {};   //key:socketId, value:MovableCat
      
        // const res02 = assetLoader.pop('tree01')
        // this.trees = [];

        // for(let i = 1, j = 0; i < res02.length && j < this.NUM_GRIDS * this.NUM_GRIDS; ++i, ++j)
        // {
        //     const t = new Tree(res02[i])
        //     this.trees.push(t);

        //     let gridX = (j % this.NUM_GRIDS) * this.GRID_SIZE - this.AREA_SIZE / 2  + this.GRID_SIZE / 2;
        //     let gridZ = Math.floor(j / this.NUM_GRIDS) * this.GRID_SIZE - this.AREA_SIZE / 2  + this.GRID_SIZE / 2;

        //     const position = this._getRandomPositionInGrid(gridX, gridZ);
        //     t.model.position.copy(position);
        // }
        
        //
        this.floor = new Floor();
        this.octree.fromGraphNode(this.floor.mesh);
        //snow
        //this.snow = new Snow();
        //this.customSky = new CustomSky();
        
       // this.grass = new Grass();
       // this.treeIns = new TreeInstance(this.octree);
       // this.stone = new Stone(this.octree);
        //this.apple = new Apple(this.octree)
        this.sphereSky = new SphereSky();
        this.envLight = new EnvLighting();  //리소스 모두 생성 후 가장 나중에 호출

        //my cat
        this._initMyCat(res[0]);
        //npc cat        
        this._initNpcCat(res, 1);

        //
        if(!IGNORE_SERVER){
            this._initSocket();
        }

        //
      //  this._initItem();
        //light 오브젝트가 캐릭터를 따라다니도록 설정
        this.envLight.sunLight.target = this.myCat.model;
        const syncer = new SyncObjectPosition(this.myCat.model, this.envLight.sunLight);
        this.lstUpdate.push(syncer);
    }

    _initSocket(){

        const net = this.project.net;

        net.addEventListener(netCallback.connectionChanged, connected => {
            print(netCallback.connectionChanged, connected);

            if(connected) {

                const idx = this.myCat.characterIdx;
                const model = this.myCat.model;

                //reuslt={result:'ok', socketId:'id', list:[users]}
                net.join(idx, model.position, model.rotation, resp => {
                    print('join result', resp);

                    if(resp.result !== 'ok'){
                        return;
                    }

                    resp.list.forEach(item => {

                        if(item.socketId !== resp.socketId){
                            this._addPlayer(item);
                        }
                    });
                });

            }else{
                //연결이 끊기면 모든 player를 제거
                const keys = Object.keys(this.playerCats);
                keys.forEach(k => this._removePlayer(k));
            }
        });

        net.addEventListener(netEvent.s2c.join, user => {
            print(netEvent.s2c.join, user);

            this._addPlayer(user);
        });

        net.addEventListener(netEvent.s2c.leave, user => {
            this._removePlayer(user.socketId);
        });

        //resp={list:[userList]}
        net.addEventListener(netEvent.s2c.updateAllPlayer, resp => {
            //print(netEvent.s2c.updateAllPlayer, resp);

            resp.list.forEach(i => {

                const cat = this.playerCats[i.info.socketId];

                if(cat instanceof MovableCat){
                    cat.setDesiredPosition(i.info.px, i.info.py, i.info.pz);
                    cat.setDesiredRotation(i.info.dx, i.info.dy, i.info.dz);
                    cat.changeMoveState(i.info.isMove);
                }
            })
        });
        //
        net.connect();

        //add gui
        this.guiParams.update = {
            interval:0.1,
            elapsed:0,
        };

        if(net.guiFolder){
            net.guiFolder.add(this.guiParams.update, 'interval').min(0).max(1).step(0.0001).name('updatePeriod');
        }
    }

    _addPlayer(user){

        if(this.playerCats.hasOwnProperty(user.socketId)){
            //TODO 처리 더 필요한지 체크
            return;
        }

        const source = assetLists.check[0];
        this.playerCats[user.socketId] = 'loading';

        this.project.assetLoader.instantiate(source)
            .then(gltf => {

                const c = new MovableCat(gltf);
                c.setTexture(user.idx);
                this.playerCats[user.socketId] = c;

                //위치적용
                const {px, py, pz, dx, dy, dz} = user;
                c.setPosition(px, py, pz);
                c.setRotation(dx, dy, dz);
            })
            .catch(error => {
                console.log('addUser Failed', error);
            });

        const cnt = Object.keys(this.playerCats).length;
        this.project.dom.setPlayerCountText(cnt.toString());
    }

    _removePlayer(socketId){

        if(!this.playerCats.hasOwnProperty(socketId)){
            return;
        }

        const item = this.playerCats[socketId];
        delete this.playerCats[socketId];

        item.dispose();

        const cnt = Object.keys(this.playerCats).length;
        this.project.dom.setPlayerCountText(cnt.toString());
    }

    _initMyCat(gltf){
        
        const c = new MyCat(gltf);
        c.translate(0, 10, 0);
        c.updatePhysics(this.octree);
        this.myCat = c;
        this.lstPhysicsTargets.push(this.myCat);

        //
        if(false){
            this.project.core.initControls();
        }else{

            this.followCamera = new FollowCamera(c.model, this.project.core.camera);
            //this.myCat.createDebugMesh();

            this.inputObserver.on('down', viewport => this.myCat.onMoveStart(viewport, this.project.core.camera));
            this.inputObserver.on('press', viewport => this.myCat.move(viewport));
            this.inputObserver.on('up', () => this.myCat.onMoveStop());
        }        
    }

    _initNpcCat(gltfArray, offset){
        
        for(let i=offset; i<gltfArray.length; ++i){

            const c = new NpcCat(gltfArray[i]);
            this.cats.push(c);

            c.translate(
                (Math.random() - 0.5) * 80,
                10,
                (Math.random() - 0.5) * 80
            );

            c.model.rotation.y = Math.random() * Math.PI * 2;
            c.model.name = 'NpcCat ' + i;
            c.updatePhysics(this.octree);
        }
    }

    _initItem(){

        const colors = [
            //'red', 'green', 'blue', 'yellow', 'magenta', 
            'cyan', 'white'
        ];
        const count = 20;
        this.lstItem = [];
        const ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));

        for(let i=0; i<count; ++i){

            //choose color;
            const colorIdx = Math.floor(Math.random() * colors.length);
            
            const item = new DummyItem(colors[colorIdx]);
            this.lstItem.push(item);

            item.on('dead', (deadItem) => {

                const idx = this.lstItem.findIndex(i => i === deadItem);

                if(idx >= 0)
                    this.lstItem.splice(idx, 1);

                const msg = `아이템 획득!${this.lstItem.length}개 남았습니다`;
                this.project.dom.showPopup(msg);
            });

            //일렬로 배치
            // item.mesh.position.x = 10;
            // item.mesh.position.y = 1.5;
            // item.mesh.position.z = (count * 2 * -0.5) + (i * 2);

            //랜덤배치
            item.mesh.position.x = (Math.random() -0.5) * 80;
            item.mesh.position.y = 10;
            item.mesh.position.z = (Math.random() -0.5) * 80;

            //땅위에 놓기 위해 추가작업
            ray.origin.copy(item.mesh.position);
            const rayResult = this.octree.rayIntersect(ray);

            if(rayResult){
                item.mesh.position.y -= rayResult.distance - 1.5;
            }
        }
    }

    onUpdate(time){
        this.myCat?.onUpdate(time);
        this.snow?.onUpdate();
        this.cats?.forEach(i => i.onUpdate(time));
        //this.grass?.onUpdate(time);
        this.followCamera?.onUpdate(time);
        this.inputObserver.onUpdate(time);
        this.lstItem?.forEach(i => i.onUpdate(time, this.myCat.model.position));
        this.lstUpdate?.forEach(i => i.onUpdate(time));

        //TODO Object.keys 개선?
        const keys = Object.keys(this.playerCats);
        keys.forEach(key => {
            if(this.playerCats[key] instanceof Cat){
                this.playerCats[key].onUpdate(time);
            }
        });

        //physics
        const gravityDelta = physics.gravity * time.deltaScalar;
        this.lstPhysicsTargets.forEach(i => i.updatePhysics(this.octree, gravityDelta));

        //update my position
        this.updatePlayerTransform(time.deltaScalar);
    }

    /**
     * 사용자 캐릭터의 현재 위치,회전값 등을 서버로 전송
     * @param {*} deltaScalar 
     * @returns 
     */
    updatePlayerTransform(deltaScalar){

        if(!this.project.net?.isConnected()){
            return;
        }

        //
        let {interval, elapsed} = this.guiParams.update;

        if(interval <= 0 || elapsed >= interval){

            this.guiParams.update.elapsed = 0;

            const {isMove, model} = this.myCat;
            this.project.net.updateTransform(isMove, model.position, model.rotation, result => {
                //print('updateTransform result', result);
            });

        }else{
            this.guiParams.update.elapsed += deltaScalar;
        }
    }

    _getRandomPositionInGrid(x, z) {
        return new THREE.Vector3(
          x + (Math.random() - 0.5) * this.GRID_SIZE,
          0,
          z + (Math.random() - 0.5) * this.GRID_SIZE
        );
    }
}


function print(...params) {
    console.log('[World.js]', ...params);
}