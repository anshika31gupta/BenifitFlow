import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCardCanvasProps {
  className?: string;
  cardName?: string;
  cardNumber?: string;
}

export const ThreeCardCanvas: React.FC<ThreeCardCanvasProps> = ({
  className = 'w-full h-full',
  cardName = 'ALEXANDER VAUGHN',
  cardNumber = '•••• •••• •••• 8821'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Card Group
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Card Mesh Geometry
    const cardWidth = 2.8;
    const cardHeight = 1.75;
    const radius = 0.12;

    const shape = new THREE.Shape();
    shape.moveTo(-cardWidth / 2 + radius, -cardHeight / 2);
    shape.lineTo(cardWidth / 2 - radius, -cardHeight / 2);
    shape.quadraticCurveTo(cardWidth / 2, -cardHeight / 2, cardWidth / 2, -cardHeight / 2 + radius);
    shape.lineTo(cardWidth / 2, cardHeight / 2 - radius);
    shape.quadraticCurveTo(cardWidth / 2, cardHeight / 2, cardWidth / 2 - radius, cardHeight / 2);
    shape.lineTo(-cardWidth / 2 + radius, cardHeight / 2);
    shape.quadraticCurveTo(-cardWidth / 2, cardHeight / 2, -cardWidth / 2, cardHeight / 2 - radius);
    shape.lineTo(-cardWidth / 2, -cardHeight / 2 + radius);
    shape.quadraticCurveTo(-cardWidth / 2, -cardHeight / 2, -cardWidth / 2 + radius, -cardHeight / 2);

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Card Body Material (Deep Obsidian Navy with Metal Sheen)
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.85,
      roughness: 0.2,
      envMapIntensity: 1.5,
    });

    const cardMesh = new THREE.Mesh(geometry, cardMaterial);
    cardGroup.add(cardMesh);

    // Gold EMV Chip
    const chipGeom = new THREE.PlaneGeometry(0.35, 0.28);
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x854d0e,
      emissiveIntensity: 0.3
    });
    const chipMesh = new THREE.Mesh(chipGeom, chipMat);
    chipMesh.position.set(-0.8, 0.1, 0.062);
    cardGroup.add(chipMesh);

    // Holographic Stripe Overlay
    const holoGeom = new THREE.PlaneGeometry(2.7, 0.15);
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const holoMesh = new THREE.Mesh(holoGeom, holoMat);
    holoMesh.position.set(0, 0.55, 0.062);
    cardGroup.add(holoMesh);

    // Floating Protection Particles behind card
    const particleCount = 45;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      positions[i * 3 + 2] = -0.5 - Math.random() * 2;

      // Cyan / Blue / Purple mix
      if (i % 3 === 0) {
        colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.96; // Blue
      } else if (i % 3 === 1) {
        colors[i * 3] = 0.3; colors[i * 3 + 1] = 0.87; colors[i * 3 + 2] = 0.64; // Emerald
      } else {
        colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.45; colors[i * 3 + 2] = 0.96; // Purple
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Ambient & Directional Lights for Holographic sheen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 4, 10);
    blueLight.position.set(2, 2, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 3, 10);
    purpleLight.position.set(-2, -2, 3);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 10);
    cyanLight.position.set(0, 3, 2);
    scene.add(cyanLight);

    // Mouse tilt interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.8;
      mouseY = -(y / rect.height) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth interpolation for mouse movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      cardGroup.rotation.y = targetX + Math.sin(Date.now() * 0.001) * 0.08;
      cardGroup.rotation.x = targetY + Math.cos(Date.now() * 0.0012) * 0.05;

      // Particle subtle rotation
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.z += 0.0005;

      // Pulse holo stripe
      holoMat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing" />
      
      {/* HTML Overlay text for ultra-crisp vector typography on top of 3D canvas */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 select-none">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-semibold">
              BENEFITFLOW CENTURION
            </span>
            <p className="text-xs font-semibold text-slate-300">Visa Infinite / Amex Black</p>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase">AI Shield Active</span>
          </div>
        </div>

        <div className="space-y-2 my-auto pl-10">
          <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {cardNumber}
          </p>
        </div>

        <div className="flex justify-between items-end text-xs font-mono">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
            <p className="font-semibold text-slate-200 tracking-wider">{cardName}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-slate-400">Protection Limit</p>
            <p className="font-bold text-emerald-400">₹1,500,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};
