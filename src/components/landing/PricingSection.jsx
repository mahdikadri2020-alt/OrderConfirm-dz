import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function PricingSection({ onGoToApp }) {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Débutant",
      price: annual ? "3,900" : "4,900",
      period: "DA / mois",
      description: "Parfait pour les vendeurs e-commerce qui démarrent leur activité COD.",
      features: [
        "Jusqu'à 1,000 confirmations WhatsApp / mois",
        "Modèle de message standard",
        "Support WhatsApp & Email",
        "Importation CSV des commandes",
        "Rapports de livraison de base"
      ],
      popular: false,
      cta: "Commencer l'essai"
    },
    {
      name: "Pro Marchand",
      price: annual ? "7,900" : "9,900",
      period: "DA / mois",
      description: "Pour les boutiques en forte croissance cherchant l'automatisation maximale.",
      features: [
        "Jusqu'à 3,500 confirmations WhatsApp / mois",
        "Modèles de messages illimités & personnalisés",
        "Intégration Webhooks n8n & API keys",
        "Analyse du taux de confirmation par Wilaya",
        "Relances automatiques si sans réponse",
        "Support prioritaire WhatsApp 7j/7"
      ],
      popular: true,
      cta: "Déclencher l'offre Pro"
    },
    {
      name: "Entreprise",
      price: annual ? "15,900" : "19,900",
      period: "DA / mois",
      description: "Pour les grandes marques et agences gérant plusieurs boutiques.",
      features: [
        "Jusqu'à 10,000 confirmations WhatsApp / mois",
        "Compte multi-utilisateurs & permissions",
        "Instance WhatsApp dédiée avec votrenuméro",
        "Intégration WooCommerce & Shopify sur mesure",
        "Account Manager dédié en Algérie",
        "Garantie SLA 99.9% de livraison"
      ],
      popular: false,
      cta: "Contacter l'équipe"
    }
  ];

  return (
    <section id="pricing" className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-20 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            Tarifs Transparents
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 tracking-tight">
            Des forfaits simples adaptés à votre <span className="font-display italic font-normal text-accent">volume de ventes</span>
          </h2>
          <p className="mt-3 sm:mt-4 font-body text-muted-foreground text-xs sm:text-base leading-relaxed">
            Aucun frais caché. Rentabilité garantie dès les 50 premières commandes confirmées.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 bg-secondary p-1.5 rounded-full border border-border">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
                !annual ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-1 ${
                annual ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              <span>Annuel</span>
              <span className="bg-emerald-500/15 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-background border-2 border-accent shadow-xl md:scale-105 z-10'
                  : 'bg-background border border-border/80 hover:border-accent/40 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-heading font-bold tracking-wide uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" /> Le plus populaire
                </div>
              )}

              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 min-h-[32px] sm:min-h-[36px]">{plan.description}</p>

                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">{plan.price}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">{plan.period}</span>
                </div>

                <div className="w-full h-px bg-border/60 my-5 sm:my-6" />

                <ul className="space-y-2.5 sm:space-y-3">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <div className="h-4 w-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onGoToApp}
                className={`mt-6 sm:mt-8 w-full py-3 rounded-full text-xs font-heading font-bold transition-all ${
                  plan.popular
                    ? 'bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
