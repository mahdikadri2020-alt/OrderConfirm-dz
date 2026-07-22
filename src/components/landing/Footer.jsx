import React from 'react';
import { LogoIcon } from '../common/Logo';

export default function Footer({ onGoToApp }) {
  return (
    <footer className="w-full bg-background border-t border-border/80 py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-20 font-body text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
          <LogoIcon size={32} className="h-8 sm:h-9.5 w-auto" />
          <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-foreground">OrderConfirm</span>
          <span className="text-[11px] sm:text-xs font-body text-muted-foreground sm:ml-2">
            © 2026 — Algérie & Maghreb{' '}
            <span 
              onClick={() => {
                window.history.pushState({}, '', '/admin-oc-2026');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }} 
              className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity hover:text-indigo-600 font-bold px-1"
              title="Accès Administrateur"
            >
              •
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-heading font-semibold text-xs">
          <a href="#hero" className="hover:text-foreground transition-colors">Accueil</a>
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a>
          <button onClick={onGoToApp} className="hover:text-foreground transition-colors">Tableau de bord</button>
        </div>
      </div>
    </footer>
  );
}
