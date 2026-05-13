import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const InteractiveGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create wireframe globe
    const geometry = new THREE.IcosahedronGeometry(2.5, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add inner sphere
    const innerGeometry = new THREE.IcosahedronGeometry(2.3, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.2
    });

    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    // Add particles around globe
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 3.5 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 6;

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      globe.rotation.y += deltaMove.x * 0.01;
      globe.rotation.x += deltaMove.y * 0.01;
      innerSphere.rotation.y += deltaMove.x * 0.01;
      innerSphere.rotation.x += deltaMove.y * 0.01;
      particles.rotation.y += deltaMove.x * 0.005;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    containerRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (!isDragging) {
        globe.rotation.y += 0.002;
        innerSphere.rotation.y += 0.003;
        particles.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      
      geometry.dispose();
      material.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ cursor: 'grab' }}
    />
  );
};
