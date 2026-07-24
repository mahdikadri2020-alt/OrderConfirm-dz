import React from 'react';
import { Check, Zap, Shield, ArrowRight, Star, Sparkles } from 'lucide-react';

export default function PricingSection({ onGoToApp }) {
  return (
    <section id="pricing" className="w-full py-16 sm:py-20 md:py-28 px-4 sm:px-8 md:px-12 lg:px-20 bg-background border-t border-border/80 font-body">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-heading font-bold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tarification Simple & Transparente</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight">
            Un tarif unique et tout compris pour <span className="font-display italic font-normal text-accent">booster votre COD</span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pas de frais cachés, pas de pourcentage sur votre chiffre d'affaires. Une formule complète adaptée aux e-commerçants en Algérie.
          </p>
        </div>

        {/* Pricing Card Container */}
        <div className="max-w-lg mx-auto relative">
          
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent via-indigo-500 to-emerald-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

          {/* Pricing Card */}
          <div className="relative bg-background border-2 border-accent/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  Formule Pro Marchand
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-foreground mt-2">
                  Accès Illimité OrderConfirm
                </h3>
              </div>

              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
            </div>

            {/* Price Display */}
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-heading font-semibold text-muted-foreground uppercase block">
                  Abonnement Mensuel
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading font-black text-4xl sm:text-5xl text-foreground tracking-tight">
                    9 500
                  </span>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-accent">
                    DA
                  </span>
                  <span className="text-xs text-muted-foreground font-medium ml-1">
                    / mois
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-heading font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Sans engagement
              </span>
            </div>

            {/* Features Checklist */}
            <div className="space-y-3.5 pt-2">
              <span className="text-xs font-heading font-bold text-foreground uppercase tracking-wider block">
                Tout ce qui est inclus dans le forfait :
              </span>
              
              <ul className="space-y-3 text-xs sm:text-sm text-foreground">
                {[
                  "Relances & Confirmations WhatsApp automatiques illimitées",
                  "Intégration directe avec vos workflows n8n & Webhooks",
                  "Statistiques détaillées sur les 58 Wilayas d'Algérie",
                  "Système de détection des numéros suspects & fakes",
                  "Importation rapide de fichiers Excel & CSV",
                  "Clés API sécurisées pour connecter plusieurs boutiques",
                  "Support client dédié par téléphone & WhatsApp 6j/7",
                  "Accès immédiat après validation par notre équipe"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={onGoToApp}
              className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-heading font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Commencer maintenant (9 500 DA / mois)</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Footer info note */}
            <p className="text-[11px] text-center text-muted-foreground mt-2">
              Paiement après appel de confirmation et validation de votre boutique.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
