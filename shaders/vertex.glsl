#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uTime;
uniform float Timer;
uniform float uTimeScale;

in vec3 aPosition; // Replaces gl_Vertex
in vec3 aNormal;   // If you had vertex normals, they would go here

out vec3 vMC;
out vec3 vNs;
out vec3 vLs;
out vec3 vEs;

// Wave 1
uniform float uAmp0;
uniform float uPropAng0;
uniform float uDensity0;

// Wave 2
uniform float uAmp1;
uniform float uPropAng1;
uniform float uDensity1;
uniform float uPhaseShift1;

uniform float uLightX, uLightY, uLightZ;

const float g = 9.8; // gravity

void main() {
    float newx = aPosition.x;
    float newy = 0.0;
    float newz = aPosition.z;

    float dxda = 1.0;
    float dyda = 0.0;
    float dzda = 0.0;

    float dxdb = 0.0;
    float dydb = 0.0;
    float dzdb = 1.0;

    // Wave 1 - Vertex Displacement
    float uPhaseShift0 = 0.0;  // shift other waves based on this one
    float freq0 = sqrt(g * uDensity0);  // angular frequency
    float thetam = uDensity0 * cos(uPropAng0) * aPosition.x + uDensity0 * sin(uPropAng0) * aPosition.z - freq0 * Timer * uTimeScale - uPhaseShift0;

    newx -= uAmp0 * cos(uPropAng0) * sin(thetam);
    newy += uAmp0 * cos(thetam);
    newz -= uAmp0 * sin(uPropAng0) * sin(thetam);

    // Wave 1 - Surface normal vector
    float dthetamda = uDensity0 * cos(uPropAng0);
    float dthetamdb = uDensity0 * sin(uPropAng0);

    dxda -= uAmp0 * cos(uPropAng0) * cos(thetam) * dthetamda;
    dyda -= uAmp0 * sin(thetam) * dthetamda;
    dzda -= uAmp0 * sin(uPropAng0) * cos(thetam) * dthetamda;

    dxdb -= uAmp0 * cos(uPropAng0) * cos(thetam) * dthetamdb;
    dydb -= uAmp0 * sin(thetam) * dthetamdb;
    dzdb -= uAmp0 * sin(uPropAng0) * cos(thetam) * dthetamdb;

    vec3 normal = normalize(cross(vec3(dxda, dyda, dzda), vec3(dxdb, dydb, dzdb)));

    // Lighting calculations
    vec3 eye = vec3(uModelViewMatrix[3]);
    vec3 light = vec3(uLightX, uLightY, uLightZ);

    vec4 modelViewPosition = uModelViewMatrix * vec4(newx, newy, newz, 1.0);
    vMC = vec3(modelViewPosition);
    vNs = normal;
    vLs = light - vMC;
    vEs = eye - vMC;

    gl_Position = uProjectionMatrix * modelViewPosition;
}
