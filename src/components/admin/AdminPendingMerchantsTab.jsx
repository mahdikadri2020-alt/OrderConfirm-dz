import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Clock, 
  Search,
  MapPin,
  BarChart2,
  User,
  Loader2
} from 'lucide-react';

export default function AdminPendingMerchantsTab({ 
  pendingMerchants = [], 
  onApproveMerchant, 
  onRejectMerchant 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Sort by oldest signup first (FIFO)
  const sortedPendingMerchants = [...pendingMerchants]
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    .filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        (m.business_name || m.store_name || '').toLowerCase().includes(q) ||
        (m.full_name || '').toLowerCase().includes(q) ||
        (m.phone || m.whatsapp || '').includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.wilaya || '').toLowerCase().includes(q)
      );
    });

  const handleApprove = async (merchant) => {
    const id = merchant.id;
    setProcessingId(id);
    try {
      await onApproveMerchant(merchant);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (merchant) => {
    const id = merchant.id;
    setProcessingId(id);
    try {
      await onRejectMerchant(merchant);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-heading font-bold mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>File d'attente d'activation (Demandes en attente)</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
            Demandes d'inscription en attente ({pendingMerchants.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Examinez les informations saisies par le marchand et validez son compte d'un seul clic.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filtrer par nom, boutique ou wilaya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Main Merchants List */}
      {sortedPendingMerchants.length === 0 ? (
        <div className="p-12 text-center bg-background rounded-3xl border border-border/80 space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-foreground">
            Aucune demande en attente
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Toutes les demandes d'inscription ont été traitées. Les nouveaux marchands inscrits apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedPendingMerchants.map((merchant) => {
            const signupDate = merchant.created_at 
              ? new Date(merchant.created_at).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Date inconnue';

            const isProcessing = processingId === merchant.id;
            const storeName = merchant.store_name || merchant.business_name || 'Boutique Sans Nom';
            const phoneNum = merchant.whatsapp || merchant.phone || 'Non renseigné';
            const fullName = merchant.full_name || 'Marchand';

            return (
              <div 
                key={merchant.id}
                className="bg-background rounded-3xl border border-border/80 p-6 shadow-xs space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Store Name & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-heading font-extrabold text-base shrink-0">
                        {storeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-foreground leading-tight">
                          {storeName}
                        </h3>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-body">
                          <Calendar className="h-3 w-3" />
                          <span>Demande le {signupDate}</span>
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-heading font-bold shrink-0">
                      En attente
                    </span>
                  </div>

                  {/* PHONE NUMBER DISPLAY */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-indigo-600/80 block">
                      Téléphone / WhatsApp :
                    </span>
                    <div className="flex items-center justify-between">
                      <a 
                        href={`tel:${phoneNum}`}
                        className="text-lg sm:text-xl font-mono font-extrabold text-indigo-600 hover:underline flex items-center gap-2"
                      >
                        <Phone className="h-5 w-5 text-indigo-500" />
                        <span>{phoneNum}</span>
                      </a>

                      {phoneNum !== 'Non renseigné' && (
                        <a
                          href={`https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-heading font-bold transition-all flex items-center gap-1"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Submitted Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                      <User className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-[10px]">Nom:</span>
                      <strong className="text-foreground font-bold">{fullName}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                      <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-[10px]">Email:</span>
                      <strong className="text-foreground font-mono truncate">{merchant.email || 'Non renseigné'}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-[10px]">Wilaya:</span>
                      <strong className="text-foreground font-semibold">{merchant.wilaya || '16 - Alger'}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BarChart2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-[10px]">Commandes/Mois:</span>
                      <strong className="text-foreground font-semibold">{merchant.monthly_orders || '1-50'}</strong>
                    </div>
                  </div>

                </div>

                {/* Actions: Approve & Reject */}
                <div className="pt-4 border-t border-border/60 flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(merchant)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-heading font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <span>قبول (Approuver)</span>
                  </button>

                  <button
                    onClick={() => handleReject(merchant)}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-secondary hover:bg-rose-500/10 text-rose-600 border border-border rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>رفض (Refuser)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
