import { WebGLRenderer } from 'three';
import * as dat from 'lil-gui';
import Stats from 'stats.js';
import {checkHash} from '../utils/utils';
import { print } from '../utils/print';

/**
 * 디버깅 기능 유틸클래스
 *  Dat.GUI
 *  Stats.js
 */
export default class Debug{

    constructor(){

        this.active = checkHash('#debug');
        this.ui = null; //GUI
        
        this.stats = {}; //stats.js

        //drawcall monitor assets
        this.renderer = null;
        this.maxCalls = 0;

        if(this.active){
            this.ui = new dat.GUI();
        }
    }

    
    /**
     * Stats.js FPS 모니터링 패널 추가
     * @returns 
     */
    initFpsMonitor(){    

        if(this.stats.fps){
            print.w('already has fps monitor');
            return;
        }

        const fps = new Stats();
        fps.showPanel(0);
        document.body.appendChild(fps.dom);
        fps.dom.style.position='relative';
        fps.dom.style.display='inline-block';

        this.stats.fps = fps;
    }


    /**
     * Stats.js FPS 모니터링 패널 추가
     * @param {WebGLRenderer} renderer 
     * @returns 
     */
    initDrawcallMonitor(renderer){

        if(this.stats.calls){
            print.w('already has drawcalls monitor');
            return;
        }

        if(!renderer){
            print.w('drawcall monitor requires renderer');
            return;
        }

        const calls = new Stats.Panel('calls', '#fffa99', '#38372a');   //이름, 하이라이트 컬러, 배경컬러 순
        document.body.appendChild(calls.dom);
        calls.dom.style.position='relative';
        calls.dom.style.display='inline-block';

        this.renderer = renderer;
        this.maxCalls = 0;
        this.stats.calls = calls;
    }


    /**
     * Stats.js 메모리 모니터링 패널 추가
     */
    initMemoryMonitor(){

        if(this.stats.memory){
            print.w('already has memory monitor');
            return;
        }

        const memory = new Stats();
        memory.showPanel(2);
        document.body.appendChild(memory.dom);
        memory.dom.style.position='relative';
        memory.dom.style.display='inline-block';

        this.stats.memory = memory;
    }

    
    /**
     * stats.js를 사용하는 경우 데이터 업데이트를 위한 함수
     * tick() 함수 초반에 호출해야함
     */
    beginMonitor(){

        const {fps, calls, memory} = this.stats;
        
        fps && fps.begin();
        memory && memory.begin();
        
        if(calls && this.renderer){
            this.maxCalls = Math.max(this.renderer.info.render.calls, this.maxCalls);
            calls.update(this.renderer.info.render.calls, this.maxCalls);
        }
    }


    /**
     * stats.js를 사용하는 경우 데이터 업데이트를 위한 함수
     * tick() 함수 마지막에 호출해야함
     */
    endMonitor(){

        const {fps, memory} = this.stats;

        fps && fps.end();
        memory && memory.end();
    }


    dispose(){

        this.ui?.destroy();
        this.stats.fps?.dom.remove();
        this.stats.calls?.dom.remove();
        this.stats.memory?.dom.remove();
    }
}