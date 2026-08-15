import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
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

  return (
    <header className="w-full z-50 transition-all duration-300 relative bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-3.5 sm:py-5 font-body">
        
        {/* DESKTOP NAVBAR (md:flex) */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo */}
          <div 
            className="cursor-pointer flex items-center gap-2" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <LogoIcon size={38} className="h-10 w-10 shrink-0" />
            <span className="font-heading font-black text-2xl tracking-tight text-foreground">
              OrderConfirm
            </span>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a>
          </nav>

          {/* Right: CTA Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoginClick}
              className="rounded-full px-5 py-2.5 text-sm font-heading font-bold text-foreground hover:bg-secondary transition-all"
            >
              Se connecter
            </button>

            <button
              onClick={handleSignupClick}
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
            <LogoIcon size={36} className="h-9 w-9 shrink-0" />
            <span className="font-heading font-black text-lg tracking-tight text-foreground">
              OrderConfirm
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-muted-foreground">
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

          <div className="space-y-2.5 pt-1">
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
