import React, { useState } from 'react';
import { Send, Search, Building, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminMessagesTab({ whatsappMessages = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = whatsappMessages.filter((m) => {
    const q = searchQuery.toLowerCase();
    const merchantName = (m.merchant_business_name || m.merchants?.business_name || '').toLowerCase();
    const phone = (m.recipient_phone || m.phone || '').toLowerCase();
    const content = (m.message_content || m.content || '').toLowerCase();
    return merchantName.includes(q) || phone.includes(q) || content.includes(q);
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-heading font-bold mb-2">
            <Send className="h-3.5 w-3.5" />
            <span>Historique des Envois WhatsApp</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Messages WhatsApp ({filteredMessages.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Journal global en lecture seule des messages de relance et confirmations envoyés via l'API/Webhook.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par marchand, numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Boutique Marchande</th>
                <th className="py-3.5 px-5">Destinataire (Téléphone)</th>
                <th className="py-3.5 px-5">Contenu du Message Envoyé</th>
                <th className="py-3.5 px-5">Statut Envoi</th>
                <th className="py-3.5 px-5 text-right">Horodatage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                    Aucun message WhatsApp trouvé dans l'historique global.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => {
                  const merchantName = msg.merchant_business_name || msg.merchants?.business_name || 'Boutique Marchande';
                  const phone = msg.recipient_phone || msg.customer_phone || msg.phone || '0550 00 00 00';
                  const status = msg.status || 'sent';

                  return (
                    <tr key={msg.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Merchant */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="font-heading font-bold text-foreground truncate max-w-[140px]">
                            {merchantName}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 font-mono text-foreground font-semibold">
                        {phone}
                      </td>

                      {/* Content */}
                      <td className="py-4 px-5 max-w-md">
                        <div className="text-xs text-foreground truncate">
                          {msg.message_content || msg.content || 'Message de confirmation WhatsApp'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${
                          status === 'delivered' || status === 'sent' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="capitalize">{status}</span>
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-5 text-right font-mono text-muted-foreground text-[11px]">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString('fr-FR') : 'Récent'}
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
