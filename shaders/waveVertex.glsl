#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uTimeScale;
uniform float Timer;  // Added this to match OpenGL shader

// Wave 1
uniform float uAmp0;
uniform float uPropAng0;
uniform float uDensity0;

uniform vec3 uLightPosition;

out vec3 vNormal;
out vec3 vPosition;

const float g = 9.8; // gravity

void main(void) {
    float newx = aVertexPosition.x;
    float newy = 0.0;
    float newz = aVertexPosition.z;

    // Wave 1 - Vertex Displacement
    float freq0 = sqrt(g * uDensity0);  // angular frequency
    float thetam = uDensity0 * cos(uPropAng0) * aVertexPosition.x +
                   uDensity0 * sin(uPropAng0) * aVertexPosition.z -
                   freq0 * Timer * uTimeScale;

    newx -= uAmp0 * cos(uPropAng0) * sin(thetam);
    newy += uAmp0 * cos(thetam);
    newz -= uAmp0 * sin(uPropAng0) * sin(thetam);

    // Final vertex position
    vec3 newVertex = vec3(newx, newy, newz);

    // Normal calculation
    vec3 dxda = vec3(1.0, 0.0, 0.0);
    vec3 dxdb = vec3(0.0, 0.0, 1.0);
    vec3 ta = cross(dxdb, dxda);
    vec3 tb = vec3(0.0, 0.0, 0.0);
    vNormal = normalize(cross(ta, tb));

    vPosition = newVertex;

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(newVertex, 1.0);
}