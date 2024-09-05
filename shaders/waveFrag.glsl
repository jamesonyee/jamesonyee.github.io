#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vPosition;
out vec4 fragColor;

void main(void) {
  vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0)); // Example light direction
  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
  vec3 color = vec3(0.0, 0.0, 1.0); // Blue color
  fragColor = vec4(color * diff, 1.0);
}