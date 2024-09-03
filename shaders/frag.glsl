#version 300 es
precision mediump float;
precision mediump sampler3D;

uniform float uKa, uKd, uKs;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform float uShininess;

uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

in vec3 vMC;
in vec3 vNs;
in vec3 vLs;
in vec3 vEs;

out vec4 FragColor;

vec3 RotateNormal(float angx, float angy, vec3 n) {
    float cx = cos(angx);
    float sx = sin(angx);
    float cy = cos(angy);
    float sy = sin(angy);

    // Rotate about x:
    float yp = n.y * cx - n.z * sx;
    n.z = n.y * sx + n.z * cx;
    n.y = yp;

    // Rotate about y:
    float xp = n.x * cy + n.z * sy;
    n.z = -n.x * sy + n.z * cy;
    n.x = xp;

    return normalize(n);
}

void main() {
    vec3 myColor = uColor.rgb;

    vec4 nvx = texture(Noise3, uNoiseFreq * vMC);
    float angx = nvx.r + nvx.g + nvx.b + nvx.a - 2.0;
    angx *= uNoiseAmp;

    vec4 nvy = texture(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.5));
    float angy = nvy.r + nvy.g + nvy.b + nvy.a - 2.0;
    angy *= uNoiseAmp;

    vec3 n = RotateNormal(angx, angy, vNs);
    n = normalize(n);

    vec3 Normal = normalize(vNs);
    vec3 Light = normalize(vLs);
    vec3 Eye = normalize(vEs);

    vec3 ambient = uKa * myColor;

    float dd = max(dot(Normal, Light), 0.0);
    vec3 diffuse = uKd * dd * myColor;

    float ss = 0.0;
    if (dot(n, Light) > 0.0) {
        vec3 ref = normalize(reflect(-Light, n));
        ss = pow(max(dot(Eye, ref), 0.0), uShininess);
    }
    vec3 specular = uKs * ss * uSpecularColor.rgb;

    FragColor = vec4(ambient + diffuse + specular, 1.0);
}
