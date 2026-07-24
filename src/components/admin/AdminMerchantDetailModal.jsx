import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Ban, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Package, 
  Zap, 
  Crown,
  AlertTriangle
} from 'lucide-react';

export default function AdminMerchantDetailModal({ merchant, onClose, onToggleStatus, onChangePlan }) {
  if (!merchant) return null;

  const [selectedPlan, setSelectedPlan] = useState(merchant.plan || 'Débutant');

  const handlePlanSave = () => {
    if (onChangePlan) {
      onChangePlan(merchant.id, selectedPlan);
    }
  };

  const isSuspended = merchant.status === 'suspended';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden font-body text-foreground my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-secondary/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-heading font-extrabold text-lg shadow-xs">
              {merchant.business_name ? merchant.business_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-foreground tracking-tight">
                  {merchant.business_name}
                </h3>
                {merchant.is_admin && (
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-body">ID: {merchant.id}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent shrink-0" />
              <div className="truncate">
                <span className="text-[11px] font-heading font-semibold text-muted-foreground block uppercase tracking-wider">Email</span>
                <span className="text-xs font-medium text-foreground truncate block">{merchant.email || 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent shrink-0" />
              <div>
                <span className="text-[11px] font-heading font-semibold text-muted-foreground block uppercase tracking-wider">Téléphone</span>
                <span className="text-xs font-medium text-foreground block">{merchant.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent shrink-0" />
              <div>
                <span className="text-[11px] font-heading font-semibold text-muted-foreground block uppercase tracking-wider">Inscrit le</span>
                <span className="text-xs font-medium text-foreground block">
                  {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récent'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
              <div>
                <span className="text-[11px] font-heading font-semibold text-muted-foreground block uppercase tracking-wider">Statut Compte</span>
                <span className={`inline-flex items-center gap-1.5 mt-0.5 text-xs font-heading font-bold ${
                  isSuspended ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  {isSuspended ? 'Compte Suspendu' : 'Compte Actif'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div>
            <h4 className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Statistiques & Performances
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-background border border-border/80 shadow-2xs text-center">
                <span className="text-[10px] font-heading font-semibold text-muted-foreground uppercase">Commandes</span>
                <p className="font-heading font-extrabold text-lg text-foreground mt-0.5">{merchant.total_orders || 0}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-heading font-semibold text-emerald-700 uppercase">Confirmées</span>
                <p className="font-heading font-extrabold text-lg text-emerald-600 mt-0.5">{merchant.confirmed_orders || 0}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/20 text-center">
                <span className="text-[10px] font-heading font-semibold text-accent uppercase">Taux Confirmation</span>
                <p className="font-heading font-extrabold text-lg text-accent mt-0.5">{merchant.confirmation_rate || 0}%</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-background border border-border/80 shadow-2xs text-center">
                <span className="text-[10px] font-heading font-semibold text-muted-foreground uppercase">Revenu Estimé</span>
                <p className="font-heading font-bold text-xs text-foreground mt-1 truncate">
                  {(merchant.revenue_dzd || (merchant.total_orders * 4500)).toLocaleString('fr-FR')} DA
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="p-5 rounded-2xl bg-secondary/50 border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="font-heading font-bold text-sm text-foreground">Abonnement & Formule</span>
              </div>
              <span className="text-xs font-heading font-semibold bg-background px-3 py-1 rounded-full border border-border">
                Plan Actuel : {merchant.plan || 'Débutant'}
              </span>
            </div>

            {/* Dates & Validity Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-background/60 p-3.5 rounded-xl border border-border/60">
              <div>
                <span className="text-[10px] font-heading font-semibold text-muted-foreground uppercase block">Début Abonnement</span>
                <span className="font-heading font-bold text-foreground">
                  {merchant.subscription_start ? new Date(merchant.subscription_start).toLocaleDateString('fr-FR') : 'Non défini'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-heading font-semibold text-muted-foreground uppercase block">Fin Abonnement</span>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-foreground">
                    {merchant.subscription_end ? new Date(merchant.subscription_end).toLocaleDateString('fr-FR') : 'Non défini'}
                  </span>
                  {merchant.subscription_end && (() => {
                    const daysLeft = Math.ceil((new Date(merchant.subscription_end) - new Date()) / (1000 * 60 * 60 * 24));
                    if (daysLeft <= 0) {
                      return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-heading font-bold">Expiré</span>;
                    }
                    return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-heading font-bold">{daysLeft}j restants</span>;
                  })()}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full sm:w-auto flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Débutant">Plan Débutant (1 000 relances/mois)</option>
                <option value="Pro Marchand">Plan Pro Marchand (5 000 relances/mois)</option>
                <option value="Enterprise">Plan Enterprise (Illimité)</option>
              </select>

              <button
                onClick={handlePlanSave}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-heading font-semibold hover:bg-primary/90 transition-all shrink-0"
              >
                Mettre à jour le plan
              </button>

              {onRenewMerchant && (
                <button
                  onClick={() => onRenewMerchant(merchant.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Renouveler (+1 mois)</span>
                </button>
              )}
            </div>
          </div>

          {/* Account Status Actions (Suspend / Reactivate) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Suspension bloquera l'accès du marchand à son dashboard.</span>
            </div>

            <button
              onClick={() => onToggleStatus && onToggleStatus(merchant.id)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                isSuspended
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isSuspended ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Réactiver ce Marchand</span>
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  <span>Suspendre le Compte</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
