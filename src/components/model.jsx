/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useMemo } from "react"
import { useGLTF, useTexture, useCursor, useAnimations } from "@react-three/drei"
import { useGraph } from "@react-three/fiber"
import { a, useSpring } from "@react-spring/three"
import { SkeletonUtils } from "three-stdlib"

// eslint-disable-next-line react/prop-types
export default function Model({ pose, ...props }) {
  // Fetch model and a separate texture
  const { scene, animations } = useGLTF("/stacy.glb")
  const texture = useTexture("/stacy.jpg")

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone)

  // Extract animation actions
  const { ref, actions, names } = useAnimations(animations)

  // Hover and animation-index states
  const [hovered, setHovered] = useState(false)
  const [index, setIndex] = useState(pose)
  // Animate the selection halo
  const { color, scale } = useSpring({ scale: hovered ? [1.15, 1.15, 1] : [1, 1, 1], color: hovered ? "hotpink" : "aquamarine" })
  // Change cursor on hover-state
  useCursor(hovered)

  // Change animation when the index changes
  useEffect(() => {
    // Reset and fade in animation after an index has been changed
    actions[names[index]].reset().fadeIn(0.5).play()
    // In the clean-up phase, fade it out
    return () => actions[names[index]].fadeOut(0.5)
  }, [index, actions, names])

  return (
    <group ref={ref} {...props} dispose={null}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setIndex((index + 1) % names.length)}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.01, 0.01, 0.01]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          castShadow
          receiveShadow
          geometry={nodes.stacy.geometry}
          skeleton={nodes.stacy.skeleton}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[100, 100, 100]}>
          <meshStandardMaterial map={texture} map-flipY={false} skinning />
        </skinnedMesh>
      </group>
      <a.mesh receiveShadow position={[0, 1, -1]} scale={scale}>
        <circleBufferGeometry args={[0.6, 64]} />
        <a.meshStandardMaterial color={color} />
      </a.mesh>
    </group>
  )
}
