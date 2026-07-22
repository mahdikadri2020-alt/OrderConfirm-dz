import React from 'react';
import { MessageSquare, ShieldCheck, Zap, BarChart2, Users, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function FeaturesSection({ onGoToApp }) {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-accent" />,
      title: "Relances WhatsApp Automatiques",
      description: "Dès qu'une commande est passée sur votre boutique (Shopify, WooCommerce, ou via CSV), un message d'interaction WhatsApp personnalisé est immédiatement envoyé au client."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "Détection & Validation Anti-Fake",
      description: "Le client répond '1' pour confirmer ou '2' pour annuler. Les numéros invalides ou les commandes suspectes sont automatiquement identifiés."
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Intégration n8n & Webhooks",
      description: "Connectez vos workflows n8n existants en 2 minutes via nos webhooks ultrarapides et synchronisez vos statuts en temps réel sans code."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-accent" />,
      title: "Analytiques par Wilaya (58 Wilayas)",
      description: "Suivez précisément le taux de confirmation par wilaya (Alger, Oran, Constantine...) pour optimiser vos campagnes publicitaires Facebook & TikTok Ads."
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-blue-600" />,
      title: "Importation CSV & Ajout Manuel",
      description: "Importez vos fichiers Excel/CSV de commandes en un clic. OrderConfirm traite et relance automatiquement des milliers de lignes."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Gestion Multi-Boutiques & Clés API",
      description: "Créez et gérez des clés d'API sécurisées pour connecter plusieurs magasins en ligne à un compte marchand centralisé."
    }
  ];

  return (
    <section id="features" className="w-full py-20 px-6 md:px-12 lg:px-20 bg-secondary/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            Fonctionnalités Clés
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground mt-4 tracking-tight">
            Conçu spécialement pour le e-commerce <span className="font-display italic font-normal text-accent">COD au Maghreb</span>
          </h2>
          <p className="mt-4 font-body text-muted-foreground text-base md:text-lg leading-relaxed">
            Réduisez de 40% vos colis non livrés et vos frais de livraison inutiles grâce à la confirmation WhatsApp instantanée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-background rounded-2xl p-6 border border-border/80 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="mt-16 bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-heading font-bold text-2xl md:text-3xl leading-tight">
              Prêt à doubler votre taux de livraison en Algérie ?
            </h3>
            <p className="text-primary-foreground/80 font-body text-sm md:text-base">
              Essayez OrderConfirm gratuitement avec 100 confirmations offertes à l'inscription. Sans carte bancaire.
            </p>
          </div>
          <button
            onClick={onGoToApp}
            className="shrink-0 bg-white text-foreground hover:bg-slate-100 px-6 py-3.5 rounded-full text-sm font-heading font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            <span>Démarrer maintenant</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
