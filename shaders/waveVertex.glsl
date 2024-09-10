#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uTimeScale; // Speed multiplier from slider
uniform float Timer;      // Elapsed time for animation



// Wave 1
uniform float uAmp0;
uniform float uPropAng0;
uniform float uDensity0;

//Lighting
uniform float uLightX, uLightY, uLightZ;

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

    vPosition = newVertex;

	vec3 eyeLightPosition = vec3 (uLightX, uLightY, uLightZ);

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(newVertex, 1.0);
}