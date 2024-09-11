#version 300 es
precision highp float;

in vec3 vPosition;

//Lighting
in vec3 vN; // normal vector
in vec3 vLs; // vector from point to light
in vec3 vEs; // vector from point to eye

out vec4 fragColor;

void main(void) {
  vec3 lightDir = normalize(vec3(15.0, 15.0, 1.0)); // Example light direction
  float diff = max(dot(normalize(vN), lightDir), 0.0);
  vec3 color = vec3(0.0, 0.0, 1.0); // Blue color
  fragColor = vec4(color * diff, 1.0);
}