import React from 'react';
import Nav from './components/Nav';
import TravelScroll from './components/TravelScroll';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen text-black">
      <Nav />
      <section id="features">
        <TravelScroll />
      </section>
      <HeroSection />
      <FeatureSection />
      <DownloadSection />
      <Footer />
    </div>
  );
}

export default App;
