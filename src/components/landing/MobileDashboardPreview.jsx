import React from 'react';
import { LogoIcon } from '../common/Logo';
import { 
  Home, 
  ShoppingBag, 
  BarChart3, 
  User, 
  Send, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Bell, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function MobileDashboardPreview() {
  const recentOrders = [
    {
      name: "Karim Benali",
      wilaya: "16 - Alger",
      product: "Chaussures Sport Pro",
      price: "14,500 DA",
      status: "confirmed",
      time: "14:22"
    },
    {
      name: "Yassine Saidi",
      wilaya: "31 - Oran",
      product: "Montre Connectée Z4",
      price: "8,900 DA",
      status: "confirmed",
      time: "13:15"
    },
    {
      name: "Meriem Khelifi",
      wilaya: "25 - Constantine",
      product: "Robe Silk Elegance",
      price: "22,000 DA",
      status: "rejected",
      time: "11:40"
    },
    {
      name: "Amine Bouzid",
      wilaya: "09 - Blida",
      product: "Casque Bluetooth ANC",
      price: "7,400 DA",
      status: "pending",
      time: "10:05"
    }
  ];

  return (
    <div className="w-full max-w-sm mx-auto bg-background/95 border border-border/80 rounded-2xl shadow-2xl overflow-hidden font-body text-foreground text-xs select-none pointer-events-none">
      {/* 1. App Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-background border-b border-border/60">
        <div className="flex items-center gap-2">
          <LogoIcon size={26} className="h-6.5 w-auto shrink-0" />
          <span className="font-heading font-extrabold text-xs tracking-tight text-foreground">OrderConfirm</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-heading font-bold border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
          </span>
          <div className="h-6.5 w-6.5 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Bell className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="p-3 space-y-3 bg-secondary/20">
        {/* Welcome Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-extrabold text-xs text-foreground">Boutique El Bahia</h4>
            <p className="text-[10px] text-muted-foreground">Tableau de bord marchand</p>
          </div>
          <span className="text-[9px] bg-accent/15 text-accent font-heading font-bold px-2 py-0.5 rounded-full">
            Plan Pro
          </span>
        </div>

        {/* Primary Stats Card */}
        <div className="bg-background rounded-xl p-3 border border-border/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-heading font-semibold text-muted-foreground">Taux de Confirmation</span>
            <span className="text-[9px] text-emerald-600 font-heading font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" /> +12.3%
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xl font-heading font-extrabold tracking-tight text-foreground">88.5%</span>
            <span className="text-[10px] text-muted-foreground font-mono">184 / 208 com.</span>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-8 w-full relative pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mobileGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,22 C 30,18 50,10 80,14 C 110,18 130,5 160,8 C 180,10 190,3 200,4 L 200,30 L 0,30 Z"
                fill="url(#mobileGrad)"
              />
              <path
                d="M 0,22 C 30,18 50,10 80,14 C 110,18 130,5 160,8 C 180,10 190,3 200,4"
                fill="none"
                stroke="hsl(239, 84%, 67%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="py-2 px-2.5 bg-accent text-white rounded-xl text-[10px] font-heading font-bold flex items-center justify-center gap-1.5 shadow-xs">
            <Send className="h-3 w-3" />
            <span>Relancer WhatsApp</span>
          </button>
          <button className="py-2 px-2.5 bg-background border border-border text-foreground rounded-xl text-[10px] font-heading font-bold flex items-center justify-center gap-1.5 shadow-xs">
            <Plus className="h-3 w-3 text-accent" />
            <span>Nouvelle Commande</span>
          </button>
        </div>

        {/* Recent WhatsApp Responses */}
        <div className="bg-background rounded-xl p-2.5 border border-border/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
            <span className="text-[10px] font-heading font-bold text-foreground">Dernières Réponses</span>
            <span className="text-[9px] text-accent font-heading font-semibold">Voir tout →</span>
          </div>

          <div className="space-y-1.5">
            {recentOrders.map((ord, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                <div className="space-y-0.5 truncate pr-2">
                  <div className="font-heading font-bold text-[11px] text-foreground truncate">{ord.name}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{ord.product} • {ord.wilaya}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-heading font-bold ${
                    ord.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' :
                    ord.status === 'rejected' ? 'bg-rose-500/10 text-rose-600' :
                    'bg-amber-500/10 text-amber-600'
                  }`}>
                    {ord.status === 'confirmed' && <><CheckCircle2 className="h-2.5 w-2.5" /> Confirmé</>}
                    {ord.status === 'rejected' && <><XCircle className="h-2.5 w-2.5" /> Annulé</>}
                    {ord.status === 'pending' && <><Clock className="h-2.5 w-2.5" /> En attente</>}
                  </span>
                  <div className="text-[8.5px] font-mono text-muted-foreground mt-0.5">{ord.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom App Navigation Bar */}
      <div className="flex items-center justify-around py-2 px-1 bg-background border-t border-border/60 font-heading">
        <div className="flex flex-col items-center gap-0.5 text-accent">
          <Home className="h-4 w-4" />
          <span className="text-[8.5px] font-bold">Accueil</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-[8.5px] font-semibold">Commandes</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span className="text-[8.5px] font-semibold">Stats</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="text-[8.5px] font-semibold">Profil</span>
        </div>
      </div>
    </div>
  );
}
