import { MathUtils } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance} from '@react-three/drei'



const particles = Array.from({ length: 150 }, () => ({
factor: MathUtils.randInt(20, 100),
speed: MathUtils.randFloat(0.01, 0.75),
xFactor: MathUtils.randFloatSpread(40),
yFactor: MathUtils.randFloatSpread(10),
zFactor: MathUtils.randFloatSpread(10)
}))


// export default function App() {
// return (
// <Canvas camera={{ position: [0, 0, 1] }}>
// <color attach="background" args={['white']} />
// <fog attach="fog" args={['lightblue', 20, -20]} />
// <ambientLight intensity={1.5} />
// <pointLight position={[10, 10, 10]} castShadow />
// <Bubbles />
// {/* <EffectComposer disableNormalPass>
// <N8AO aoRadius={6} intensity={2} color="red" />
// {/* <TiltShift2 blur={0.1} />
// </EffectComposer> */}
// {/* <Environment preset="studio" /> */}
// </Canvas>
// )
// }


export function Dice() {
const ref = useRef()
useFrame((state, delta) => void (ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 6, 2.75, delta)))
return (
<Instances limit={particles.length} ref={ref} castShadow receiveShadow position={[0, 2.5, 0]}>
<icosahedronGeometry args={[0.5]} />
<meshStandardMaterial roughness={1} color="#D8BFD8" />
{particles.map((data, i) => (
<Die key={i} {...data} />
))}
</Instances>
)
}


function Die({ factor, speed, xFactor, yFactor, zFactor }) {
const ref = useRef()
useFrame((state) => {
const t = factor + state.clock.elapsedTime * (speed / 2)
ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 5))
ref.current.position.set(
Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 4
)
})
return <Instance ref={ref} />
}

export default Dice;
