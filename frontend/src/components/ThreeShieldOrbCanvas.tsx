import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeShieldOrbCanvasProps {
  className?: string;
  glowColor?: string;
}

export const ThreeShieldOrbCanvas: React.FC<ThreeShieldOrbCanvasProps> = ({
  className = 'w-full h-full'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Inner Glowing Sphere
    const sphereGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    orbGroup.add(sphereMesh);

    // Outer Torus Ring 1
    const torusGeom1 = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const torusMat1 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      metalness: 0.9
    });
    const torus1 = new THREE.Mesh(torusGeom1, torusMat1);
    torus1.rotation.x = Math.PI / 3;
    orbGroup.add(torus1);

    // Outer Torus Ring 2
    const torusGeom2 = new THREE.TorusGeometry(1.4, 0.015, 16, 100);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.8,
      metalness: 0.9
    });
    const torus2 = new THREE.Mesh(torusGeom2, torusMat2);
    torus2.rotation.y = Math.PI / 4;
    orbGroup.add(torus2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 5, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      orbGroup.rotation.y += 0.008;
      orbGroup.rotation.x += 0.004;

      torus1.rotation.z += 0.01;
      torus2.rotation.z -= 0.012;

      sphereMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 200;
      const h = container.clientHeight || 200;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
};
