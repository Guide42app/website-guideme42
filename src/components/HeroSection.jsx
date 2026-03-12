import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import tripImg from '../assets/trip.jpg'

export default function HeroSection() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '20%', '0%'])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -top-[25%] -bottom-[25%] min-h-[150%] w-full overflow-hidden"
      >
        <img
          src={tripImg}
          alt=""
          className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center"
        />
      </motion.div>
      {/* Dark transparent overlay */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#059669] font-medium tracking-widest uppercase text-sm mb-4"
          >
            Smarter Trips Start Here
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-4"
          >
            GuideMe42
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto"
          >
            Plan trips, discover places, add trip members, split costs, and share guides—all in one app.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.a
              href="#download"
              className="px-8 py-4 rounded-full bg-[#059669] text-white font-semibold hover:bg-[#047857] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Download App
            </motion.a>
            <motion.a
              href="#features"
              className="px-8 py-4 rounded-full border-2 border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:border-[#059669] hover:text-[#059669] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Features
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="text-xs text-[var(--color-text-muted)]">Scroll</span>
          <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
