export function insertAttributesAndFunctions(shader) {
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      `
        attribute vec3 offset;
        
        vec3 getOffsetPosition(vec3 position) {
          return position + offset;
        }
        
        void main() {
      `
    );
  }
  
  export function overrideVertexPosition(shader) {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
    `
      vec3 transformed = getOffsetPosition(position);
    `
    );
  }


  export function overrideColor(shader) {
    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4(finalColor, 1.0);",
    `
    
      vec3 baseColor = vec3(0.995,0.980,0.365);
      vec3 groundCol = vec3(0.562,0.990,0.059);
      vec3 mixCol = mix(groundCol, baseColor, vUv.x);
      gl_FragColor = vec4( mixCol  *  shadowColor, 1 );
    `
    );
    
  }