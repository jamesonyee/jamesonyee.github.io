#version 300 es
in vec3 aVertexPosition;
in vec3 aVertexNormal;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
out vec3 vNormal;
out vec3 vPosition;

void main(void) {
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition, 1.0);
  vPosition = aVertexPosition;
  vNormal = aVertexNormal;
}