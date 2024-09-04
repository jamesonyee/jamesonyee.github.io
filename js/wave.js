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

  // Get uniform locations
  const uniforms = {
    timeScale: gl.getUniformLocation(shaderProgram, "u_timeScale"),
    lightPosition: gl.getUniformLocation(shaderProgram, "u_lightPosition"),
    ka: gl.getUniformLocation(shaderProgram, "u_ka"),
    kd: gl.getUniformLocation(shaderProgram, "u_kd"),
    ks: gl.getUniformLocation(shaderProgram, "u_ks"),
    noiseAmplitude: gl.getUniformLocation(shaderProgram, "u_noiseAmplitude"),
    noiseFrequency: gl.getUniformLocation(shaderProgram, "u_noiseFrequency"),
    amp0: gl.getUniformLocation(shaderProgram, "u_amp0"),
    propAng0: gl.getUniformLocation(shaderProgram, "u_propAng0"),
    density0: gl.getUniformLocation(shaderProgram, "u_density0"),
    amp1: gl.getUniformLocation(shaderProgram, "u_amp1"),
    propAng1: gl.getUniformLocation(shaderProgram, "u_propAng1"),
    density1: gl.getUniformLocation(shaderProgram, "u_density1"),
    phaseShift1: gl.getUniformLocation(shaderProgram, "u_phaseShift1"),
    shininess: gl.getUniformLocation(shaderProgram, "u_shininess"),
  };

  // Set up sliders and update uniforms
  function setupSlider(id, updateFunction) {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(id + "Value");

    slider.addEventListener("input", () => {
      valueDisplay.textContent = slider.value;
      updateFunction(parseFloat(slider.value));
    });

    // Initialize the value
    valueDisplay.textContent = slider.value;
    updateFunction(parseFloat(slider.value));
  }

  setupSlider("timeScale", (value) => {
    gl.uniform1f(uniforms.timeScale, value);
  });

  setupSlider("lightX", (value) => {
    const y = parseFloat(document.getElementById("lightY").value);
    const z = parseFloat(document.getElementById("lightZ").value);
    gl.uniform3f(uniforms.lightPosition, value, y, z);
  });

  setupSlider("lightY", (value) => {
    const x = parseFloat(document.getElementById("lightX").value);
    const z = parseFloat(document.getElementById("lightZ").value);
    gl.uniform3f(uniforms.lightPosition, x, value, z);
  });

  setupSlider("lightZ", (value) => {
    const x = parseFloat(document.getElementById("lightX").value);
    const y = parseFloat(document.getElementById("lightY").value);
    gl.uniform3f(uniforms.lightPosition, x, y, value);
  });

  setupSlider("ka", (value) => {
    gl.uniform1f(uniforms.ka, value);
  });

  setupSlider("kd", (value) => {
    gl.uniform1f(uniforms.kd, value);
  });

  setupSlider("ks", (value) => {
    gl.uniform1f(uniforms.ks, value);
  });

  setupSlider("noiseAmp", (value) => {
    gl.uniform1f(uniforms.noiseAmplitude, value);
  });

  setupSlider("noiseFreq", (value) => {
    gl.uniform1f(uniforms.noiseFrequency, value);
  });

  setupSlider("amp0", (value) => {
    gl.uniform1f(uniforms.amp0, value);
  });

  setupSlider("propAng0", (value) => {
    gl.uniform1f(uniforms.propAng0, value);
  });

  setupSlider("density0", (value) => {
    gl.uniform1f(uniforms.density0, value);
  });

  setupSlider("amp1", (value) => {
    gl.uniform1f(uniforms.amp1, value);
  });

  setupSlider("propAng1", (value) => {
    gl.uniform1f(uniforms.propAng1, value);
  });

  setupSlider("density1", (value) => {
    gl.uniform1f(uniforms.density1, value);
  });

  setupSlider("phaseShift1", (value) => {
    gl.uniform1f(uniforms.phaseShift1, value);
  });

  setupSlider("shininess", (value) => {
    gl.uniform1f(uniforms.shininess, value);
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
