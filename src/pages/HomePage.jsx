import Nav from '../components/Nav'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import FeatureSection from '../components/FeatureSection'
import DownloadSection from '../components/DownloadSection'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-black">
      <Nav />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <DownloadSection />
      <Footer />
    </div>
  )
}
