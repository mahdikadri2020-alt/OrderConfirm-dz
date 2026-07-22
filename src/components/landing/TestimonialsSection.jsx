import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Walid Benbrahim",
      role: "Fondateur, El Bahia Commerce (Alger)",
      content: "Avant OrderConfirm, nous avions près de 35% d'annulations à la livraison avec Yalidine. Depuis que nous envoyons la confirmation WhatsApp automatique via n8n, notre taux de livraison a bondi à 89% !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Amira Mansouri",
      role: "Directrice E-commerce, ModeDZ (Oran)",
      content: "La détection des faux numéros et l'analyse par Wilaya nous ont permis d'économiser plus de 250,000 DA en frais de retour le premier mois. L'intégration s'est faite en 15 minutes.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Sami Khedir",
      role: "Gérant, DZTech Store (Constantine)",
      content: "Le système de modèles de messages avec variables dynamiques est génial. Les clients algériens préfèrent de loin répondre sur WhatsApp qu'au téléphone !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section id="testimonials" className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-20 bg-secondary/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            Avis Marchands
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl text-foreground mt-3 sm:mt-4 tracking-tight">
            Validé par plus de <span className="font-display italic font-normal text-accent">200+ boutiques</span> en Algérie
          </h2>
          <p className="mt-3 sm:mt-4 font-body text-muted-foreground text-xs sm:text-base leading-relaxed">
            Découvrez comment OrderConfirm transforme la gestion logistique COD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-background rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3 sm:mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "{rev.content}"
                </p>
              </div>

              <div className="mt-5 sm:mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                  {rev.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-heading font-bold text-foreground">{rev.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
