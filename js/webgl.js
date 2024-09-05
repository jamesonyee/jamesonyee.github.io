function showError(errorText) {
  const errorBox = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerText = errorText;
  errorBox.appendChild(errorTextElement);
  console.error(errorText);
}

async function loadShader(gl, type, url) {
  const response = await fetch(url);
  if (!response.ok) {
    showError(`Failed to fetch shader source from ${url}`);
    return null;
  }

  const shaderSource = await response.text();
  const shader = gl.createShader(type);

  if (!shader) {
    showError(`Failed to create shader of type ${type}`);
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const shaderType = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
    showError(
      `Error compiling ${shaderType} shader from ${url}: ${gl.getShaderInfoLog(
        shader
      )}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createGrid(size, divisions) {
  const halfSize = size / 2;
  const step = size / divisions;
  const vertices = [];
  const indices = [];

  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      const x0 = -halfSize + i * step;
      const z0 = -halfSize + j * step;
      const x1 = -halfSize + (i + 1) * step;
      const z1 = -halfSize + (j + 1) * step;

      // Quad 1
      vertices.push(x0, 0, z0);
      vertices.push(x1, 0, z0);
      vertices.push(x0, 0, z1);

      // Quad 2
      vertices.push(x1, 0, z0);
      vertices.push(x1, 0, z1);
      vertices.push(x0, 0, z1);
    }
  }

  return new Float32Array(vertices);
}

function createGridWithNormals(size, divisions) {
  const halfSize = size / 2;
  const step = size / divisions;
  const vertices = [];

  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      const x0 = -halfSize + i * step;
      const z0 = -halfSize + j * step;
      const x1 = -halfSize + (i + 1) * step;
      const z1 = -halfSize + (j + 1) * step;

      // Quad 1
      vertices.push(x0, 0, z0, 0, 1, 0);
      vertices.push(x1, 0, z0, 0, 1, 0);
      vertices.push(x0, 0, z1, 0, 1, 0);

      // Quad 2
      vertices.push(x1, 0, z0, 0, 1, 0);
      vertices.push(x1, 0, z1, 0, 1, 0);
      vertices.push(x0, 0, z1, 0, 1, 0);
    }
  }

  return new Float32Array(vertices);
}

async function initWebGL() {
  const canvas = document.getElementById("glCanvas");
  if (!canvas) {
    showError(
      "Cannot get canvas reference - check for typos or loading script too early in HTML"
    );
    return;
  }

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("This browser does not support WebGL 2");
    return;
  }

  // Set canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Load shaders
  const vertexShaderUrl = "shaders/waveVertex.glsl";
  const fragmentShaderUrl = "shaders/waveFrag.glsl";

  const vertexShader = await loadShader(gl, gl.VERTEX_SHADER, vertexShaderUrl);
  const fragmentShader = await loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderUrl
  );

  if (!vertexShader || !fragmentShader) {
    showError("Failed to load shaders");
    return;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    showError(`Error linking program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return;
  }

  //Set up buffers
  const gridSize = 200;
  const gridDivisions = 200;
  const gridVertices = createGrid(gridSize, gridDivisions);

  const gridBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);

  // Get attribute location
  const positionAttribLocation = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  const normalAttribLocation = gl.getAttribLocation(
    shaderProgram,
    "aVertexNormal"
  );

  // Bind buffer and assign attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.vertexAttribPointer(
    positionAttribLocation,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.vertexAttribPointer(
    normalAttribLocation,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(normalAttribLocation);

  //Set up viewport and clear color
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(shaderProgram);

  const projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(
    projectionMatrix,
    (45 * Math.PI) / 180, // Field of view in radians
    canvas.width / canvas.height, // Aspect ratio
    0.1, // Near clipping plane
    1000.0 // Far clipping plane
  );

  const viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, [0, 50, 225], [0, -20, 0], [0, 1, 0]);

  const projectionMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "uProjectionMatrix"
  );
  const viewMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "uViewMatrix"
  );

  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

  // Get uniform locations
  const timeScaleLocation = gl.getUniformLocation(shaderProgram, "uTimeScale");
  const amp0Location = gl.getUniformLocation(shaderProgram, "uAmp0");
  const propAng0Location = gl.getUniformLocation(shaderProgram, "uPropAng0");
  const density0Location = gl.getUniformLocation(shaderProgram, "uDensity0");

  // Get slider elements
  const timeScaleSlider = document.getElementById("timeScale");
  const amp0Slider = document.getElementById("amp0");
  const propAng0Slider = document.getElementById("propAng0");
  const density0Slider = document.getElementById("density0");

  // Get value display elements
  const timeScaleValue = document.getElementById("timeScaleValue");
  const amp0Value = document.getElementById("amp0Value");
  const propAng0Value = document.getElementById("propAng0Value");
  const density0Value = document.getElementById("density0Value");

  function updateValueDisplay() {
    timeScaleValue.textContent = timeScaleSlider.value;
    amp0Value.textContent = amp0Slider.value;
    propAng0Value.textContent = propAng0Slider.value;
    density0Value.textContent = density0Slider.value;
  }

  function updateUniforms() {
    gl.uniform1f(timeScaleLocation, parseFloat(timeScaleSlider.value));
    gl.uniform1f(amp0Location, parseFloat(amp0Slider.value));
    gl.uniform1f(propAng0Location, parseFloat(propAng0Slider.value));
    gl.uniform1f(density0Location, parseFloat(density0Slider.value));
  }

  // Add event listeners to sliders

  timeScaleSlider.addEventListener("input", () => {
    updateValueDisplay();
    updateUniforms();
  });

  amp0Slider.addEventListener("input", () => {
    updateValueDisplay();
    updateUniforms();
  });

  propAng0Slider.addEventListener("input", () => {
    updateValueDisplay();
    updateUniforms();
  });

  density0Slider.addEventListener("input", () => {
    updateValueDisplay();
    updateUniforms();
  });

  // Set initial values
  updateValueDisplay();
  updateUniforms();

  // Animation loop
  let startTime = Date.now();

  function render() {
    // Calculate elapsed time
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds

    // Update Timer uniform
    gl.uniform1f(timeScaleLocation, elapsedTime);

    // Clear canvas and draw the grid
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, gridVertices.length / 3);

    // Request the next frame
    requestAnimationFrame(render);
  }

  // Start the animation loop
  render();
}

try {
  initWebGL();
} catch (e) {
  showError(`Uncaught JS exception: ${e}`);
}
