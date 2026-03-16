import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, motion, useSpring } from 'framer-motion'
import guideme42icon from '../assets/guideme42icon.png'

const TOTAL_FRAMES = 240
const MIN_FRAMES_TO_SHOW = 5

function padZeros(num, places) {
  return String(num).padStart(places, '0')
}

export default function HeroSection() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [loadedImages, setLoadedImages] = useState(0)
  const imagesRef = useRef([])
  const currentFrameDrawn = useRef(-1)

  // Load first few frames immediately so we can show the hero; preload the rest in background
  useEffect(() => {
    const loadFrame = (i) =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = `/guideme42_sequence/${padZeros(i, 5)}.jpg`
        img.onload = () => {
          imagesRef.current[i] = img
          setLoadedImages((c) => c + 1)
          resolve()
        }
        img.onerror = () => resolve()
      })

    const preloadImages = async () => {
      // Load first MIN_FRAMES_TO_SHOW frames so hero can show quickly
      for (let i = 1; i <= MIN_FRAMES_TO_SHOW; i++) {
        await loadFrame(i)
      }
      // Preload the rest in background (no await) so animation is smooth as user scrolls
      for (let i = MIN_FRAMES_TO_SHOW + 1; i <= TOTAL_FRAMES; i++) {
        loadFrame(i)
      }
    }
    preloadImages()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 200, mass: 0.2 })
  const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !ctx) return

    let animationFrameId
    const render = () => {
      let targetFrame = Math.round(frameIndex.get())
      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, targetFrame))

      if (imagesRef.current[targetFrame] && currentFrameDrawn.current !== targetFrame) {
        const img = imagesRef.current[targetFrame]
        const width = canvas.clientWidth || window.innerWidth || 300
        const height = canvas.clientHeight || window.innerHeight || 500
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const bufferWidth = Math.round(width * dpr)
        const bufferHeight = Math.round(height * dpr)
        if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
          canvas.width = bufferWidth
          canvas.height = bufferHeight
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        // On small devices, draw image at reduced width/height (0.6 at 320px → 1 at 768px+)
        const isSmall = width < 768 || height < 500
        const sizeFactor = isSmall
          ? Math.min(1, Math.max(0.6, 0.6 + (Math.min(width, height) - 320) / 600))
          : 1
        const targetW = width * sizeFactor
        const targetH = height * sizeFactor
        const scale = Math.max(targetW / img.width, targetH / img.height)
        const drawWidth = img.width * scale
        const drawHeight = img.height * scale
        const dx = (width - drawWidth) / 2
        const dy = (height - drawHeight) / 2
        ctx.fillStyle = '#E8ECEC'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight)
        currentFrameDrawn.current = targetFrame
      }
      animationFrameId = requestAnimationFrame(render)
    }
    render()
    const initialDrawTimer = setInterval(() => {
      if (imagesRef.current[1] && currentFrameDrawn.current === -1) {
        frameIndex.set(1)
        clearInterval(initialDrawTimer)
      }
    }, 100)
    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(initialDrawTimer)
    }
  }, [frameIndex])

  useEffect(() => {
    const invalidate = () => { currentFrameDrawn.current = -1 }
    window.addEventListener('resize', invalidate)
    const container = containerRef.current
    const canvas = canvasRef.current
    const ro = new ResizeObserver(invalidate)
    if (container) ro.observe(container)
    if (canvas) ro.observe(canvas)
    return () => {
      window.removeEventListener('resize', invalidate)
      ro.disconnect()
    }
  }, [])

  const opacity0 = useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0])
  const y0 = useTransform(smoothProgress, [0, 0.05], [0, -20])
  const opacity1 = useTransform(smoothProgress, [0.15, 0.25, 0.35], [0, 1, 0])
  const y1 = useTransform(smoothProgress, [0.15, 0.25], [20, 0])
  const opacity2 = useTransform(smoothProgress, [0.5, 0.6, 0.7], [0, 1, 0])
  const y2 = useTransform(smoothProgress, [0.5, 0.6], [20, 0])
  const opacity3 = useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1])
  const y3 = useTransform(smoothProgress, [0.8, 0.9], [20, 0])
  const progressPercent = Math.round((loadedImages / TOTAL_FRAMES) * 100)

  return (
    <div ref={containerRef} id="hero" className="relative w-full h-[350vh] md:h-[500vh] bg-[#E8ECEC] font-sans">
      <div className="sticky top-0 left-0 right-0 w-full min-h-screen h-[100dvh] sm:h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        {loadedImages < MIN_FRAMES_TO_SHOW && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#E8ECEC]">
            <div className="w-16 h-16 border-4 border-black/10 border-t-black/80 rounded-full animate-spin mb-4" />
            <p className="text-black/60 font-medium tracking-wide">Loading GuideMe42 experience... {progressPercent}%</p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none z-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
          <motion.div style={{ opacity: opacity0, y: y0 }} className="absolute inset-0 flex flex-col items-start justify-start pt-[10vh] sm:pt-[16vh] md:pt-[18vh] lg:pt-[20vh] pl-2 pr-3 sm:pl-4 md:pl-6 lg:pl-4 lg:-ml-16">
            <div className="relative -mt-2 sm:-ml-4 pr-3 sm:pr-8 pt-3 sm:pt-6 pb-3 sm:pb-6 pl-3 sm:pl-6 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-[95vw]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-sans text-left tracking-tight mb-2 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
                <img src={guideme42icon} alt="" className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 object-cover rounded-full shrink-0" />
                <span><span className="text-black font-semibold">GuideMe</span><span className="text-[#059669] font-semibold">42</span></span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 font-medium tracking-wide text-left max-w-md" style={{ letterSpacing: '0.02em' }}>Plot your path. Pack your bags. Go.</p>
            </div>
          </motion.div>
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-start justify-center pl-2 pr-3 sm:pl-4 md:pl-6 lg:pl-4 lg:-ml-16 w-full lg:w-1/2">
            <div className="relative sm:-ml-4 pr-3 sm:pr-8 pt-3 sm:pt-6 pb-3 sm:pb-6 pl-3 sm:pl-6 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-[95vw]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-sans font-semibold tracking-tight text-black mb-3 sm:mb-5" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Your Trip<br/>Begins Here</h2>
              <p className="text-base sm:text-lg md:text-lg lg:text-xl text-black/70 font-medium leading-relaxed max-w-sm" style={{ letterSpacing: '0.015em' }}>Dream it. Map it. Live it.</p>
            </div>
          </motion.div>
          <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex flex-col items-start justify-start pt-[10vh] sm:pt-[16vh] md:pt-[18vh] lg:pt-[20vh] pl-2 pr-3 sm:pl-4 md:pl-6 lg:pl-4 lg:-ml-16 w-full lg:w-1/2">
            <div className="relative sm:-ml-4 pr-3 sm:pr-8 pt-3 sm:pt-6 pb-3 sm:pb-6 pl-3 sm:pl-6 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-[95vw]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-sans font-semibold tracking-tight text-black mb-3 sm:mb-5 text-left" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Build your own itinerary</h2>
              <p className="text-base sm:text-lg md:text-lg lg:text-xl text-black/70 font-medium leading-relaxed max-w-[400px] text-left" style={{ letterSpacing: '0.015em' }}>Day by day, your perfect trip unfolds.</p>
            </div>
          </motion.div>
          <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex flex-col items-start justify-end pb-4 sm:pb-8 md:pb-10 lg:pb-12 pl-2 pr-3 sm:pl-4 md:pl-6 lg:pl-4 lg:-ml-16 w-full lg:w-1/2">
            <div className="relative sm:-ml-4 pr-3 sm:pr-8 pt-3 sm:pt-6 pb-3 sm:pb-6 pl-3 sm:pl-6 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-[95vw]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-sans font-semibold tracking-tight text-black mb-3 sm:mb-4 text-left" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Your Adventure Awaits</h2>
              <p className="text-base sm:text-lg md:text-lg lg:text-xl text-black/70 font-medium text-left mb-4 sm:mb-6 lg:mb-10" style={{ letterSpacing: '0.015em' }}>Your next adventure starts with one tap.</p>
              <div className="pointer-events-auto">
                <a href="#download" className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-base bg-black text-white rounded-full font-medium tracking-wide hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 group">
                  <span>Start Planning</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
