import React from 'react';
import { LogoIcon } from '../common/Logo';
import { 
  Check, 
  ChevronDown, 
  Search, 
  Bell, 
  Home, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  Key, 
  Zap, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Upload,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="w-full text-[11px] select-none pointer-events-none font-body text-foreground bg-background/95 rounded-xl shadow-2xl overflow-x-auto border border-border/80">
      <div className="min-w-[680px] md:min-w-0 w-full">
        {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60 bg-background/80">
        <div className="flex items-center gap-2">
          <LogoIcon size={24} className="h-6 w-auto shrink-0" />
          <span className="font-heading font-extrabold text-foreground tracking-tight text-xs">OrderConfirm</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-secondary/80 px-2.5 py-1 rounded-md border border-border/50 text-muted-foreground w-64 justify-between">
          <div className="flex items-center gap-1.5">
            <Search className="h-3 w-3" />
            <span className="text-[10px]">Rechercher commande, téléphone...</span>
          </div>
          <kbd className="text-[9px] bg-background px-1.5 py-0.5 rounded border border-border font-mono shadow-2xl">⌘K</kbd>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> WhatsApp Connecté
          </span>
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Bell className="h-3 w-3" />
          </div>
          <div className="h-6 w-6 rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center text-[10px]">
            DZ
          </div>
        </div>
      </div>

      <div className="flex h-[440px]">
        {/* Sidebar */}
        <div className="w-44 border-r border-border/60 bg-background/50 p-2.5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary font-medium text-foreground text-xs">
                <Home className="h-3.5 w-3.5 text-accent" />
                <span>Accueil</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Commandes</span>
                </div>
                <span className="bg-accent/15 text-accent text-[9px] px-1.5 py-0.2 rounded-full font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Modèles WhatsApp</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary/50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Statistiques</span>
                </div>
                <ChevronDown className="h-3 w-3" />
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Key className="h-3.5 w-3.5" />
                  <span>Clés API</span>
                </div>
              </div>
            </div>

            <div>
              <span className="px-2 text-[9px] font-semibold text-muted-foreground/70 uppercase tracking-wider">Workflows</span>
              <div className="mt-1 space-y-0.5">
                <div className="flex items-center justify-between px-2 py-1 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-amber-500" /> Webhook n8n
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 text-muted-foreground">
                  <span>Relances Auto</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 text-muted-foreground">
                  <span>Notifications SMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-secondary/30 p-3 overflow-hidden flex flex-col gap-3">
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Bienvenue, Boutique El Bahia</h4>
              <p className="text-[10px] text-muted-foreground">Aperçu en temps réel de vos confirmations COD en Algérie</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="bg-accent text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 shadow-sm">
                <Send className="h-3 w-3" /> Relancer WhatsApp
              </button>
              <button className="bg-background text-foreground border border-border px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
                <Upload className="h-3 w-3" /> Importer CSV
              </button>
              <button className="bg-background text-foreground border border-border px-2 py-1 rounded-full text-[10px] font-medium">
                <RefreshCw className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Action pills & stats */}
          <div className="grid grid-cols-2 gap-3">
            {/* Confirmation rate & chart card */}
            <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Taux de Confirmation</span>
                  <div className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">30 Derniers Jours</span>
              </div>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight text-foreground">84.5%</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> +12.3% cette semaine
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 1,420 Confirmées
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> 210 Annulées
                </span>
              </div>

              {/* Hand-crafted SVG Cubic Bézier area chart */}
              <div className="h-16 w-full mt-2 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,45 C 40,40 60,20 100,28 C 140,36 170,12 210,18 C 250,24 270,5 300,8 L 300,60 L 0,60 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0,45 C 40,40 60,20 100,28 C 140,36 170,12 210,18 C 250,24 270,5 300,8"
                    fill="none"
                    stroke="hsl(239, 84%, 67%)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="300" cy="8" r="3" fill="hsl(239, 84%, 67%)" />
                </svg>
              </div>
            </div>

            {/* Top Wilayas Card */}
            <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-semibold text-foreground">Performance par Wilaya</span>
                <div className="flex items-center gap-1">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                  <MoreVertical className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2.5 py-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground font-mono">16</span>
                    <span className="font-medium text-foreground">Alger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">480 com.</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">94.2%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground font-mono">31</span>
                    <span className="font-medium text-foreground">Oran</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">320 com.</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">88.5%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground font-mono">25</span>
                    <span className="font-medium text-foreground">Constantine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">190 com.</span>
                    <span className="font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">82.0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground font-mono">09</span>
                    <span className="font-medium text-foreground">Blida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">145 com.</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">91.0%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 text-right">
                <span className="text-[10px] text-accent font-medium hover:underline cursor-pointer">Voir les 58 Wilayas →</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions / Orders Table */}
          <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold text-foreground">Dernières Réponses WhatsApp</h5>
              <span className="text-[10px] text-muted-foreground">Mise à jour via n8n à l'instant</span>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground font-medium">
                    <th className="pb-1.5 font-medium">Client & Wilaya</th>
                    <th className="pb-1.5 font-medium">Produit</th>
                    <th className="pb-1.5 font-medium">Montant</th>
                    <th className="pb-1.5 font-medium text-right">Statut WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="py-2">
                      <div className="font-medium text-foreground">Karim Benali</div>
                      <div className="text-[9px] text-muted-foreground">0550 12 34 56 (Alger - 16)</div>
                    </td>
                    <td className="py-2 text-muted-foreground">Chaussures Sport Pro</td>
                    <td className="py-2 font-semibold text-foreground">14,500 DA</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-medium border border-amber-500/20">
                        <Clock className="h-2.5 w-2.5" /> En attente
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2">
                      <div className="font-medium text-foreground">Yassine Saidi</div>
                      <div className="text-[9px] text-muted-foreground">0661 98 76 54 (Oran - 31)</div>
                    </td>
                    <td className="py-2 text-muted-foreground">Montre Connectée Z4</td>
                    <td className="py-2 font-semibold text-foreground">8,200 DA</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-medium border border-emerald-500/20">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Confirmé
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2">
                      <div className="font-medium text-foreground">Meriem Khelifi</div>
                      <div className="text-[9px] text-muted-foreground">0770 45 67 89 (Constantine - 25)</div>
                    </td>
                    <td className="py-2 text-muted-foreground">Robe de Soirée Silk</td>
                    <td className="py-2 font-semibold text-foreground">22,000 DA</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-medium border border-rose-500/20">
                        <XCircle className="h-2.5 w-2.5" /> Refusé / Annulé
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2">
                      <div className="font-medium text-foreground">Amine Bouzid</div>
                      <div className="text-[9px] text-muted-foreground">0549 11 22 33 (Blida - 09)</div>
                    </td>
                    <td className="py-2 text-muted-foreground">Casque Bluetooth ANC</td>
                    <td className="py-2 font-semibold text-foreground">5,400 DA</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-medium border border-emerald-500/20">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Confirmé
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
