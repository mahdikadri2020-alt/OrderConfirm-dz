import React from 'react';
import { CreditCard, Check, Sparkles, ArrowUpRight } from 'lucide-react';

export default function BillingTab({ subscription }) {
  const percentUsed = Math.round((subscription.orders_used / subscription.orders_limit) * 100);

  return (
    <div className="space-y-6 font-body">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Facturation & Abonnement</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gérez votre forfait de confirmations WhatsApp mensuelles.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-background rounded-2xl p-6 border border-border/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <span className="text-[11px] font-semibold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-1 rounded-full">
            Plan Actuel
          </span>
          <h3 className="text-2xl font-bold text-foreground">{subscription.plan_name}</h3>
          <p className="text-xs text-muted-foreground">
            Renouvellement automatique le <strong>{subscription.current_period_end}</strong>.
          </p>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-foreground">Utilisation ce mois-ci</span>
              <span className="text-accent">{subscription.orders_used} / {subscription.orders_limit} confirmations</span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Il vous reste {subscription.orders_limit - subscription.orders_used} confirmations pour la période en cours.
            </span>
          </div>
        </div>

        <button className="bg-accent text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-accent/90 transition-all shadow-md shrink-0 flex items-center gap-1.5">
          <span>Changer de Forfait</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { name: 'Débutant', price: '4,900 DA / mois', limit: '1,000 confirmations', active: subscription.plan_name === 'Débutant' },
          { name: 'Pro Marchand', price: '9,900 DA / mois', limit: '3,500 confirmations', active: subscription.plan_name === 'Pro Marchand' },
          { name: 'Entreprise', price: '19,900 DA / mois', limit: '10,000 confirmations', active: subscription.plan_name === 'Entreprise' },
        ].map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 border transition-all ${
              plan.active
                ? 'bg-background border-2 border-accent shadow-md'
                : 'bg-background border-border/80 hover:border-accent/40'
            }`}
          >
            <h4 className="font-bold text-foreground text-base">{plan.name}</h4>
            <span className="text-2xl font-bold text-foreground block mt-2">{plan.price}</span>
            <span className="text-xs text-muted-foreground block mt-1">{plan.limit}</span>

            <button
              disabled={plan.active}
              className={`mt-6 w-full py-2.5 rounded-full text-xs font-semibold transition-all ${
                plan.active
                  ? 'bg-accent/15 text-accent cursor-default'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {plan.active ? 'Forfait Actuel' : 'Passer à ce forfait'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
