import React, { useState, useMemo } from 'react';
import { ShoppingBag, Search, Filter, CheckCircle2, XCircle, Clock, Building, MapPin } from 'lucide-react';

export default function AdminOrdersTab({ orders = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        (o.customer_name || '').toLowerCase().includes(q) ||
        (o.customer_phone || '').includes(q) ||
        (o.product || '').toLowerCase().includes(q) ||
        (o.wilaya || '').toLowerCase().includes(q) ||
        (o.merchant_business_name || o.merchants?.business_name || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-heading font-bold mb-2">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Vue globale plateforme</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Toutes les Commandes ({filteredOrders.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consultation globale en lecture seule de toutes les commandes enregistrées sur l'ensemble des boutiques.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Client, boutique, produit, wilaya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmées uniquement</option>
            <option value="pending">En attente uniquement</option>
            <option value="rejected">Annulées uniquement</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Boutique Marchande</th>
                <th className="py-3.5 px-4">Client & Téléphone</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Wilaya & Adresse</th>
                <th className="py-3.5 px-4">Prix (DA)</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Créée le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-xs">
                    Aucune commande trouvée sur la plateforme.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const merchantName = order.merchant_business_name || order.merchants?.business_name || 'Boutique Marchande';

                  return (
                    <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Merchant */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="font-heading font-bold text-foreground truncate max-w-[140px]">
                            {merchantName}
                          </span>
                        </div>
                      </td>

                      {/* Customer & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{order.customer_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{order.customer_phone}</div>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-4 font-medium text-foreground max-w-[180px] truncate">
                        {order.product}
                      </td>

                      {/* Wilaya & Address */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{order.wilaya}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {order.address || '—'}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-heading font-bold text-foreground">
                        {Number(order.price || 0).toLocaleString()} DA
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${
                          order.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          order.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {order.status === 'confirmed' && <><CheckCircle2 className="h-3 w-3" /> Confirmé</>}
                          {order.status === 'rejected' && <><XCircle className="h-3 w-3" /> Annulé</>}
                          {order.status === 'pending' && <><Clock className="h-3 w-3" /> En attente</>}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground text-[11px]">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
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
