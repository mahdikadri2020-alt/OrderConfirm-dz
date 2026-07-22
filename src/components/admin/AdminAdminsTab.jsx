import React, { useState } from 'react';
import { ShieldCheck, Search, Mail, Phone, Calendar, Crown, CheckCircle2 } from 'lucide-react';

export default function AdminAdminsTab({ merchants = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only merchants with is_admin === true
  const adminMerchants = merchants.filter((m) => {
    const isAdmin = Boolean(m.is_admin);
    const matchesSearch = 
      (m.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone || '').includes(searchQuery);
    return isAdmin && matchesSearch;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-xs font-heading font-bold mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Gestion des Accès Privilégiés</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Comptes Administrateurs ({adminMerchants.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Liste de tous les utilisateurs disposant du statut `is_admin = true` avec la date d'octroi des privilèges.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un administrateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Nom & Identité Admin</th>
                <th className="py-3.5 px-5">Adresse E-mail</th>
                <th className="py-3.5 px-5">Téléphone</th>
                <th className="py-3.5 px-5">Accès Accordé Le (granted_admin_at)</th>
                <th className="py-3.5 px-5 text-right">Statut Privilège</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {adminMerchants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                    Aucun compte administrateur trouvé.
                  </td>
                </tr>
              ) : (
                adminMerchants.map((admin) => {
                  const grantedDate = admin.granted_admin_at || admin.created_at;
                  const formattedDate = grantedDate 
                    ? new Date(grantedDate).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Non enregistré';

                  return (
                    <tr key={admin.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-heading font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                            {admin.business_name ? admin.business_name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-heading font-bold text-foreground flex items-center gap-1.5 text-sm">
                              <span>{admin.business_name || 'Admin OrdreConfirm'}</span>
                              <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            </div>
                            <span className="text-[11px] text-muted-foreground block font-mono">
                              ID: {admin.id?.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 font-mono text-foreground font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{admin.email || 'Non disponible'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 font-mono text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{admin.phone || '—'}</span>
                        </div>
                      </td>

                      {/* Granted Date */}
                      <td className="py-4 px-5 text-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Super Admin</span>
                        </span>
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
