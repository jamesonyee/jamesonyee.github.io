function showError(errorText) {
  const errorBox = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerText = errorText;
  errorBox.appendChild(errorTextElement);
  console.log(errorText);
}

async function loadShader(gl, type, url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch shader source from ${url}`);
    return null;
  }

  const shaderSource = await response.text();
  const shader = gl.createShader(type);

  if (!shader) {
    console.error(`Failed to create shader of type ${type}`);
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const shaderType = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
    console.error(
      `Error compiling ${shaderType} shader from ${url}: ${gl.getShaderInfoLog(
        shader
      )}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

async function QuadXZ() {
  const canvas = document.getElementById("glCanvas");
  if (!canvas) {
    showError(
      "Cannot get canvas reference - chekc for typos or laoding sript too early in HTML"
    );
    return;
  }
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("This browser does not support WebGL 2");
    return;
  }

  //init shaders
  const vertexShaderUrl = "shaders/vert.glsl";
  const fragmentShaderUrl = "shaders/frag.glsl";

  const vertexShader = await loadShader(gl, gl.VERTEX_SHADER, vertexShaderUrl);
  const fragmentShader = await loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderUrl
  );

  if (!vertexShader) {
    console.error(`Failed to load vertex shader from ${vertexShaderUrl}`);
  }

  if (!fragmentShader) {
    console.error(`Failed to load fragment shader from ${fragmentShaderUrl}`);
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      `Error linking program: ${gl.getProgramInfoLog(shaderProgram)}`
    );
    return;
  }

  const vertexPositionAttribLocation = gl.getAttribLocation(
    shaderProgram,
    "vertexPosition"
  );

  if (vertexPositionAttribLocation < 0) {
    showError("Failed to get attrib location for vertexPosition");
    return;
  }

  //Output merger
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  //Set GPU program
  gl.enableVertexAtribArray(vertexPositionAttribLocation);
  gl.useProgram(shaderProgram);

  //Input assembler

  //init buffers
  const QuadVerts = [
    // Top middle
    0.0, 0.5,
    // Bottom left
    -0.5, -0.5,
    // Bottom right
    0.05, -0.5,
  ];
  const QuadVertsCpuBuffer = new Float32Array(QuadVerts);

  const QuadGeoBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, QuadGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, QuadVertsCpuBuffer, gl.STATIC_DRAW);
}

try {
  QuadXZ();
} catch (e) {
  showError(`Uncaught JS exception: ${e}`);
}
