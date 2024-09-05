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

async function initWebGL() {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) {
    console.error("WebGL 2 not supported in this browser.");
    document.body.innerHTML =
      '<p style="color: white;">WebGL 2 is not supported by your browser.</p>';
    return;
  }

  const vertexShaderUrl = "shaders/waveVertex.glsl";
  const fragmentShaderUrl = "shaders/waveFrag.glsl";

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

  gl.useProgram(shaderProgram);

  // Get slider elements
  const amp0Slider = document.getElementById("amp0");
  const propAng0Slider = document.getElementById("propAng0");
  const density0Slider = document.getElementById("density0");

  // Get value display elements
  const amp0Value = document.getElementById("amp0Value");
  const propAng0Value = document.getElementById("propAng0Value");
  const density0Value = document.getElementById("density0Value");

  // Update value display elements
  function updateValueDisplay() {
    amp0Value.textContent = amp0Slider.value;
    propAng0Value.textContent = propAng0Slider.value;
    density0Value.textContent = density0Slider.value;
  }

  // Initialize value display
  updateValueDisplay();

  // WebGL uniform locations
  const amp0Location = gl.getUniformLocation(program, "uAmp0");
  const propAng0Location = gl.getUniformLocation(program, "uPropAng0");
  const density0Location = gl.getUniformLocation(program, "uDensity0");

  // Update uniforms
  function updateUniforms() {
    gl.uniform1f(amp0Location, parseFloat(amp0Slider.value));
    gl.uniform1f(propAng0Location, parseFloat(propAng0Slider.value));
    gl.uniform1f(density0Location, parseFloat(density0Slider.value));
  }

  // Add event listeners to sliders
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

  // Initialize the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Initialize buffers and attributes
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const vertices = new Float32Array([
    // X, Y, Z
    -0.5,
    0.0,
    -0.5, // Bottom-left
    0.5,
    0.0,
    -0.5, // Bottom-right
    -0.5,
    0.0,
    0.5, // Top-left

    0.5,
    0.0,
    -0.5, // Bottom-right
    0.5,
    0.0,
    0.5, // Top-right
    -0.5,
    0.0,
    0.5, // Top-left
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position"
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Handle window resizing
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  // Start rendering loop
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update uniforms if necessary
    // Draw the scene
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    requestAnimationFrame(render);
  }
  render();
}

window.onload = initWebGL;
