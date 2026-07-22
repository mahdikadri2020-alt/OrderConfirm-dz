import React, { useState } from 'react';
import { MessageSquare, Search, Building, Check, Sparkles } from 'lucide-react';

export default function AdminTemplatesTab({ templates = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase();
    const merchantName = (t.merchant_business_name || t.merchants?.business_name || '').toLowerCase();
    const text = (t.template_text || '').toLowerCase();
    return merchantName.includes(q) || text.includes(q);
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-heading font-bold mb-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Modèles WhatsApp enregistrés</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Modèles de Messages ({filteredTemplates.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consultation en lecture seule de tous les modèles de relance WhatsApp configurés par les marchands.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par marchand ou texte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Templates List Table */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Boutique Marchande</th>
                <th className="py-3.5 px-5">Texte du Modèle WhatsApp</th>
                <th className="py-3.5 px-5 text-center">Par Défaut</th>
                <th className="py-3.5 px-5 text-right">Dernière maj</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground text-xs">
                    Aucun modèle de message WhatsApp trouvé.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((template) => {
                  const merchantName = template.merchant_business_name || template.merchants?.business_name || 'Boutique Marchande';

                  return (
                    <tr key={template.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Merchant */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="font-heading font-bold text-foreground">
                            {merchantName}
                          </span>
                        </div>
                      </td>

                      {/* Template Text */}
                      <td className="py-4 px-5 max-w-xl">
                        <div className="bg-secondary/40 p-3 rounded-xl border border-border/60 text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                          {template.template_text}
                        </div>
                      </td>

                      {/* Default Badge */}
                      <td className="py-4 px-5 text-center">
                        {template.is_default ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <Check className="h-3 w-3" /> Oui
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">Non</span>
                        )}
                      </td>

                      {/* Updated date */}
                      <td className="py-4 px-5 text-right font-mono text-muted-foreground text-[11px]">
                        {template.created_at ? new Date(template.created_at).toLocaleDateString('fr-FR') : '—'}
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
