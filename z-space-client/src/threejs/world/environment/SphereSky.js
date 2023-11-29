import * as THREE from 'three';
import Project from '../../Project';
import vertexShader from '../../shaders/skyShader/vertexShader.vert'
import fragmentShader from '../../shaders/skyShader/fragmentShader.frag'

export default class SphereSky{
    constructor()
    {


        this._initSky()
    }
    _initSky()
    {
        const project = Project.getInst()

        this.uniforms = {
            'topColor': { value: new THREE.Color( 0x0077ff ) },
            'bottomColor': { value: new THREE.Color( 0xffffff ) },
            'offset': { value: 0 },
            'exponent': { value: 0.3 }
        };

        this.skyGeo = new THREE.SphereGeometry( 150, 32, 15 );
        this.skyMat = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        } );

        this.sky = new THREE.Mesh(  this.skyGeo,  this.skyMat );
        project.add(this.sky);
        console.log(this.sky)
    }
}