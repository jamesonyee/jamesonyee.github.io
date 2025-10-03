import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import './button.css';

import { moveCameraTo } from '../../utils/CamMovement';

function GalaxyButton({ 
    galaxyRef, 
    camera, 
    renderer, 
    position = { x: 0, y: 0, z: 0 }, // Position relative to galaxy
    label = "Button",
    modalType
}) {
    const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [worldPosition, setWorldPosition] = useState(new THREE.Vector3());
    
    const handleClick = () => {
        console.log('Button clicked, modal type:', modalType);
        
        if (window.openModal) {
            window.openModal(modalType);
        }
        
        //moveCameraTo(camera, position, { x: 0, y: 0, z: 0 });
    };

    const updateButtonPosition = useCallback(() => {
        if (!galaxyRef?.current || !camera || !renderer) return;

        try {
            // Use the provided position prop
            const localPosition = new THREE.Vector3(position.x, position.y, position.z);
            const worldPos = new THREE.Vector3();
            galaxyRef.current.localToWorld(worldPos.copy(localPosition));
            setWorldPosition(worldPos);
            
            const vector = worldPos.clone();
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
            const y = (-(vector.y * 0.5 + 0.5) + 1) * renderer.domElement.clientHeight;
            
            setScreenPosition({ x, y });
            
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            const toButton = worldPos.clone().sub(camera.position).normalize();
            const dotProduct = cameraDirection.dot(toButton);
            
            setIsVisible(dotProduct > 0 && vector.z < 1);

        } catch (error) {
            console.error('Error updating button position:', error);
        }
    }, [galaxyRef, camera, renderer, position.x, position.y, position.z]);

    useEffect(() => {
        // Register this button's update function with a unique identifier
        const updaterId = `button-updater-${position.x}-${position.y}-${position.z}`;
        
        if (!window.uiButtonUpdaters) {
            window.uiButtonUpdaters = new Map();
        }
        
        window.uiButtonUpdaters.set(updaterId, updateButtonPosition);
        
        // Global function to update all buttons
        window.updateUIButtons = () => {
            if (window.uiButtonUpdaters) {
                window.uiButtonUpdaters.forEach(updater => updater());
            }
        };

        // Initial update
        updateButtonPosition();

        const handleResize = () => {
            updateButtonPosition();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (window.uiButtonUpdaters) {
                window.uiButtonUpdaters.delete(updaterId);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [updateButtonPosition, position.x, position.y, position.z]);

    if (!isVisible) return null;

    return (
        <button 
            className={`galaxy-button`}
            style={{
                left: `${screenPosition.x}px`,
                top: `${screenPosition.y}px`,
                transform: 'translate(-50%, -50%)',
            }}
            onClick={handleClick}
            title={`3D Position: ${worldPosition.x.toFixed(1)}, ${worldPosition.y.toFixed(1)}, ${worldPosition.z.toFixed(1)}`}
        >
            {label}
        <div className="scan-line"></div>
        </button>
    );
}

export default GalaxyButton;