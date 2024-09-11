#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix; // Normal matrix for transforming normals
uniform float uTimeScale; // Speed multiplier from slider
uniform float Timer;      // Elapsed time for animation

// Wave 1
uniform float uAmp0;
uniform float uPropAng0;
uniform float uDensity0;

//Lighting
uniform float uDaylight;

uniform vec3 uLightPosition;

out vec3 vMC; //model coordinates
out vec3 vN; //vector normals
out vec3 vL; //vector from point to light
out vec3 vE; //vector from point to eye


const float g = 9.8; // gravity
const float pi = 3.14159265;

void main(void) {
    float newx = aVertexPosition.x;
    float newy = 0.0;
    float newz = aVertexPosition.z;

    float dxda = 1.;
	float dyda = 0.;
	float dzda = 0.;

	float dxdb = 0.;
	float dydb = 0.;
	float dzdb = 1.;

    // Wave 1 - Vertex Displacement
    float freq0 = sqrt(g * uDensity0);  // angular frequency
    float thetam = uDensity0 * cos(uPropAng0) * aVertexPosition.x +
                   uDensity0 * sin(uPropAng0) * aVertexPosition.z -
                   freq0 * Timer * uTimeScale;

    newx -= uAmp0 * cos(uPropAng0) * sin(thetam);
    newy += uAmp0 * cos(thetam);
    newz -= uAmp0 * sin(uPropAng0) * sin(thetam);

    //Wave 1 - Surface normal vector

	float dthetamda = uDensity0 * cos(uPropAng0);
	float dthetamdb = uDensity0 * sin(uPropAng0);
	dxda -= uAmp0 * cos(uPropAng0) * cos(thetam) * dthetamda;
	dyda -= uAmp0 * sin(thetam) * dthetamda;
	dzda -= uAmp0 * sin(uPropAng0) * cos(thetam) * dthetamda;
	dxdb -= uAmp0 * cos(uPropAng0) * cos(thetam) * dthetamdb;
	dydb -= uAmp0 * sin(thetam) * dthetamdb;
	dzdb -= uAmp0 * sin(uPropAng0) * cos(thetam) * dthetamdb;
    

    // Final vertex position
    vec3 newVertex = vec3(newx, newy, newz);
    vMC = newVertex;

    vec3 ta = vec3( dxda, dyda, dzda );
	vec3 tb = vec3( dxdb, dydb, dzdb );
	vN = normalize(( tb, ta ) );

    float lightX = uDaylight;
    float lightY = 100.0 * sin((1.0 / 300.0) * pi * lightX);
    float lightZ = 1000.0;

	vec3 eyeLightPosition = vec3 (lightX, lightY, lightZ);
    
    vec4 ECposition = uViewMatrix * vec4( newVertex, 1.);
    vL = normalize( eyeLightPosition - ECposition.xyz);                             // vector from the point
                                                                                    // to the light position
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(newVertex, 1.0);           // vector from the point
}