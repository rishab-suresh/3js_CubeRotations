import { Canvas, useFrame } from "@react-three/fiber";

import { useRef, useState } from "react";

function Box(props) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [click, setClicked] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
  });
  return (
    <mesh
      {...props}
      ref={ref}
      scale={click ? 1.5 : 1}
      onClick={() => setClicked(!click)}
      onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "pink" : "blue"} />
    </mesh>
  );
}
function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={0.3}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}

export default App;
