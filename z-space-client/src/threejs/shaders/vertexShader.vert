#include <common>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <fog_pars_vertex>


// #define USE_SKINNING

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
 
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <defaultnormal_vertex>
  

  #include <begin_vertex>
 
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 clipPosition = projectionMatrix * viewPosition;
  
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-viewPosition.xyz);
  vUv = uv;

  gl_Position = clipPosition;

#include <skinbase_vertex>
#include <skinning_vertex>
#include <project_vertex>
#include <fog_vertex>
#include <worldpos_vertex>
#include <shadowmap_vertex>

}