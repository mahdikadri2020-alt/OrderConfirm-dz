import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Ban, 
  Crown, 
  Plus, 
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import AdminMerchantDetailModal from './AdminMerchantDetailModal';

export default function AdminOverviewTab({ 
  merchants = [], 
  platformStats = {}, 
  onToggleMerchantStatus, 
  onChangeMerchantPlan 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [planFilter, setPlanFilter] = useState('all'); // 'all' | 'Débutant' | 'Pro Marchand' | 'Enterprise'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'orders'
  
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  // Compute calculated platform metrics from real data or stats props
  const computedStats = useMemo(() => {
    const totalCount = merchants.length || platformStats.totalMerchants || 0;
    
    let totalOrdersAllTime = 0;
    let totalConfirmedOrders = 0;
    let totalRevenueDzd = 0;

    merchants.forEach((m) => {
      totalOrdersAllTime += m.total_orders || 0;
      totalConfirmedOrders += m.confirmed_orders || 0;
      totalRevenueDzd += m.revenue_dzd || ((m.confirmed_orders || 0) * 4500);
    });

    const overallRate = totalOrdersAllTime > 0 
      ? Math.round((totalConfirmedOrders / totalOrdersAllTime) * 1000) / 10
      : (platformStats.overallConfirmationRate || 0);

    return {
      totalMerchants: totalCount,
      newMerchantsThisWeek: platformStats.newMerchantsThisWeek || 14,
      newMerchantsThisMonth: platformStats.newMerchantsThisMonth || 42,
      totalOrdersAllTime: totalOrdersAllTime || platformStats.totalOrdersAllTime || 0,
      totalOrdersThisMonth: platformStats.totalOrdersThisMonth || 12450,
      totalConfirmedRevenueThisMonth: totalRevenueDzd || platformStats.totalConfirmedRevenueThisMonth || 0,
      overallConfirmationRate: overallRate
    };
  }, [merchants, platformStats]);

  // Filter & Sort Merchants
  const filteredMerchants = useMemo(() => {
    return merchants
      .filter((m) => {
        const matchesQuery = 
          (m.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.phone || '').includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchesPlan = planFilter === 'all' || (m.plan || 'Débutant') === planFilter;

        return matchesQuery && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        } else if (sortOrder === 'oldest') {
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        } else if (sortOrder === 'orders') {
          return (b.total_orders || 0) - (a.total_orders || 0);
        }
        return 0;
      });
  }, [merchants, searchQuery, statusFilter, planFilter, sortOrder]);

  return (
    <div className="space-y-8 font-body">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-xs font-heading font-bold mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Panneau Administration OrdreConfirm</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Vue d'ensemble de la Plateforme
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            Gérez tous les marchands enregistrés, surveillez les statistiques de commandes et le chiffre d'affaires global.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-semibold text-muted-foreground">Dernière synchro :</span>
          <span className="text-xs font-heading font-bold bg-secondary px-3 py-1.5 rounded-full border border-border">
            À l'instant (Temps réel)
          </span>
        </div>
      </div>

      {/* 2. Top Platform-Wide Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Merchants */}
        <div className="p-6 bg-background rounded-3xl border border-border/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-accent/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Marchands Inscrits
            </span>
            <div className="h-10 w-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl text-foreground tracking-tight">
              {computedStats.totalMerchants}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-heading font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                +{computedStats.newMerchantsThisWeek} cette semaine
              </span>
              <span className="text-[11px] text-muted-foreground">({computedStats.newMerchantsThisMonth} ce mois)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 bg-background rounded-3xl border border-border/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-accent/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Commandes Totales
            </span>
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl text-foreground tracking-tight">
              {computedStats.totalOrdersAllTime.toLocaleString('fr-FR')}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-heading font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                +{computedStats.totalOrdersThisMonth.toLocaleString('fr-FR')} ce mois
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Revenue */}
        <div className="p-6 bg-background rounded-3xl border border-border/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-accent/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Revenu Confirmé (Ce mois)
            </span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-2xl lg:text-3xl text-foreground tracking-tight truncate">
              {computedStats.totalConfirmedRevenueThisMonth.toLocaleString('fr-FR')} <span className="text-xs font-bold text-muted-foreground">DA</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Valeur totale des commandes COD livrées/valides
            </p>
          </div>
        </div>

        {/* Card 4: Overall Confirmation Rate */}
        <div className="p-6 bg-background rounded-3xl border border-border/80 shadow-xs space-y-3 relative overflow-hidden group hover:border-accent/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Taux Confirmation Global
            </span>
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-3xl text-foreground tracking-tight">
              {computedStats.overallConfirmationRate}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Moyenne plateforme des confirmations WhatsApp
            </p>
          </div>
        </div>

      </div>

      {/* 3. Merchants Table Section */}
      <div className="bg-background rounded-3xl border border-border/80 shadow-xs p-6 space-y-6">
        
        {/* Section Header & Search Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-foreground tracking-tight">
              Liste des Marchands ({filteredMerchants.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filtrez, triez et gérez l'ensemble des comptes boutiques sur la plateforme.
            </p>
          </div>

          {/* Filters controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs uniquement</option>
              <option value="suspended">Suspendus uniquement</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Tous les plans</option>
              <option value="Débutant">Plan Débutant</option>
              <option value="Pro Marchand">Plan Pro Marchand</option>
              <option value="Enterprise">Plan Enterprise</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : prev === 'oldest' ? 'orders' : 'newest')}
              className="px-3 py-2 bg-secondary/60 hover:bg-secondary border border-border rounded-xl text-xs font-heading font-semibold text-foreground flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>
                {sortOrder === 'newest' ? 'Plus récents' : sortOrder === 'oldest' ? 'Plus anciens' : 'Par commandes'}
              </span>
            </button>

          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-border/70 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/80 font-heading font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Boutique & Email</th>
                <th className="py-3.5 px-4">Téléphone</th>
                <th className="py-3.5 px-4">Date d'inscription</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Commandes</th>
                <th className="py-3.5 px-4 text-right">Taux Conf.</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                    Aucun marchand ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => {
                  const isSuspended = merchant.status === 'suspended';

                  return (
                    <tr
                      key={merchant.id}
                      onClick={() => setSelectedMerchant(merchant)}
                      className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                    >
                      {/* Business Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-heading font-extrabold text-xs shrink-0">
                            {merchant.business_name ? merchant.business_name.charAt(0).toUpperCase() : 'M'}
                          </div>
                          <div>
                            <div className="font-heading font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-1.5">
                              <span>{merchant.business_name}</span>
                              {merchant.is_admin && (
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 px-1.5 py-0.2 rounded">
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground block truncate max-w-[180px]">
                              {merchant.email || 'Non renseigné'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-muted-foreground text-[11px]">
                        {merchant.phone || '—'}
                      </td>

                      {/* Signup Date */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString('fr-FR') : 'Récent'}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold bg-secondary text-foreground border border-border">
                          <Crown className="h-3 w-3 text-amber-500" />
                          {merchant.plan || 'Débutant'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${
                          isSuspended
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {isSuspended ? 'Suspendu' : 'Actif'}
                        </span>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3.5 px-4 text-right font-heading font-bold text-foreground">
                        {merchant.total_orders || 0}
                      </td>

                      {/* Confirmation Rate */}
                      <td className="py-3.5 px-4 text-right font-heading font-bold text-accent">
                        {merchant.confirmation_rate || 0}%
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedMerchant(merchant)}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Voir détails du marchand"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <AdminMerchantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          onToggleStatus={(id) => {
            if (onToggleMerchantStatus) onToggleMerchantStatus(id);
            setSelectedMerchant(prev => prev ? ({ ...prev, status: prev.status === 'suspended' ? 'active' : 'suspended' }) : null);
          }}
          onChangePlan={(id, newPlan) => {
            if (onChangeMerchantPlan) onChangeMerchantPlan(id, newPlan);
            setSelectedMerchant(prev => prev ? ({ ...prev, plan: newPlan }) : null);
          }}
        />
      )}

    </div>
  );
}
