import React, { useState } from 'react';
import { Crown, Search, Building, CheckCircle2, Calendar } from 'lucide-react';

export default function AdminSubscriptionsTab({ subscriptions = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const q = searchQuery.toLowerCase();
    const merchantName = (sub.merchant_business_name || sub.merchants?.business_name || '').toLowerCase();
    const plan = (sub.plan_name || '').toLowerCase();
    return merchantName.includes(q) || plan.includes(q);
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-heading font-bold mb-2">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Suivi des Abonnements</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Abonnements Marchands ({filteredSubscriptions.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Liste de tous les enregistrements de forfaits, limites de commandes et statut de facturation des boutiques.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par marchand ou forfait..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Boutique Marchande</th>
                <th className="py-3.5 px-5">Forfait Souscrit</th>
                <th className="py-3.5 px-5">Quota d'Utilisation Commandes</th>
                <th className="py-3.5 px-5">Statut Forfait</th>
                <th className="py-3.5 px-5 text-right">Renouvellement Le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                    Aucun abonnement trouvé.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const merchantName = sub.merchant_business_name || sub.merchants?.business_name || 'Boutique Marchande';
                  const planName = sub.plan_name || 'Débutant';
                  const used = sub.orders_used || 0;
                  const limit = sub.orders_limit || 1000;
                  const usagePercent = Math.min(Math.round((used / limit) * 100), 100);

                  return (
                    <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Merchant */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="font-heading font-bold text-foreground">
                            {merchantName}
                          </span>
                        </div>
                      </td>

                      {/* Plan Name */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-secondary text-foreground border border-border">
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                          <span>{planName}</span>
                        </span>
                      </td>

                      {/* Quota Progress */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-heading font-semibold">
                            <span className="text-foreground">{used} / {limit} com.</span>
                            <span className="text-accent">{usagePercent}%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-accent h-full rounded-full transition-all duration-300"
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="capitalize">{sub.status || 'Actif'}</span>
                        </span>
                      </td>

                      {/* Period End */}
                      <td className="py-4 px-5 text-right font-mono text-muted-foreground text-[11px]">
                        {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('fr-FR') : '30 jours'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
