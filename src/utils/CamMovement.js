// utils/cameraMovement.js
import gsap from "gsap";
import * as THREE from "three";

export function moveCameraTo(camera, position, lookAt = null, duration = 2) {
  if (!camera) return;

  // Animate position
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.updateProjectionMatrix();
    }
  });

  // Default lookAt is the same as position
  const target = new THREE.Vector3(
    lookAt?.x ?? position.x,
    lookAt?.y ?? position.y,
    lookAt?.z ?? position.z
  );

  gsap.to({}, {
    duration,
    onUpdate: () => {
      camera.lookAt(target);
    }
  });
}
