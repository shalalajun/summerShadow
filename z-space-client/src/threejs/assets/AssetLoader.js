import {EventEmitter} from '../core/';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import assetTypes from './assetTypes';
import { print } from '../utils/print';


/**
 * 에셋 로드 컨트롤러
 * trigger : ready | progress
 */
export default class AssetLoader extends EventEmitter {

    constructor(enableDraco = false) {
        super();

        //
        this.items = {};
        this.key = null;
        this.toLoad = 0;    //로드할 에셋 수
        this.loaded = 0;    //로드 완료 에셋 수
        this.enableDraco = enableDraco;

        this.loaders = {
            gltfLoader: null,
            objLoader: null,
            fbxLoader: null,
            textureLoader: null,
            cubeTextureLoader: null,
            tgaLoader: null,
        };
    }

    _getGltfLoader(){

        if(!this.loaders.gltfLoader){

            this.loaders.gltfLoader = new GLTFLoader();

            if(this.enableDraco){
                
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('./draco/');

                this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
            }
        }

        return this.loaders.gltfLoader;
    }

    _getTextureLoader(){

        if(!this.loaders.textureLoader){
            this.loaders.textureLoader = new THREE.TextureLoader();
        }

        return this.loaders.textureLoader;
    }

    _getCubeTextureLoader(){

        if(!this.loaders.cubeTextureLoader){
            this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        }

        return this.loaders.cubeTextureLoader;
    }

    _getFbxLoader(){

        if(!this.loaders.fbxLoader){
            this.loaders.fbxLoader = new FBXLoader();
        }

        return this.loaders.fbxLoader;
    }

    _getObjLoader(){

        if(!this.loaders.objLoader){
            this.loaders.objLoader = new OBJLoader();
        }

        return this.loaders.objLoader;
    }

    _getTgaLoader(){

        if(!this.loaders.tgaLoader){
            this.loaders.tgaLoader = new TGALoader();
        }

        return this.loaders.tgaLoader;
    }

    _getLoader(assetType){

        switch(assetType){
            case assetTypes.GLTF: return this._getGltfLoader();
            case assetTypes.Texture: return this._getTextureLoader();
            case assetTypes.CubeTexture: return this._getCubeTextureLoader();
            case assetTypes.FBX: return this._getFbxLoader();
            case assetTypes.OBJ: return this._getObjLoader();
            case assetTypes.TGA: return this._getTgaLoader();
        }
    }


    /**
     * 에셋 로드 시작
     * @param {String} key : 에셋 구분자 
     * @param {Array} sources : 에셋 목록
     */
    load(key, sources) {

        this.key = key;
        this.toLoad = sources.reduce((prev, now) => (
            prev + (now.hasOwnProperty('count') ? now.count : 1)
        ), 0);
        this.loaded = 0;

        this.trigger('progress', [this.key, 0]);

        // Load each source
        for(const source of sources) {

            const loader = this._getLoader(source.type);

            //
            if(loader){

                const count = source.hasOwnProperty('count') ? source.count : 1;

                for(let i=0; i<count; ++i){

                    const asset = loader.load(source.path, 
                        (file) => {
                            this.onLoadComplete(source, file);
                        },
                    );

                    
                    //texture default options
                    // if(source.type === assetTypes.Texture){
                    //     asset.flipY = false;
                    //     asset.encoding = THREE.sRGBEncoding;
                    // }
                }

            }else{
                print.w('Invalid asset type : ', source.type);
            }
            
        }
    }

    /**
     * 리소스 동적생성
     * @param {*} source {name:'', type:'', path:''} assetLists 참고
     */
    instantiate(source){

        const loader = this._getLoader(source.type);
        return loader.loadAsync(source.path);
    }

    onLoadComplete(source, file){

        if(source.hasOwnProperty('count')){
            
            if(Array.isArray(this.items[source.name])){
                this.items[source.name].push(file);
            }else{
                this.items[source.name] = [file];
            }

        }else{
            this.items[source.name] = file;
        }
        
        this.loaded++;
        this.trigger('progress', [this.key, (this.loaded/this.toLoad)]);

        if(this.loaded === this.toLoad){
            this.trigger('ready', this.key);
        }
    }


    /**
     * 로드된 아이템을 리턴하고 보유목록에서 제거
     * @param {String} name 
     */
    pop(name){

        if(this.items.hasOwnProperty(name)){
            const item = this.items[name];
            delete this.items[name];
            return item;
        }
    }


    dispose(){
        super.dispose();
       
        //
        Object.keys(this.loaders).forEach(k => {
            
            if(typeof this.loaders[k]['dispose'] === 'function'){
                this.loaders[k].dipsose();
            }
        });

        //
        this.items = {}; 

        this.loaders = {
            gltfLoader: null,
            objLoader: null,
            fbxLoader: null,
            textureLoader: null,
            cubeTextureLoader: null,
        };
    }
}
