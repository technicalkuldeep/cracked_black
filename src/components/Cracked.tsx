// "use client"

// import { useEffect, useRef, useCallback } from "react"

// interface Vector2D {
//   x: number
//   y: number
// }

// class Particle {
//   pos: Vector2D = { x: 0, y: 0 }
//   vel: Vector2D = { x: 0, y: 0 }
//   acc: Vector2D = { x: 0, y: 0 }
//   target: Vector2D = { x: 0, y: 0 }

//   closeEnoughTarget = 100
//   maxSpeed = 1.0
//   maxForce = 0.1
//   particleSize = 10
//   isKilled = false

//   currentColor = { r: 0, g: 0, b: 0 }
//   targetColor = { r: 0, g: 0, b: 0 }
//   colorWeight = 0
//   colorBlendRate = 0.01

//   move() {
//     // Check if particle is close enough to its target to slow down
//     let proximityMult = 1
//     const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2))

//     if (distance < this.closeEnoughTarget) {
//       proximityMult = distance / this.closeEnoughTarget
//     }

//     // Add force towards target
//     const towardsTarget = {
//       x: this.target.x - this.pos.x,
//       y: this.target.y - this.pos.y,
//     }

//     const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
//     if (magnitude > 0) {
//       towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
//       towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
//     }

//     const steer = {
//       x: towardsTarget.x - this.vel.x,
//       y: towardsTarget.y - this.vel.y,
//     }

//     const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
//     if (steerMagnitude > 0) {
//       steer.x = (steer.x / steerMagnitude) * this.maxForce
//       steer.y = (steer.y / steerMagnitude) * this.maxForce
//     }

//     this.acc.x += steer.x
//     this.acc.y += steer.y

//     // Move particle
//     this.vel.x += this.acc.x
//     this.vel.y += this.acc.y
//     this.pos.x += this.vel.x
//     this.pos.y += this.vel.y
//     this.acc.x = 0
//     this.acc.y = 0
//   }

//   draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
//     // Blend towards target color with faster transition
//     if (this.colorWeight < 1.0) {
//       this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
//     }

//     // More vibrant color blending
//     const blendRate = 0.05 // Faster color transitions
//     this.currentColor = {
//       r: Math.round(this.currentColor.r + (this.targetColor.r - this.currentColor.r) * blendRate),
//       g: Math.round(this.currentColor.g + (this.targetColor.g - this.currentColor.g) * blendRate),
//       b: Math.round(this.currentColor.b + (this.targetColor.b - this.currentColor.b) * blendRate),
//     }

//     if (drawAsPoints) {
//       ctx.fillStyle = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`
//       ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
//     } else {
//       ctx.fillStyle = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`
//       ctx.beginPath()
//       ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
//       ctx.fill()
//     }
//   }

//   kill(width: number, height: number) {
//     if (!this.isKilled) {
//       // Set target outside the scene
//       const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2)
//       this.target.x = randomPos.x
//       this.target.y = randomPos.y

//       // Begin blending color to black
//       this.targetColor = { r: 0, g: 0, b: 0 }
//       this.colorWeight = 0

//       this.isKilled = true
//     }
//   }

//   setTarget(x: number, y: number, color: { r: number; g: number; b: number }) {
//     this.target.x = x
//     this.target.y = y
//     this.targetColor = color
//     this.colorWeight = 0
//     this.isKilled = false
//   }

//   private generateRandomPos(x: number, y: number, mag: number): Vector2D {
//     const angle = Math.random() * 2 * Math.PI
//     return {
//       x: x + Math.cos(angle) * mag,
//       y: y + Math.sin(angle) * mag,
//     }
//   }
// }

// interface ParticleTextEffectProps {
//   words?: string[]
// }

// const DEFAULT_WORDS = ["HELLO", "WORLD", "PARTICLES", "TEXT", "EFFECT"]

// export default function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const animationRef = useRef<number>()
//   const particlesRef = useRef<Particle[]>([])
//   const frameCountRef = useRef(0)
//   const wordIndexRef = useRef(0)
//   const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false })
//   const offscreenCanvasRef = useRef<HTMLCanvasElement>()

//   const pixelSteps = 6
//   const drawAsPoints = true
//   const CANVAS_WIDTH = 800
//   const CANVAS_HEIGHT = 400

//   const generateRandomPos = useCallback((x: number, y: number, mag: number): Vector2D => {
//     const angle = Math.random() * 2 * Math.PI
//     return {
//       x: x + Math.cos(angle) * mag,
//       y: y + Math.sin(angle) * mag,
//     }
//   }, [])

//   const getScaledMousePos = useCallback((e: MouseEvent, canvas: HTMLCanvasElement) => {
//     const rect = canvas.getBoundingClientRect()
//     const scaleX = canvas.width / rect.width
//     const scaleY = canvas.height / rect.height
    
//     return {
//       x: (e.clientX - rect.left) * scaleX,
//       y: (e.clientY - rect.top) * scaleY
//     }
//   }, [])

//   const nextWord = useCallback((word: string, canvas: HTMLCanvasElement) => {
//     // Create or reuse off-screen canvas
//     if (!offscreenCanvasRef.current) {
//       offscreenCanvasRef.current = document.createElement("canvas")
//     }
    
//     const offscreenCanvas = offscreenCanvasRef.current
//     offscreenCanvas.width = canvas.width
//     offscreenCanvas.height = canvas.height
//     const offscreenCtx = offscreenCanvas.getContext("2d")!

//     // Clear and draw text
//     offscreenCtx.clearRect(0, 0, canvas.width, canvas.height)
//     offscreenCtx.fillStyle = "white"
//     offscreenCtx.font = "bold 80px Arial"
//     offscreenCtx.textAlign = "center"
//     offscreenCtx.textBaseline = "middle"
//     offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

//     const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
//     const pixels = imageData.data

//     // Generate new color
//     const newColor = {
//       r: Math.floor(Math.random() * 255),
//       g: Math.floor(Math.random() * 255),
//       b: Math.floor(Math.random() * 255),
//     }

//     const particles = particlesRef.current
//     let particleIndex = 0

//     // Collect and shuffle coordinates for smooth animation
//     const coords: { x: number; y: number }[] = []
//     for (let i = 0; i < pixels.length; i += 4) {
//       if (pixels[i + 3] > 128) { // Higher alpha threshold
//         const x = (i / 4) % canvas.width
//         const y = Math.floor(i / 4 / canvas.width)
//         if (x % pixelSteps === 0 && y % pixelSteps === 0) {
//           coords.push({ x, y })
//         }
//       }
//     }

//     // Shuffle for fluid motion
//     for (let i = coords.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1))
//       ;[coords[i], coords[j]] = [coords[j], coords[i]]
//     }

//     // Assign targets to existing particles or create new ones
//     coords.forEach(({ x, y }) => {
//       let particle: Particle

//       if (particleIndex < particles.length) {
//         particle = particles[particleIndex]
//         particle.setTarget(x, y, newColor)
//       } else {
//         particle = new Particle()
        
//         const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
//         particle.pos.x = randomPos.x
//         particle.pos.y = randomPos.y
//         particle.currentColor = { r: 0, g: 0, b: 0 }
//         particle.setTarget(x, y, newColor)
        
//         particle.maxSpeed = Math.random() * 4 + 2
//         particle.maxForce = particle.maxSpeed * 0.05
//         particle.particleSize = Math.random() * 4 + 4
//         particle.colorBlendRate = Math.random() * 0.02 + 0.01
        
//         particles.push(particle)
//       }
//       particleIndex++
//     })

//     // Kill remaining particles
//     for (let i = particleIndex; i < particles.length; i++) {
//       particles[i].kill(canvas.width, canvas.height)
//     }
//   }, [generateRandomPos])

//   const animate = useCallback(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")!
//     const particles = particlesRef.current

//     // Background with motion blur
//     ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
//     ctx.fillRect(0, 0, canvas.width, canvas.height)

//     // Update and draw particles, remove dead ones
//     for (let i = particles.length - 1; i >= 0; i--) {
//       const particle = particles[i]
//       particle.move()
//       particle.draw(ctx, drawAsPoints)

//       // Remove particles that are far off-screen
//       if (particle.isKilled) {
//         const margin = 100
//         if (
//           particle.pos.x < -margin ||
//           particle.pos.x > canvas.width + margin ||
//           particle.pos.y < -margin ||
//           particle.pos.y > canvas.height + margin
//         ) {
//           particles.splice(i, 1)
//         }
//       }
//     }

//     // Handle mouse interaction
//     if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
//       particles.forEach((particle) => {
//         const distance = Math.sqrt(
//           Math.pow(particle.pos.x - mouseRef.current.x, 2) + Math.pow(particle.pos.y - mouseRef.current.y, 2)
//         )
//         if (distance < 50) {
//           particle.kill(canvas.width, canvas.height)
//         }
//       })
//     }

//     // Auto-advance words every 4 seconds (240 frames at 60fps)
//     frameCountRef.current++
//     if (frameCountRef.current % 240 === 0) {
//       wordIndexRef.current = (wordIndexRef.current + 1) % words.length
//       nextWord(words[wordIndexRef.current], canvas)
//     }

//     animationRef.current = requestAnimationFrame(animate)
//   }, [words, nextWord])

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     // Set fixed canvas size
//     canvas.width = CANVAS_WIDTH
//     canvas.height = CANVAS_HEIGHT

//     // Initialize with first word
//     nextWord(words[0], canvas)

//     // Start animation
//     animationRef.current = requestAnimationFrame(animate)

//     // Mouse event handlers with proper scaling
//     const handleMouseDown = (e: MouseEvent) => {
//       const pos = getScaledMousePos(e, canvas)
//       mouseRef.current.isPressed = true
//       mouseRef.current.isRightClick = e.button === 2
//       mouseRef.current.x = pos.x
//       mouseRef.current.y = pos.y
//     }

//     const handleMouseUp = () => {
//       mouseRef.current.isPressed = false
//       mouseRef.current.isRightClick = false
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       const pos = getScaledMousePos(e, canvas)
//       mouseRef.current.x = pos.x
//       mouseRef.current.y = pos.y
//     }

//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault()
//     }

//     canvas.addEventListener("mousedown", handleMouseDown)
//     canvas.addEventListener("mouseup", handleMouseUp)
//     canvas.addEventListener("mousemove", handleMouseMove)
//     canvas.addEventListener("contextmenu", handleContextMenu)

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//       }
//       canvas.removeEventListener("mousedown", handleMouseDown)
//       canvas.removeEventListener("mouseup", handleMouseUp)
//       canvas.removeEventListener("mousemove", handleMouseMove)
//       canvas.removeEventListener("contextmenu", handleContextMenu)
//     }
//   }, [words, nextWord, animate, getScaledMousePos])

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
//       <canvas
//         ref={canvasRef}
//         className="border border-gray-800 rounded-lg shadow-2xl max-w-full h-auto"
//         style={{ 
//           maxWidth: "100%", 
//           height: "auto",
//           imageRendering: "crisp-edges"
//         }}
//       />

//     </div>
//   )
// }