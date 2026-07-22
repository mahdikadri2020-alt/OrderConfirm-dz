import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, X } from 'lucide-react';
import DashboardPreview from './DashboardPreview';
import MobileDashboardPreview from './MobileDashboardPreview';

export default function Hero({ onOpenAuth, onGoToApp }) {
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  return (
    <div id="hero" className="relative w-full flex-1 flex flex-col items-center justify-between pt-3 sm:pt-6 pb-6 sm:pb-12 px-3 sm:px-6 md:px-8 overflow-hidden z-10">
      {/* Background Video (Fullscreen muted loop) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 scale-105"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft gradient overlay to ensure perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Hero content container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto">
        {/* 1. Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2.5 sm:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 backdrop-blur px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm text-muted-foreground font-body shadow-xs text-center max-w-[92vw] truncate">
            <span>Maintenant avec support n8n & WhatsApp</span>
            <span className="text-amber-500 shrink-0">✨</span>
          </div>
        </motion.div>

        {/* 2. Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-display text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] sm:leading-[1.02] md:leading-[0.95] tracking-tight text-foreground max-w-4xl px-1 sm:px-0"
        >
          La confirmation de commande <span className="font-display italic text-accent font-normal">intelligente</span> par WhatsApp
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2.5 sm:mt-5 text-center text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-body px-1 sm:px-0"
        >
          Automatisez la validation de vos commandes COD en Algérie et au Maghreb. Relancez vos clients sur WhatsApp, éliminez les annulations à la livraison et augmentez vos bénéfices.
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-2 sm:px-0 max-w-xs sm:max-w-none"
        >
          <button
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto text-center rounded-full px-6 min-h-[46px] sm:min-h-0 py-3 sm:py-4 text-xs sm:text-sm font-heading font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            Réserver un compte
          </button>
          
          <button
            onClick={() => setShowDemoVideo(true)}
            title="Regarder la vidéo de démonstration"
            className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-0 sm:w-12 rounded-full border border-border/80 bg-background shadow-xs hover:bg-secondary flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group text-xs sm:text-sm font-heading font-semibold text-foreground"
          >
            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-foreground text-foreground group-hover:scale-110 transition-transform shrink-0" />
            <span className="sm:hidden">Démo Vidéo</span>
          </button>
        </motion.div>

        {/* 5. Dashboard Preview (Mobile & Desktop Responsive Breakpoints) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-5 sm:mt-10 w-full max-w-5xl px-0 sm:px-2"
        >
          {/* Mobile Dashboard Preview (< 768px) */}
          <div className="block md:hidden">
            <MobileDashboardPreview />
          </div>

          {/* Desktop Dashboard Preview (>= 768px) */}
          <div className="hidden md:block">
            <div
              className="rounded-2xl overflow-hidden p-2 md:p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: 'var(--shadow-dashboard)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <DashboardPreview />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setShowDemoVideo(false)}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
