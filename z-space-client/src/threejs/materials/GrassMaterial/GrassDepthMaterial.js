import * as THREE from 'three';
import { insertAttributesAndFunctions, overrideVertexPosition } from  './GrassMaterialUtils'


export default class GrassDepthMaterial extends THREE.MeshDepthMaterial {
    name = "GrassDepthMaterial";
  
    onBeforeCompile = (shader) => {
      insertAttributesAndFunctions(shader);
      overrideVertexPosition(shader);
    };
  }

