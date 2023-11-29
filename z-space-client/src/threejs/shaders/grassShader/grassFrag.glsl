
varying vec2 vUv;


  void main() {

  	vec3 baseColor = vec3(0.930,0.897,0.468);
    vec3 groundCol = vec3(0.315,0.605,0.036);
    vec3 mixCol = mix(groundCol, baseColor, vUv.x);
    gl_FragColor = vec4( mixCol, 1 );
  }
