import * as THREE from 'three'
import { chime } from './audio'

export function createPip3DViewer(container: HTMLElement): { cleanup: () => void; resetView: () => void } {
  const width = container.clientWidth || 360
  const height = container.clientHeight || 300

  // Scene & Camera
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.8, 4.2)
  camera.lookAt(0, 0.2, 0)

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  container.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xfff3e6, 1.4)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffd6aa, 2.0)
  keyLight.position.set(3, 4, 3)
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(0xc8bded, 2.2)
  rimLight.position.set(-3, 2, -2)
  scene.add(rimLight)

  const underGlow = new THREE.PointLight(0xffb74d, 1.5, 6)
  underGlow.position.set(0, -0.6, 1)
  scene.add(underGlow)

  // Master character group
  const pipGroup = new THREE.Group()
  scene.add(pipGroup)

  // 1. Pip's Head (Fluffy sphere with soft skin shader)
  const headGeo = new THREE.SphereGeometry(0.85, 36, 36)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfffcf7,
    roughness: 0.35,
    metalness: 0.05,
  })
  const headMesh = new THREE.Mesh(headGeo, headMat)
  pipGroup.add(headMesh)

  // 2. Amber Glowing Eyes
  const eyeGeo = new THREE.SphereGeometry(0.12, 20, 20)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffb300,
    emissive: 0xff8f00,
    emissiveIntensity: 0.8,
    roughness: 0.1,
  })

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.28, 0.1, 0.76)
  leftEye.scale.set(1, 1.25, 0.5)
  pipGroup.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  rightEye.position.set(0.28, 0.1, 0.76)
  rightEye.scale.set(1, 1.25, 0.5)
  pipGroup.add(rightEye)

  // Eye highlights
  const highlightGeo = new THREE.SphereGeometry(0.04, 12, 12)
  const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const leftHL = new THREE.Mesh(highlightGeo, highlightMat)
  leftHL.position.set(-0.25, 0.16, 0.82)
  pipGroup.add(leftHL)
  const rightHL = new THREE.Mesh(highlightGeo, highlightMat)
  rightHL.position.set(0.31, 0.16, 0.82)
  pipGroup.add(rightHL)

  // 3. Rosy Cheeks
  const cheekGeo = new THREE.SphereGeometry(0.14, 16, 16)
  const cheekMat = new THREE.MeshStandardMaterial({
    color: 0xffa0b4,
    roughness: 0.7,
    transparent: true,
    opacity: 0.85,
  })
  const leftCheek = new THREE.Mesh(cheekGeo, cheekMat)
  leftCheek.position.set(-0.48, -0.12, 0.65)
  leftCheek.scale.set(1.1, 0.7, 0.4)
  pipGroup.add(leftCheek)

  const rightCheek = new THREE.Mesh(cheekGeo, cheekMat)
  rightCheek.position.set(0.48, -0.12, 0.65)
  rightCheek.scale.set(1.1, 0.7, 0.4)
  pipGroup.add(rightCheek)

  // 4. Nightcap
  const capGroup = new THREE.Group()
  const capConeGeo = new THREE.ConeGeometry(0.72, 1.3, 32)
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2b3260,
    roughness: 0.45,
    metalness: 0.1,
  })
  const capCone = new THREE.Mesh(capConeGeo, capMat)
  capCone.position.set(0, 0.65, 0)
  capGroup.add(capCone)

  // Cap trim (fluffy white brim)
  const brimGeo = new THREE.TorusGeometry(0.72, 0.1, 16, 40)
  const brimMat = new THREE.MeshStandardMaterial({
    color: 0xfff0ea,
    roughness: 0.9,
  })
  const brim = new THREE.Mesh(brimGeo, brimMat)
  brim.rotation.x = Math.PI / 2
  capGroup.add(brim)

  // Cap pom-pom
  const pomGeo = new THREE.SphereGeometry(0.15, 20, 20)
  const pomMat = new THREE.MeshStandardMaterial({
    color: 0xffd54f,
    emissive: 0xffb300,
    emissiveIntensity: 0.4,
    roughness: 0.5,
  })
  const pom = new THREE.Mesh(pomGeo, pomMat)
  pom.position.set(0, 1.35, 0)
  capGroup.add(pom)

  capGroup.position.set(0, 0.58, 0)
  capGroup.rotation.z = -0.22
  capGroup.rotation.x = -0.1
  pipGroup.add(capGroup)

  // 5. Pink Satin Bow (tied at the base of the cap)
  const bowGroup = new THREE.Group()
  const bowLoopGeo = new THREE.TorusGeometry(0.16, 0.05, 12, 24)
  const bowMat = new THREE.MeshStandardMaterial({
    color: 0xff7b9c,
    roughness: 0.25,
    metalness: 0.1,
  })
  const leftLoop = new THREE.Mesh(bowLoopGeo, bowMat)
  leftLoop.position.set(-0.16, 0, 0)
  leftLoop.rotation.y = 0.4
  bowGroup.add(leftLoop)

  const rightLoop = new THREE.Mesh(bowLoopGeo, bowMat)
  rightLoop.position.set(0.16, 0, 0)
  rightLoop.rotation.y = -0.4
  bowGroup.add(rightLoop)

  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), bowMat)
  bowGroup.add(bowKnot)

  bowGroup.position.set(0.48, 0.48, 0.6)
  bowGroup.rotation.z = -0.3
  pipGroup.add(bowGroup)

  // 6. Fluffy Cloud Pedestal
  const cloudGroup = new THREE.Group()
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0fa,
    roughness: 0.85,
    transparent: true,
    opacity: 0.9,
  })
  const cloudCoords = [
    [-0.5, -0.85, 0, 0.45],
    [0.5, -0.85, 0, 0.42],
    [0, -0.9, 0.2, 0.5],
    [-0.25, -0.8, -0.3, 0.38],
    [0.3, -0.8, -0.3, 0.4],
  ]
  cloudCoords.forEach(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), cloudMat)
    puff.position.set(x, y, z)
    cloudGroup.add(puff)
  })
  pipGroup.add(cloudGroup)

  // 7. Orbiting Star Particles
  const starCount = 36
  const starGeo = new THREE.BufferGeometry()
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const theta = (i / starCount) * Math.PI * 2
    const radius = 1.3 + Math.sin(i * 3.7) * 0.4
    const y = (Math.sin(i * 2.1) * 0.6)
    starPositions[i * 3] = Math.cos(theta) * radius
    starPositions[i * 3 + 1] = y
    starPositions[i * 3 + 2] = Math.sin(theta) * radius
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({
    color: 0xffd54f,
    size: 0.07,
    transparent: true,
    opacity: 0.85,
  })
  const starsMesh = new THREE.Points(starGeo, starMat)
  scene.add(starsMesh)

  // State & Interactivity
  let isDragging = false
  let prevMouseX = 0
  let prevMouseY = 0
  let targetRotY = 0
  let targetRotX = 0
  let isWinking = false
  let winkProgress = 0

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true
    prevMouseX = e.clientX
    prevMouseY = e.clientY
    container.style.cursor = 'grabbing'
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - prevMouseX
    const deltaY = e.clientY - prevMouseY
    prevMouseX = e.clientX
    prevMouseY = e.clientY

    targetRotY += deltaX * 0.012
    targetRotX += deltaY * 0.008
    targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX))
  }

  const onPointerUp = () => {
    isDragging = false
    container.style.cursor = 'grab'
  }

  container.style.cursor = 'grab'
  container.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)

  // Animation Loop
  let reqId: number
  let clock = new THREE.Clock()

  const animate = () => {
    reqId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()

    // Smooth inertia for rotation
    pipGroup.rotation.y += (targetRotY - pipGroup.rotation.y) * 0.1
    pipGroup.rotation.x += (targetRotX - pipGroup.rotation.x) * 0.1

    // Idle gentle bobbing
    pipGroup.position.y = Math.sin(elapsed * 1.6) * 0.08
    capGroup.rotation.z = -0.22 + Math.sin(elapsed * 2) * 0.04

    // Slow auto-spin when idle and not dragging
    if (!isDragging) {
      targetRotY += 0.003
    }

    // Stars gentle rotation
    starsMesh.rotation.y = elapsed * 0.15

    // Wink animation handler
    if (isWinking) {
      winkProgress += 0.12
      if (winkProgress < Math.PI) {
        const eyeScale = Math.max(0.1, Math.cos(winkProgress))
        rightEye.scale.y = 1.25 * eyeScale
        rightHL.visible = eyeScale > 0.3
      } else {
        isWinking = false
        winkProgress = 0
        rightEye.scale.y = 1.25
        rightHL.visible = true
      }
    }

    renderer.render(scene, camera)
  }

  animate()

  // Resize Observer
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (w > 0 && h > 0) {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
  })
  resizeObserver.observe(container)

  // Public methods
  const resetView = () => {
    targetRotX = 0
    targetRotY = 0
    chime(659)
  }

  const triggerWink = () => {
    if (!isWinking) {
      isWinking = true
      winkProgress = 0
      chime(880)
    }
  }

  // Hook button controls if present in container parent
  const parent = container.parentElement
  const winkBtn = parent?.querySelector('[data-action="pip3d-wink"]')
  const resetBtn = parent?.querySelector('[data-action="pip3d-reset"]')
  const spinBtn = parent?.querySelector('[data-action="pip3d-spin"]')

  winkBtn?.addEventListener('click', triggerWink)
  resetBtn?.addEventListener('click', resetView)
  spinBtn?.addEventListener('click', () => {
    targetRotY += Math.PI * 2
    chime(784)
  })

  return {
    resetView,
    cleanup: () => {
      cancelAnimationFrame(reqId)
      resizeObserver.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    },
  }
}
