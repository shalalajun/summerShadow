import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Project from '../Project';
import { print } from '../utils/print';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

/**
 * Three.js 기본 세팅 
 * Three.WebGLREnderer, THREE.Camera, THREE.Scene
 */
export default class Core {

    constructor(canvas, sizes) {

        this.renderer = null;   //Three.js Renderer instance
        this.camera = null;     //Three.js Camera instance
        this.scene = null;      //Three.js Scene instance
        this.canvas = canvas;     //DOM element

        this.orbit = null;      //OrbitControl instance(optional)
        this.cameraHelper = null;     //CameraHelper instance(optional)

        this._initScene();
        this._initCamera(sizes);
        this._initRenderer(canvas);
        
        this.onResize(sizes);
    }

    _initScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
        this.scene.fog = new THREE.Fog( '#dded75' ,110, 170);
    }

    _initRenderer(canvas) {

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            powerPreference: 'high-performance',
            antialias: true,
        });


        //options
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        //this.renderer.toneMapping = THREE.CineonToneMapping;
        //this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor('#211d20');
        this.renderer.info.autoReset = false;

        this.effectComposer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.effectComposer.addPass(this.renderPass)
        this.bokehPass = new BokehPass(this.scene,this.camera,{
            focus: 15.2,
            aperture: 0.003,
            maxblur: 0.01
        })


        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 3.0, 0.4, 0.845);

    
        this.effectComposer.addPass(this.bloomPass)
        //this.effectComposer.addPass(this.bokehPass)
    }

    _initCamera(sizes){

        this.camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 250);
        this.camera.position.set(0, 8, -5);// this.camera.position.set(0, 10, -30);
        
        this.scene.add(this.camera);
    }


    onResize({width, height, pixelRatio}){

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
        this.effectComposer.setSize(width, height);
        this.effectComposer.setPixelRatio(pixelRatio);
        

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }


    onUpdate(time) {

       // this.renderer.render(this.scene, this.camera);
        this.renderer.info.reset();
        this.effectComposer.render()

        this.orbit?.update();
        this.helper?.update();
    }


    dispose(){

        this.renderer.dispose();
        this.renderer = null;

        this.camera = null;

        this.orbit?.dispose();
        this.helper?.dispose();
    }

    
    /**
     * OrbitControls 추가
     * @returns 
     */
    initControls(addDebugOptions = false) {

        if(this.orbit){
            print.w('already has OrbitControls');
            return;
        }

        this.orbit = new OrbitControls(this.camera, this.canvas);
        this.orbit.enableDamping = true;

        //
        const {debug} = Project.getInst();

        if(addDebugOptions && debug.active){

            let folder = debug.ui.folders.find(i => i._title === 'Project');
            folder = folder ??= debug.ui.addFolder('Project');

            folder.add(this.orbit, 'enabled').name('orbit.enabled');
            folder.add(this.orbit, 'enableDamping').name('orbit.enableDamping');
            folder.add(this.orbit, 'autoRotate').name('orbit.autoRotate');
            folder.add(this.orbit, 'autoRotateSpeed').name('orbit.autoRotateSpeed').min(-10).max(10);
        }
    }


    /**
     * CameraHelper 오브젝트 추가
     * @param {THREE.Scene} scene 
     */
    initCameraHelper(scene){

        this.helper = new THREE.CameraHelper(this.camera);
        scene.add(this.helper);
    }
}