'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// 1. Suncream (Squeezy Tube - Right object in photo)
function SuncreamModel(props: ThreeElements['group']) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  // Custom flattened tube geometry
  const tubeGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 64, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const x = pos.getX(i);
        
        // Map y from -0.9 (bottom) to 0.9 (top)
        const t = (y + 0.9) / 1.8;
        
        // At bottom (t=0), normal cylinder. At top (t=1), flattened and slightly wider.
        // Ease in the flattening so the bottom stays mostly round
        const ease = Math.pow(t, 1.5);
        
        const zMult = 1 - (ease * 0.92); // Flatten depth to 8% at top
        const xMult = 1 + (ease * 0.3);  // Widen by 30% at top
        
        pos.setZ(i, z * zMult);
        pos.setX(i, x * xMult);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Top crimp geometry
  const crimpGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.95, 0.15, 0.05);
    return geo;
  }, []);

  return (
    <group ref={meshRef} {...props} dispose={null}>
      {/* Cap (Bottom) */}
      <mesh position={[0, -1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.35, 0.4, 32]} />
        <meshStandardMaterial color="#DCA58C" roughness={0.15} metalness={0.8} envMapIntensity={2.5} />
      </mesh>

      {/* Body (Middle) */}
      <mesh position={[0, 0, 0]} geometry={tubeGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#5A001C" roughness={0.25} metalness={0.1} />
      </mesh>
      
      {/* Top Crimp */}
      <mesh position={[0, 0.95, 0]} geometry={crimpGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#DCA58C" roughness={0.2} metalness={0.9} envMapIntensity={2} />
      </mesh>

      {/* Labels */}
      <group position={[0, 0, 0.2]}>
        <Text position={[0, 0.3, 0]} fontSize={0.15} color="#DCA58C" font="/fonts/PlayfairDisplay-Bold.ttf" anchorX="center" anchorY="middle" outlineWidth={0.002} outlineColor="#DCA58C">
          KNK
        </Text>
        <Text position={[0, -0.1, 0]} fontSize={0.06} color="#E0BFB8" font="/fonts/PlayfairDisplay-Regular.ttf" anchorX="center" anchorY="middle" letterSpacing={0.05} maxWidth={0.6} textAlign="center">
          AFTER-RAY
        </Text>
        <Text position={[0, -0.22, 0]} fontSize={0.05} color="#E0BFB8" font="/fonts/PlayfairDisplay-Regular.ttf" anchorX="center" anchorY="middle" maxWidth={0.6} textAlign="center">
          Tone-Up{"\n"}Protection Sun
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.035} color="#E0BFB8" font="/fonts/PlayfairDisplay-Regular.ttf" anchorX="center" anchorY="middle" letterSpacing={0.1}>
          SPF 50+ PA++++
        </Text>
      </group>
    </group>
  );
}

// 2. Sunstick (Cylindrical Bottle - Left object in photo)
function SunstickModel(props: ThreeElements['group']) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + Math.PI) * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * -0.12;
    }
  });

  return (
    <group ref={meshRef} {...props} dispose={null}>
      {/* Cap (Top) */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.7, 32]} />
        <meshStandardMaterial color="#DCA58C" roughness={0.15} metalness={0.8} envMapIntensity={2.5} />
      </mesh>
      
      {/* Ring (Divider) */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.345, 0.345, 0.06, 32]} />
        <meshStandardMaterial color="#E0BFB8" roughness={0.1} metalness={0.9} envMapIntensity={3} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 1.25, 32]} />
        <meshStandardMaterial color="#5A001C" roughness={0.25} metalness={0.1} />
      </mesh>
      
      {/* Base (Bottom) */}
      <mesh position={[0, -1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.15, 32]} />
        <meshStandardMaterial color="#DCA58C" roughness={0.15} metalness={0.8} envMapIntensity={2.5} />
      </mesh>

      {/* Labels */}
      <group position={[0, -0.45, 0.341]}>
        <Text position={[0, 0.3, 0]} fontSize={0.15} color="#DCA58C" font="/fonts/PlayfairDisplay-Bold.ttf" anchorX="center" anchorY="middle" outlineWidth={0.002} outlineColor="#DCA58C">
          KNK
        </Text>
        <Text position={[0, -0.2, 0]} fontSize={0.05} color="#E0BFB8" font="/fonts/PlayfairDisplay-Regular.ttf" anchorX="center" anchorY="middle" letterSpacing={0.05} maxWidth={0.5} textAlign="center">
          Ampoule Treatment
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.035} color="#E0BFB8" font="/fonts/PlayfairDisplay-Regular.ttf" anchorX="center" anchorY="middle">
          30ml / 1.0 fl oz.
        </Text>
      </group>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8.5], fov: 40 }}>
      {/* Transparent background so HTML background color comes through */}
      <color attach="background" args={['transparent']} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#E0BFB8" />
      <spotLight position={[0, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
      
      {/* The products */}
      {/* Sunstick (Left) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
        <SunstickModel position={[-1.2, 0.2, 0]} rotation={[0.05, 0.3, -0.05]} />
      </Float>
      
      {/* Suncream (Right) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <SuncreamModel position={[1.2, 0.2, 0]} rotation={[0.1, -0.2, 0.05]} />
      </Float>

      {/* Realistic soft shadow on the floor */}
      <ContactShadows position={[0, -2.0, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
      
      {/* Environment map for luxurious metal reflections - studio provides clean, sharp lighting */}
      <Environment preset="studio" />
      
      {/* Allowing user to interact slightly */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 2.2} 
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
    </Canvas>
  );
}
