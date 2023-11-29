import * as THREE from 'three';
import Project from '../../Project';
import { checkHash } from '../../utils/utils';
import Cat from './Cat';

export default class NpcCat extends Cat {

    constructor(gltf){
        super(gltf);

        this.isNpcCat = true;
        
        //
        if(checkHash('#npc')){
            this._initDebugGUI();
        }

        //
        let time = Math.random() * 5;
        time = Math.max(2, time);
        
        setInterval(() => {
            const keys = Object.keys(this.actions);
            const idx = Math.floor(Math.random() * keys.length);
            const clipName = keys[idx];
            this.play(clipName);
        }, time * 1000);
    }

    _initModel(project){
        super._initModel(project);

        const map = project.assetLoader.items.orangeCatTex;
        map.flipY = false;
        this.material.setMap(map);
    }

    _initDebugGUI(){
        
        const project = Project.getInst();

        if(project.debug.active) {

            const folder = project.debug.ui.addFolder(this.model.name);
                
            const debugObject = {
                playIdle: () => { this.play('idle') },
                playWalking: () => { this.play('walk') },
                playRunning: () => { this.play('run') }
            };

            folder.add(debugObject, 'playIdle');
            folder.add(debugObject, 'playWalking');
            folder.add(debugObject, 'playRunning');
        }
    }
}