"use client";

import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

// Extend the Three.js namespace to include meshline
extend({ MeshLineGeometry, MeshLineMaterial })

// Type declarations for meshline
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}

// Preload assets
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
useTexture.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')

interface Badge3DProps {
  className?: string;
  debug?: boolean;
  initialPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  initialPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
}

function Band({ maxSpeed = 50, minSpeed = 10, initialPosition = 'top-right' }: BandProps) {
  const band = useRef<THREE.Mesh>(null!)
  const fixed = useRef<any>(null!)
  const j1 = useRef<any>(null!)
  const j2 = useRef<any>(null!)
  const j3 = useRef<any>(null!)
  const card = useRef<any>(null!)
  
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  
  const segmentProps = { 
    type: 'dynamic' as const, 
    canSleep: true, 
    colliders: 'ball' as const, 
    angularDamping: 2, 
    linearDamping: 2 
  }
  
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') as any
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3()
  ]))
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  // Simple positioning that stays within viewport bounds
  const getInitialPosition = () => {
    // Fixed positions that work well across different screen sizes
    const positions = {
      'top-right': [4, 2, 0],
      'top-left': [-5.5, 2, 0],
      'bottom-right': [4, -1.5, 0],
      'bottom-left': [-5.5, -1.5, 0],
      'center-right': [4, 0, 0],
      'center-left': [-4.8, 1, 0]
    }
    
    return positions[initialPosition] || positions['center-right']
  }

  const [initialPos] = useState(() => getInitialPosition())

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.2])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.2])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.2])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ 
        x: vec.x - dragged.x, 
        y: vec.y - dragged.y, 
        z: vec.z - dragged.z 
      })
    }
    
    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      ;[j1, j2, j3].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        }
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      
      // Calculate catmull curve for smooth rope
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      if (band.current && band.current.geometry && 'setPoints' in band.current.geometry) {
        (band.current.geometry as any).setPoints(curve.getPoints(64))
      }
      
      // Tilt it back towards the screen
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[initialPos[0], initialPos[1] + 4, initialPos[2]]}>
        <RigidBody ref={fixed} type="fixed" canSleep={true} colliders={false} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} type="dynamic" canSleep={true} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} type="dynamic" canSleep={true} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} type="dynamic" canSleep={true} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          canSleep={true} 
          colliders={false}
          angularDamping={2}
          linearDamping={2}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial 
                map={materials.base.map} 
                map-anisotropy={16} 
                clearcoat={1} 
                clearcoatRoughness={0.15} 
                roughness={0.3} 
                metalness={0.5} 
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <primitive object={new MeshLineGeometry()} attach="geometry" />
        <primitive 
          object={new MeshLineMaterial({
            color: "white",
            resolution: new THREE.Vector2(width, height),
            useMap: 1,
            map: texture,
            repeat: new THREE.Vector2(-3, 1),
            lineWidth: 2,
            opacity: 0.9
          })} 
          attach="material"
        />
      </mesh>
    </>
  )
}

function Scene({ debug, initialPosition }: { debug: boolean, initialPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left' }) {
  return (
    <>
      <ambientLight intensity={Math.PI} />
      <Physics debug={debug} interpolate gravity={[0, -40, 0]} timeStep={1 / 120}>
        <Band initialPosition={initialPosition} />
      </Physics>
      <Environment background={false} blur={0.75}>
        <Lightformer 
          intensity={2} 
          color="white" 
          position={[0, -1, 5]} 
          rotation={[0, 0, Math.PI / 3]} 
          scale={[100, 0.1, 1]} 
        />
        <Lightformer 
          intensity={3} 
          color="white" 
          position={[-1, -1, 1]} 
          rotation={[0, 0, Math.PI / 3]} 
          scale={[100, 0.1, 1]} 
        />
        <Lightformer 
          intensity={3} 
          color="white" 
          position={[1, 1, 1]} 
          rotation={[0, 0, Math.PI / 3]} 
          scale={[100, 0.1, 1]} 
        />
        <Lightformer 
          intensity={10} 
          color="white" 
          position={[-10, 0, 14]} 
          rotation={[0, Math.PI / 2, Math.PI / 3]} 
          scale={[100, 10, 1]} 
        />
      </Environment>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-black">
      <div className="text-white/60">Loading 3D Badge...</div>
    </div>
  )
}

export default function Badge3D({ className = "", debug = false, initialPosition = 'top-right' }: Badge3DProps) {
  return (
    <div className={`w-full h-full ${className}`} style={{ pointerEvents: 'auto' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          camera={{ position: [0, 0, 13], fov: 25 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true }}
        >
          <Scene debug={debug} initialPosition={initialPosition} />
        </Canvas>
      </Suspense>
    </div>
  )
}
