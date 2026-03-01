'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Suncream (Tube from Image 2)
// Rounded cap at the bottom, flattened body tapering up.
function SuncreamModel(props: ThreeElements['group']) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={meshRef} {...props} dispose={null}>
      {/* Cap of the suncream (bottom) */}
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.5, 32]} />
        <meshStandardMaterial 
          color="#DCA58C" // Metallic Rose Gold
          roughness={0.15} 
          metalness={0.8} 
          envMapIntensity={2}
        />
      </mesh>
      {/* Body of the suncream tube */}
      <mesh position={[0, 0.25, 0]} scale={[1, 1, 0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.36, 2.0, 32]} />
        <meshStandardMaterial 
          color="#6B1C28" // Matte Burgundy
          roughness={0.3} 
          metalness={0.2} 
        />
      </mesh>
    </group>
  );
}

// 2. Sunstick (Cylinder from Image 1)
// Tall cap, thin rose gold ring, tall body.
function SunstickModel(props: ThreeElements['group']) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + Math.PI) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * -0.15;
    }
  });

  return (
    <group ref={meshRef} {...props} dispose={null}>
      {/* Cap (Top) */}
      <mesh position={[0, 0.625, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.2, 32]} />
        <meshStandardMaterial 
          color="#6B1C28" // Satin Burgundy
          roughness={0.25} 
          metalness={0.3} 
        />
      </mesh>
      {/* Ring (Middle) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.39, 0.39, 0.05, 32]} />
        <meshStandardMaterial 
          color="#DCA58C" // Metallic Rose Gold
          roughness={0.1} 
          metalness={0.9} 
          envMapIntensity={2}
        />
      </mesh>
      {/* Body (Bottom) */}
      <mesh position={[0, -0.625, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.2, 32]} />
        <meshStandardMaterial 
          color="#6B1C28" // Satin Burgundy
          roughness={0.25} 
          metalness={0.3} 
        />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />
      
      {/* The products */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
        <SuncreamModel position={[-1.5, 0.5, 0]} rotation={[0.2, 0.5, 0]} />
      </Float>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
        <SunstickModel position={[1.5, 0, 0]} rotation={[0.1, -0.4, 0.1]} />
      </Float>

      {/* Realistic shadow on the floor */}
      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.7} 
        scale={10} 
        blur={2} 
        far={4} 
      />
      
      {/* Environment map for luxurious metal reflections */}
      <Environment preset="city" />
      
      {/* Allowing user to partially interact with the scene but keep it constrained */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </Canvas>
  );
}
