import * as THREE from 'three';
import StyleMaterial from '../styleMaterial';
import { insertAttributesAndFunctions, overrideVertexPosition, overrideColor } from './GrassMaterialUtils'

export default class GrassMaterial extends StyleMaterial
{
    name = "GrassMaterial"

    onBeforeCompile = (shader) => {
        insertAttributesAndFunctions(shader);
        overrideVertexPosition(shader);
        overrideColor(shader);
      };
}