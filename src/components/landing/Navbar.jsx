import React from 'react';
import { ArrowRight } from 'lucide-react';
import Logo, { LogoIcon } from '../common/Logo';

export default function Navbar({ onOpenAuth, onGoToApp }) {
  return (
    <header className="w-full z-50 transition-all duration-300">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="cursor-pointer group hover:scale-[1.02] transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo iconSize={64} textClassName="text-3xl md:text-4xl" />
        </div>

        {/* Center: Nav links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-base font-heading font-bold text-muted-foreground">
          <a href="#hero" className="hover:text-foreground transition-colors">Accueil</a>
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>

        {/* Right: CTA Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-base font-heading font-bold text-muted-foreground hover:text-foreground px-4 py-2 transition-colors hidden sm:block"
          >
            Connexion
          </button>
          <button
            onClick={() => onGoToApp ? onGoToApp() : onOpenAuth('signup')}
            className="rounded-full px-7 py-3 text-base font-heading font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 group"
          >
            <span>Essai gratuit</span>
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
