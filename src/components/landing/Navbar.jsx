import React, { useState } from 'react';
import { ArrowRight, Menu, X, Download } from 'lucide-react';
import Logo, { LogoIcon } from '../common/Logo';

export default function Navbar({ onOpenAuth, onGoToApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (anchor) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    onOpenAuth('login');
  };

  const handleSignupClick = () => {
    setMobileMenuOpen(false);
    if (onGoToApp) {
      onGoToApp();
    } else {
      onOpenAuth('signup');
    }
  };

  const handleInstallApp = async () => {
    const activePrompt = window.deferredPwaPrompt;
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choice = await activePrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          window.deferredPwaPrompt = null;
        }
      } catch (err) {
        console.warn('PWA prompt execution:', err);
      }
    }
  };

  return (
    <header className="w-full z-50 transition-all duration-300 relative bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-3.5 sm:py-5 font-body">
        
        {/* DESKTOP NAVBAR (md:flex) */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo */}
          <div 
            className="cursor-pointer group hover:scale-[1.02] transition-transform" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo iconSize={40} textClassName="text-2xl md:text-3xl lg:text-4xl" />
          </div>

          {/* Center: Nav links */}
          <nav className="flex items-center gap-8 text-base font-heading font-bold text-muted-foreground">
            <a href="#hero" className="hover:text-foreground transition-colors">Accueil</a>
            <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a>
          </nav>

          {/* Right: CTA Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleInstallApp}
              className="rounded-full px-5 py-2.5 text-sm font-heading font-extrabold bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/90 transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Download className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
              <span>Télécharger l'app ⚡</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="text-base font-heading font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors shrink-0"
            >
              Se connecter
            </button>

            <button
              onClick={() => onGoToApp ? onGoToApp() : onOpenAuth('signup')}
              className="rounded-full px-6 py-2.5 text-base font-heading font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 group shrink-0"
            >
              <span>Essai gratuit</span>
              <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* MOBILE NAVBAR (< md / md:hidden) */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left: Compact Mobile Logo */}
          <div 
            className="cursor-pointer flex items-center gap-2" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <LogoIcon size={34} className="h-8.5 w-auto shrink-0" />
            <span className="font-heading font-black text-lg tracking-tight text-foreground">
              OrderConfirm
            </span>
          </div>

          {/* Right: Hamburger Menu Icon ONLY */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="h-10 w-10 rounded-xl bg-secondary text-foreground flex items-center justify-center border border-border/80 hover:bg-secondary/80 transition-colors shrink-0"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN / OVERLAY MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-background border-b border-border shadow-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Nav Links */}
          <nav className="flex flex-col space-y-2 pb-3 border-b border-border/60 font-heading font-bold text-sm text-foreground">
            <button 
              onClick={() => handleNavClick('#hero')} 
              className="text-left py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavClick('#features')} 
              className="text-left py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => handleNavClick('#pricing')} 
              className="text-left py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              Tarifs
            </button>
          </nav>

          {/* Vertically Stacked Mobile Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleInstallApp();
              }}
              className="w-full py-3.5 bg-white text-slate-900 border border-slate-300 rounded-2xl text-xs font-heading font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
              <span>Télécharger l'application ⚡</span>
            </button>

            <button
              onClick={handleLoginClick}
              className="w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl text-xs font-heading font-bold transition-all border border-border"
            >
              Se connecter
            </button>

            <button
              onClick={handleSignupClick}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-heading font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Essai gratuit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
