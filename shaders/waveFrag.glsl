#version 300 es
precision highp float;

in vec3 vPosition;

//Lighting
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye

out vec4 fragColor;

void main(void) {
  vec3 myColor = vec3(0.2, 0.2, .8); // Blue water color
  vec3 specularColor = vec3(1.0, 1.0, 1.0); // White reflection color

  vec3 Normal = normalize(vN);
  vec3 Light = normalize(vL);
  vec3 Eye = normalize(vE);

  float uKa = .6;
  float uKs = .4;
  float uKd = .3;
  float uShininess = 100.; 

  vec3 ambient = uKa * myColor;
  
  float dd = max(dot(normalize(vN), Light), 0.0);
  vec3 diffuse = uKd * dd * myColor;

  float ss = 0.;
  if ( dot(Normal, Light) > 0. ){
    vec3 ref = normalize( reflect( -Light, Normal) );
    ss = pow( max( dot(Eye,ref),0. ), uShininess );
  }

  vec3 specular = uKs * ss * specularColor.rgb;
  fragColor = vec4( ambient + diffuse + specular, 1. );
}