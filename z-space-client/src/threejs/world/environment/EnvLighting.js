import * as THREE from 'three';
import Project from '../../Project';
import { checkHash } from '../../utils/utils';

/**
 * 씬 환경 제어 클래스
 * envMap, lights, fog, etc...
 */
export default class EnvLighting{

    constructor() {

        const project = Project.getInst();
        this.assetLoader = project.assetLoader;
        this.debug = project.debug;

       

        if(this.debug.active && checkHash('#env')){
            this.debugFolder = this.debug.ui.addFolder('Environment');
        }

        this._initSunlight();
        this._initEnvironmentMap();
    }


    _initSunlight() {

        this.sunLight = new THREE.DirectionalLight('#ffffff',1.05);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(4096, 4096);
        this.sunLight.shadow.normalBias = 0.005;
        this.sunLight.position.set(3, 25,5);
        Project.getInst().add(this.sunLight);

        //Shadow 조절
        const size = 30;
        this.sunLight.shadow.camera.left = size * -1.0;
        this.sunLight.shadow.camera.right = size * 1.0;
        this.sunLight.shadow.camera.top = size * 1.0;
        this.sunLight.shadow.camera.bottom = size * -1.0;
        this.sunLight.shadow.camera.far = 30;

        //ShadowHelper
        // this.helper = new THREE.CameraHelper( this.sunLight.shadow.camera );
        // Project.getInst().add(this.helper );
        // this.lightHelper = new THREE.DirectionalLightHelper( this.sunLight, 5 );
        // Project.getInst().add(this.lightHelper );

        //AmbientLight
        // this.ambientLight = new THREE.AmbientLight("#ffffff", 0.02);
        // Project.getInst().add(this.ambientLight);

        // Debug
        if(this.debugFolder) {
            
            this.debugFolder.add(this.sunLight, 'intensity')
                .name('sunLightIntensity').min(0).max(10).step(0.001);
            
                this.debugFolder.add(this.sunLight.position, 'x')
                .name('sunLightX').min(- 5).max(5).step(0.001);
            
                this.debugFolder.add(this.sunLight.position, 'y')
                .name('sunLightY').min(- 5).max(5).step(0.001);
            
                this.debugFolder.add(this.sunLight.position, 'z')
                .name('sunLightZ').min(- 5).max(5).step(0.001);
        }
    }

    _initEnvironmentMap(){

        this.envMap = {};
        this.envMap.intensity = 0.4;
        this.envMap.texture = this.assetLoader.pop('environmentMapTexture');
        this.envMap.texture.encoding = THREE.sRGBEncoding;
        
        // Project.getInst().environment = this.envMap.texture;

        //
        this.envMap.updateMaterials = () => {

            Project.getInst().traverse((child) => {

                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.envMap.texture;
                    child.material.envMapIntensity = this.envMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }

        this.envMap.updateMaterials();

        // Debug
        if(this.debugFolder) {

            this.debugFolder
                .add(this.envMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.envMap.updateMaterials);
        }
    }
}