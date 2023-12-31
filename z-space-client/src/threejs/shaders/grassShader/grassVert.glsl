
varying vec2 vUv;
uniform float time;

void main() {

 

    vUv = uv;

    
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif


    // vec4 modelPosition = vec4( position, 1.0 );
 

    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( (1.0 - uv.x) * 3.1416 / 2.8);
    
    float displacement = sin( mvPosition.z + time * 9.0 ) * ( 0.1 * dispPower );
    mvPosition.z += -1.0 + displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}