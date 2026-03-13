import { lazy, Suspense } from 'react'
import Nav from '../components/Nav'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import DownloadSection from '../components/DownloadSection'
import Footer from '../components/Footer'

const FeatureSection = lazy(() => import('../components/FeatureSection'))

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-black">
      <Nav />
      <HeroSection />
      <AboutSection />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#059669]/30 border-t-[#059669] rounded-full animate-spin" /></div>}>
        <FeatureSection />
      </Suspense>
      <DownloadSection />
      <Footer />
    </div>
  )
}
