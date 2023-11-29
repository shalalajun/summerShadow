import assetTypes from './assetTypes';
import { ROOT_PATH } from '../globals';

/**
 * 로드할 에셋 목록 정의
 *  name : 에셋을 찾을때 속성명으로 사용
 *  type : 에셋종류. loader 구분시 필요. assetTypes 상수 참조
 *  path : 로드할 에셋 주소
 */

//
export default {
    old: [
    
        //Environment map
        {
            name: 'environmentMapTexture',
            type: assetTypes.CubeTexture,
            path:
            [
                ROOT_PATH + 'textures/environmentMap/px.jpg',
                ROOT_PATH + 'textures/environmentMap/nx.jpg',
                ROOT_PATH + 'textures/environmentMap/py.jpg',
                ROOT_PATH + 'textures/environmentMap/ny.jpg',
                ROOT_PATH + 'textures/environmentMap/pz.jpg',
                ROOT_PATH + 'textures/environmentMap/nz.jpg'
            ]
        },

        //Tree texture
        {
            name: 'pineTreeTexture',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/pineTreeTexture.jpg'
        },

        {
            name: 'treeTexture',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/treeTexture.png'
        },

        //cat
        {
            name: 'orangeCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/orangeCat.png',
        },
        {
            name: 'yellowCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/yellowCat.jpg',
        },
        {
            name: 'grayCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/grayCat.jpg',
        },
        {
            name: 'grayLineCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/grayLineCat.png',
        },
        {
            name: 'blackCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/blackCat.png',
        },
        {
            name: 'halfCatTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/cat/halfCat.jpg',
        },
        {
            name: 'snowTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/snow.png',
        },
        //groundTex
        {
            name: 'groundTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/ground/ground.jpg',
        },
        // appleTexture
        {
            name: 'appleTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/apple.jpg',
        },

        // summerTexture
        {
            name: 'summerTex',
            type: assetTypes.Texture,
            path: ROOT_PATH + 'textures/summer.png',
        },
        //cat model
        {
            name: 'catModel',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/OrangeCat/orangeCat_Big.glb',
            count:0 + 1,
        },

          //tree
        {
            name: 'tree01',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Tree/tree01.glb',
            count:0 + 1,
           
           
        },

        {
            name: 'tree02',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Tree/tree02.glb'
           
        },
        //Stone

        {
            name: 'stone01',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Stone/stone01.glb'
           
        },

        {
            name: 'stone02',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Stone/stone02.glb'
           
        },

        //grass
        {
            name: 'grass',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Tree/grass.glb'
           
        },

        //apple
        {
            name: 'apple',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Tree/apple.glb'
           
        },

        //ground
        {
            name: 'ground',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/Ground/ground.glb'
           
        },

    ],
    check:[
        //cat
        {
            name: 'catModel',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/OrangeCat/orangeCat_Big.glb',
        },
    ],

    heavy:[
        //Large model test
        {
            name: 'fig',
            type: assetTypes.GLTF,
            path: ROOT_PATH + 'models/5thTotal_Model.glb'
        },
    ]
}