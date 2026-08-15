import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Download, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import Logo, { LogoIcon } from '../common/Logo';

export default function Navbar({ onOpenAuth, onGoToApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(standalone);
    }
  }, []);

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
          return;
        }
      } catch (err) {
        console.warn('PWA prompt execution:', err);
      }
    }
    // Fallback: open guidance modal if prompt isn't directly triggerable
    setShowGuideModal(true);
  };

  return (
    <>
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
              {!isStandalone && (
                <button
                  onClick={handleInstallApp}
                  className="rounded-full px-5 py-2.5 text-sm font-heading font-extrabold bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/90 transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Download className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                  <span>Télécharger l'app ⚡</span>
                </button>
              )}

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
              {!isStandalone && (
                <button
                  onClick={handleInstallApp}
                  className="rounded-full px-3 py-1.5 text-xs font-heading font-bold bg-white text-slate-900 border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>Télécharger ⚡</span>
                </button>
              )}

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
              {!isStandalone && (
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
              )}

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

      {/* PWA INSTALL GUIDANCE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full bg-secondary/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-1">
                <LogoIcon size={44} className="h-11 w-11" />
              </div>
              <h3 className="text-xl font-heading font-black text-foreground tracking-tight">
                Télécharger l'application ⚡
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ajoutez OrderConfirm à votre écran d'accueil en 1 clic pour un accès rapide.
              </p>
            </div>

            <div className="space-y-3 bg-secondary/60 p-4 rounded-2xl border border-border/60 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary font-extrabold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-foreground">Sur Chrome / أندرويد :</p>
                  <p className="text-muted-foreground">اضغط على <span className="font-bold text-foreground">الثلاث نقاط (⋮)</span> في الأعلى ➔ اختر <span className="font-bold text-emerald-500">إضافة إلى الشاشة الرئيسية (Ajouter à l'écran d'accueil)</span>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-border/40">
                <div className="p-2 rounded-xl bg-primary/10 text-primary font-extrabold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-foreground">Sur Safari / آيفون :</p>
                  <p className="text-muted-foreground">اضغط على زر <span className="font-bold text-foreground">المشاركة (⎋)</span> ➔ اختر <span className="font-bold text-emerald-500">إضافة إلى الشاشة الرئيسية</span>.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-extrabold rounded-2xl text-sm transition-all shadow-md active:scale-95"
            >
              حسناً، فهمت ! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
