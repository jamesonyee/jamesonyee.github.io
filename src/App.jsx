import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

import GalaxyButton from './components/Modal/Button'
import Controls from './components/overlay/controls'
import ModalContainer from './components/Modal/ModalContainer';
import Links from './components/overlay/socials';'./components/HUD/socials'

import './App.css'

function App() {
  const galaxyRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const [hdrLoaded, setHdrLoaded] = useState(false);
  const [galaxyLoaded, setGalaxyLoaded] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 512, 1024);
    cameraRef.current = camera;

    const canvas = document.getElementById('ThreeCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1,
      0.5,
      0.5
    );
    composer.addPass(bloomPass);

    const controls = new OrbitControls(camera, renderer.domElement);

    // HDR
    const background = new HDRLoader();
    background.load('/HDR/HDR_stars_4k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        setHdrLoaded(true);
      }
    );

    // GLTF
    const loader = new GLTFLoader();
    loader.load('/models/galaxy.glb',
      (gltf) => {
        gltf.scene.scale.set(32, 32, 32);
        scene.add(gltf.scene);
        galaxyRef.current = gltf.scene;
        setGalaxyLoaded(true);
      }
    );

    const animate = () => {
      controls.update();

      if (galaxyRef.current) {
        galaxyRef.current.rotation.y += 0.0005;
        if (window.updateUIButtons) window.updateUIButtons();
      }

      composer.render();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  
  useEffect(() => {
    if (hdrLoaded && galaxyLoaded) {
      setIsSceneReady(true);
    }
  }, [hdrLoaded, galaxyLoaded]);

  return (
    <div>
  <canvas id="ThreeCanvas" />
  {!isSceneReady && (
    <div className="loading-overlay">
      <p className="typewriter-text">Initializing Star systems...</p>
    </div>
  )}

  {isSceneReady && showStartScreen && (
    <div className="loading-overlay">
      <p className="welcome-text">
        <span className="highlight">Jameson's</span> Universe awaits!
      </p>
      <button 
        onClick={() => setShowStartScreen(false)}
        className="enter-btn"
      >
        Launch
      </button>
    </div>
      )}
      
      {isSceneReady && !showStartScreen && cameraRef.current && rendererRef.current && (
        <>
          <Controls />
          <GalaxyButton
            galaxyRef={galaxyRef}
            camera={cameraRef.current}
            renderer={rendererRef.current}
            position={{ x: 0, y: 0, z: -13 }}
            label="Background"
            modalType="about"
          />
          
          <GalaxyButton 
            galaxyRef={galaxyRef} 
            camera={cameraRef.current} 
            renderer={rendererRef.current} 
            position={{ x: -13, y: 0, z: 5}} 
            label="Skills" 
            modalType={"skills"} 
          />
          
          <GalaxyButton 
            galaxyRef={galaxyRef} 
            camera={cameraRef.current} 
            renderer={rendererRef.current} 
            position={{ x: 12, y: 0, z: 5 }} // Diagonal 
            label="Portfolio" 
            modalType={"portfolio"} 
          />

          <ModalContainer />
          <Links />
        </>
      )}
    </div>
  );
}


export default App;