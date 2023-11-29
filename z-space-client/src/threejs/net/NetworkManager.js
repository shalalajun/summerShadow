import {io} from 'socket.io-client';
import { checkHash } from '../utils/utils';
import Project from '../Project';
import { EventEmitter } from '../core';
import { netEvent, netCallback } from './netParams';
import { SOCKET_URL } from '../globals';


export default class NetworkManager {

    //NetworkManager-기타 모듈간 이벤트 콜백
    static CALLBACK = {
        connectionChanged: 'onConnectionChanged',
    }

    constructor(dom){

        this.dom = dom;

        if(checkHash('#socketio')){
            this._initDebugGUI();

            dom.setNetworkBarVisible(true);
            dom.setNetworkBarVisible(true);
            dom.setNetworkStatusText('disconnected');
            dom.setNetworkDomainText(SOCKET_URL);
        }else{
            dom.setNetworkBarVisible(false);
        }

        //callbacks
        this.events = new EventEmitter();
    }

    isConnected(){
        return this.socket?.connected;
    }

    getSocketId(){
        return this.socket?.id;
    }

    /**
     * 이벤트 등록
     * @param {string} event : netParams.js
     * @param {function} cb
     */
    addEventListener(event, cb){
        this.events.on(event, cb);
    }

    connect(){

        if(this.isConnected()){
            print('already connected');
            return;
        }
        
        this.socket = io(SOCKET_URL, {
            cors:{
                origin:'*',
            }
        });

        this.socket.on('connect', () => {
            print('connect');
            this.events.trigger(netCallback.connectionChanged, [true]);
            this.dom.setNetworkStatusText('connected');
        });

        //s2c.join : 새 유저가 추가되었을 때 호출
        this.socket.on(netEvent.s2c.join, (data) => {
            print(netEvent.s2c.join, data);
            this.events.trigger(netEvent.s2c.join, [data]);
        });

        this.socket.on(netEvent.s2c.leave, (data) => {
            print(netEvent.s2c.leave, data);
            this.events.trigger(netEvent.s2c.leave, [data]);
        });

        this.socket.on(netEvent.s2c.updateAllPlayer, (data) => {
            //print(netEvent.s2c.updateAllPlayer, data);
            this.events.trigger(netEvent.s2c.updateAllPlayer, [data]);
        });

        this.socket.on('connect_error', (error) => {
            print('connect_error', error);
        });
        
        this.socket.on('reconnect', (attempt) => {
            print('reconnect', attempt);
        });
        
        this.socket.on('reconnect_attempt', () => {
            print('reconnect_attempt');
        });

        this.socket.on('reconnecting', (attempt) => {
            print('reconnecting', attempt);
        });

        
        this.socket.on('reconnect_error', (error) => {
            print('reconnect_error', error);
        });

        this.socket.on('reconnect_failed', (error) => {
            print('reconnect_failed', error);
        });


        this.socket.on('disconnect', () => {
            print('disconnect');
            this.dom.setNetworkStatusText('disconnected');
            this.events.trigger(netCallback.connectionChanged, [false]);
        })
    }

    disconnect(){
        
        if(this.socket == null){
            console.log('already disconnected');
            return;
        }

        this.socket.disconnect();
        this.socket = null;
    }

    /**
     * 초기화
     * @param {int} idx 캐릭터 종류
     * @param {THREE.Vector3} position 
     * @param {THREE.Euler} rotation 
     * @param {function} cb 
     */
    join(idx, position, rotation, cb){

        const params = {
            idx:idx,
            trf:[
                position.x,
                position.y,
                position.z,
                rotation.x,
                rotation.y,
                rotation.z
            ]
        };

        this.socket.emit(netEvent.c2s.join, params, cb);
    }

    /**
     * 위치 업데이트
     * @param {bool} isMove 사용자가 캐릭터를 조작중인지
     * @param {THREE.Vector3} position 
     * @param {THREE.Euler} rotation 
     * @param {function} cb 
     */
    updateTransform(isMove, position, rotation, cb){

        const params = {
            isMove, 
            trf:[
                position.x,
                position.y,
                position.z,
                rotation.x,
                rotation.y,
                rotation.z
            ]
        };
        
        this.socket.emit(netEvent.c2s.updateTransform, params, cb);
    }

    _initDebugGUI(){

        const project = Project.getInst();
        const folder = project.debug.ui.addFolder("socket.io");
        this.guiFolder = folder;

        folder.add(this, 'connect');
        folder.add(this, 'disconnect');

        const param = {
            join:() => this.join(0, {x:1, y:2, z:3}, {x:4, y:5, z:6}, 
                resp => print('join result', resp)
            ),
        }
        folder.add(param, 'join');
    }

    dispose(){

        this.disconnect();

        this.dom = null;
        this.events = null;
        this.socket = null;
    }
}



function print(...params){
    console.log('[NetworkManager.js]', ...params);
}