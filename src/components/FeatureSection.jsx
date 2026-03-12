import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const features = [
  {
    title: 'Trip Planning',
    description: 'Build your itinerary day by day. Add destinations, activities, and notes in one place.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Discover Places',
    description: 'Find recommendations and hidden gems. Get local insights and curated spots for every destination.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Add Trip Members',
    description: 'Invite friends and family. Collaborate on itineraries and plan together in real time.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Split Costs',
    description: 'Track expenses and split bills fairly. No more awkward math at the end of a trip.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Share Guides',
    description: 'Export and share your trips. Create beautiful guides for others to follow.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function FeatureSection() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const sectionY = useTransform(scrollYProgress, [0, 0.35], [80, 0])
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25], [0.4, 1])
  const sectionScale = useTransform(scrollYProgress, [0, 0.3], [0.96, 1])

  return (
    <motion.section
      ref={sectionRef}
      id="features-section"
      style={{ y: sectionY, opacity: sectionOpacity, scale: sectionScale }}
      className="relative py-24 px-6 rounded-t-3xl overflow-hidden"
    >
      {/* Background with subtle gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[var(--color-bg)] to-[var(--color-bg)]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[#059669] font-medium text-sm tracking-wider uppercase mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-6">
            Everything you need
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Plan trips, discover places, split costs, and share guides—all in one app.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--color-border)] shadow-lg shadow-black/[0.03] hover:shadow-xl hover:shadow-[#059669]/10 hover:border-[#059669]/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#059669] to-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#059669]/15 to-[#059669]/5 text-[#059669] mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
