import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import guideme42icon from '../assets/guideme42icon.png'

const links = [
  { href: '#features-section', label: 'Features' },
  { href: '#download', label: 'Download' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-transparent">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2"
        >
          <img src={guideme42icon} alt="GuideMe42" className="h-9 w-9 md:h-10 md:w-10 object-cover rounded-full" />
          <span className="text-xl font-semibold tracking-tight"><span className="text-black">GuideMe</span><span className="text-[#059669]">42</span></span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={
                l.label === 'Download'
                  ? 'px-4 py-2 rounded-full bg-[#059669] text-white font-medium text-sm hover:bg-[#047857] transition-colors'
                  : 'text-[var(--color-text-secondary)] hover:text-[#059669] font-medium text-sm transition-colors'
              }
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="md:hidden w-10 h-10 flex flex-col justify-center gap-1.5"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className={`block h-0.5 bg-black transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 bg-black transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-black transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 flex flex-col gap-4 pb-4"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={
                  l.label === 'Download'
                    ? 'px-4 py-2 rounded-full bg-[#059669] text-white font-medium hover:bg-[#047857] transition-colors inline-block'
                    : 'text-[var(--color-text-secondary)] hover:text-[#059669] font-medium'
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
