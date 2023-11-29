import * as THREE from 'three';
import {Debug} from './tools';
import World from './world/World';
import {assetLists, AssetLoader} from './assets';
import { checkHash } from './utils/utils';
import { print } from './utils/print';
import {Core, Sizes, Time} from './core';
import DomHandler from '../DomHandler';
import { NetworkManager } from './net';
import { IGNORE_SERVER } from './globals';

let instance = null;

export default class Project {

    static getInst(){
        return instance;
    }
    
    constructor(canvas){

        //Singleton
        if(instance != null){
            print.w('Project.class recommands Project.getInst() instead constructor');
            return instance; 
        }else{
            instance = this;
        }
        
        //
        this.canvas = canvas;

        //setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.core = new Core(this.canvas, this.sizes);

        this.assetLoader = new AssetLoader();
        this.world = new World();

        this.dom = new DomHandler();

        if(!IGNORE_SERVER){
            this.net = new NetworkManager(this.dom);
        }        

        //add tools
        //this.core.initControls(this.canvas);

        //add event callbacks
        //this.assetLoader.on('progress', (k, p) => console.log(k, p));
        this.sizes.on('resize', () => this.onResize());
        this.time.on('tick', () => this.onUpdate());

        //load resources
        this.dom.setLoadingVisible(true);

        this.assetLoader.load('old', assetLists.old);
        this.assetLoader.on('progress', (key, progress) => {
            this.dom.setLoadingText(`Loading... ${(progress*100).toFixed(2)}%`);
        })
        this.assetLoader.on('ready', (key) => {

            if(key === 'old'){
                this.dom.setLoadingVisible(false);
                this.world.createWorld();
                //this.assetLoader.load('after', assetLists.heavy);
            }
        });

        //monitor
        if(checkHash('#monitor')){
            this.debug.initFpsMonitor();
            this.debug.initDrawcallMonitor(this.core.renderer);
            this.debug.initMemoryMonitor();
        }        

        //debug
        if(this.debug.active){
            const folder = this.debug.ui.addFolder('Project');
            folder.add(this, 'destroy');
        }
    }


    onResize(){
        this.core.onResize(this.sizes);
    }


    onUpdate(){

        this.debug.beginMonitor();
        
        this.core.onUpdate(this.time);
        this.world.onUpdate(this.time);

        this.debug.endMonitor();
    }


    destroy() {

        this.sizes.dispose();
        this.time.dispose();
        this.keyInput?.dispose();
        this.debug.dispose();
        this.net.dispose();

        this.core.scene.traverse((child) => {

            if(child instanceof THREE.Mesh) {

                child.geometry.dispose();

                for(const key in child.material) {

                    const value = child.material[key];

                    if(value && typeof value.dispose === 'function'){
                        value.dispose();
                    }
                }
            }
        })
        
        this.core.dispose();

        //clear singleton instances
        instance = null;
    }

    add(obj){
        this.core.scene.add(obj);
    }

    remove(obj){
        this.core.scene.remove(obj);
    }

    traverse(cb){
        this.core.scene.traverse(cb);
    }
}