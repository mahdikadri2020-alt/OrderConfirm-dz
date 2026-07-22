import React from 'react';
import { LogoIcon } from '../common/Logo';

export default function Footer({ onGoToApp }) {
  return (
    <footer className="w-full bg-background border-t border-border/80 py-12 px-6 md:px-12 lg:px-20 font-body text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <LogoIcon size={38} className="h-9.5 w-auto" />
          <span className="text-xl font-heading font-black tracking-tight text-foreground">OrderConfirm</span>
          <span className="text-xs font-body text-muted-foreground ml-2">© 2026 — Algérie & Maghreb</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-heading font-semibold text-xs">
          <a href="#hero" className="hover:text-foreground transition-colors">Accueil</a>
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <button onClick={onGoToApp} className="hover:text-foreground transition-colors">Tableau de bord</button>
        </div>
      </div>
    </footer>
  );
}
