import React from 'react';
import { ArrowRight } from 'lucide-react';
import Logo, { LogoIcon } from '../common/Logo';

export default function Navbar({ onOpenAuth, onGoToApp }) {
  return (
    <header className="w-full z-50 transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-3.5 sm:py-5 font-body max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="cursor-pointer group hover:scale-[1.02] transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo iconSize={40} textClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
        </div>

        {/* Center: Nav links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-base font-heading font-bold text-muted-foreground">
          <a href="#hero" className="hover:text-foreground transition-colors">Accueil</a>
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a>
        </nav>

        {/* Right: CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-xs sm:text-base font-heading font-bold text-muted-foreground hover:text-foreground px-2.5 sm:px-4 py-1.5 sm:py-2 transition-colors border border-border/80 sm:border-0 rounded-full shrink-0"
          >
            Se connecter
          </button>
          <button
            onClick={() => onGoToApp ? onGoToApp() : onOpenAuth('signup')}
            className="rounded-full px-3.5 py-1.5 sm:px-7 sm:py-3 text-xs sm:text-base font-heading font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md flex items-center gap-1 sm:gap-2 group shrink-0"
          >
            <span>Essai gratuit</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
