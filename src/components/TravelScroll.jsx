import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 240;

function padZeros(num, places) {
  return String(num).padStart(places, '0');
}

export default function TravelScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [loadedImages, setLoadedImages] = useState(0);
  const imagesRef = useRef([]);
  // Optimization: Keep track of the current drawn frame to avoid redundant draws
  const currentFrameDrawn = useRef(-1);

  // Load all images on mount
  useEffect(() => {
    let loadedCount = 0;
    const preloadImages = async () => {
      const promises = [];
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        promises.push(new Promise((resolve) => {
          const img = new Image();
          img.src = `/guideme42_sequence/${padZeros(i, 5)}.jpg`;
          img.onload = () => {
            imagesRef.current[i] = img;
            loadedCount++;
            setLoadedImages(loadedCount);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load frame ${i}`);
            resolve(); // Resolve anyway to continue
          };
        }));
      }
      await Promise.all(promises);
    };

    preloadImages();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress slightly to prevent jarring jumps
  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 200, mass: 0.2 });

  // Map progress to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Handle Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    let animationFrameId;

    const render = () => {
      // Get the interpolated frame index, round it to the nearest integer
      let targetFrame = Math.round(frameIndex.get());
      // Clamp between 1 and TOTAL_FRAMES
      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, targetFrame));

      if (imagesRef.current[targetFrame] && currentFrameDrawn.current !== targetFrame) {
        const img = imagesRef.current[targetFrame];
        
        // Handle High DPI displays
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Draw image using "cover" – fill full width and height, crop overflow
        const scale = Math.max(width / img.width, height / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const dx = (width - drawWidth) / 2;
        const dy = (height - drawHeight) / 2;

        // Clear and draw
        ctx.fillStyle = "#E8ECEC"; // Base fog color
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

        currentFrameDrawn.current = targetFrame;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger an initial draw when the first image loads
    const initialDrawTimer = setInterval(() => {
       if (imagesRef.current[1] && currentFrameDrawn.current === -1) {
           frameIndex.set(1);
           clearInterval(initialDrawTimer);
       }
    }, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(initialDrawTimer);
    };
  }, [frameIndex]);

  // Resize listener to invalidate drawn frame so it redraws at new dimensions
  useEffect(() => {
    const handleResize = () => {
        currentFrameDrawn.current = -1;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Text Animations mapped to progress
  // 0%
  const opacity0 = useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0]);
  const y0 = useTransform(smoothProgress, [0, 0.05], [0, -20]);

  // 25% (around 60 frames in)
  const opacity1 = useTransform(smoothProgress, [0.15, 0.25, 0.35], [0, 1, 0]);
  const y1 = useTransform(smoothProgress, [0.15, 0.25], [20, 0]);

  // 60% (around 144 frames in)
  const opacity2 = useTransform(smoothProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
  const y2 = useTransform(smoothProgress, [0.5, 0.6], [20, 0]);

  // 90% (around 216 frames in)
  const opacity3 = useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const y3 = useTransform(smoothProgress, [0.8, 0.9], [20, 0]);

  const progressPercent = Math.round((loadedImages / TOTAL_FRAMES) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#E8ECEC] font-sans">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* HTML5 Canvas */}
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Loading State overlay */}
        {loadedImages < Math.min(60, TOTAL_FRAMES) && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#E8ECEC]">
               <div className="w-16 h-16 border-4 border-black/10 border-t-black/80 rounded-full animate-spin mb-4" />
               <p className="text-black/60 font-medium tracking-wide">Loading GuideMe42 experience... {progressPercent}%</p>
            </div>
        )}

        {/* Text Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 px-6 max-w-7xl mx-auto w-full">
            
            {/* 0% – GuideMe42 & tagline on left */}
            <motion.div style={{ opacity: opacity0, y: y0 }} className="absolute inset-0 flex flex-col items-start justify-start pt-[20vh] pl-4 -ml-12 md:pl-4 md:-ml-16">
              <div className="relative -ml-4 -mt-2 pr-8 pt-6 pb-6 pl-6 rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans text-left tracking-tight mb-4" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
                <span className="text-black font-semibold">GuideMe</span><span className="text-[#059669] font-semibold">42</span>
              </h1>
              <p className="text-xl md:text-2xl text-black/70 font-medium tracking-wide text-left max-w-md" style={{ letterSpacing: '0.02em' }}>Plot your path. Pack your bags. Go.</p>
              </div>
            </motion.div>

            {/* 25% Left */}
            <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-start justify-center pl-4 -ml-12 md:pl-4 md:-ml-16 w-full md:w-1/2">
              <div className="relative -ml-4 pr-8 pt-6 pb-6 pl-6 rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-black mb-5" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Your Trip<br/>Begins Here</h2>
                <p className="text-lg md:text-xl text-black/70 font-medium leading-relaxed max-w-sm" style={{ letterSpacing: '0.015em' }}>Dream it. Map it. Live it.</p>
              </div>
            </motion.div>

            {/* 60% Left – top of section */}
            <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex flex-col items-start justify-start pt-[20vh] pl-4 -ml-12 md:pl-4 md:-ml-16 w-full md:w-1/2">
              <div className="relative -ml-4 pr-8 pt-6 pb-6 pl-6 rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-black mb-5 text-left" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Build your own itinerary</h2>
                <p className="text-lg md:text-xl text-black/70 font-medium leading-relaxed max-w-[400px] text-left" style={{ letterSpacing: '0.015em' }}>Day by day, your perfect trip unfolds.</p>
              </div>
            </motion.div>

            {/* 90% Bottom left CTA */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 pl-4 -ml-12 md:pl-4 md:-ml-16 w-full md:w-1/2">
              <div className="relative -ml-4 pr-8 pt-6 pb-6 pl-6 rounded-2xl bg-white/20 backdrop-blur-md border-l-4 border-[#059669] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-black mb-4 text-left" style={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 24px rgba(0,0,0,0.06)' }}>Your Adventure Awaits</h2>
                <p className="text-lg md:text-xl text-black/70 font-medium text-left mb-10" style={{ letterSpacing: '0.015em' }}>Your next adventure starts with one tap.</p>
                
                <div className="pointer-events-auto">
                 <button className="px-10 py-5 bg-black text-white rounded-full font-medium tracking-wide hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/10 flex items-center gap-3 group">
                   <span>Start Planning</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                 </button>
                </div>
              </div>
            </motion.div>

        </div>
      </div>
    </div>
  )
}
