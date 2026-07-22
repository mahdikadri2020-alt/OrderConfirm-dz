import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  ShoppingBag, 
  Zap,
  MapPin,
  Send,
  Plus,
  Package,
  Sparkles,
  BarChart2,
  AlertCircle
} from 'lucide-react';

export default function OverviewTab({ orders = [], onSelectTab, onOpenAddOrder }) {
  // Real dynamic calculations from merchant's scoped orders
  const totalOrders = orders.length;
  const confirmedOrders = useMemo(() => orders.filter(o => o.status === 'confirmed').length, [orders]);
  const rejectedOrders = useMemo(() => orders.filter(o => o.status === 'rejected').length, [orders]);
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending').length, [orders]);
  
  const confirmationRate = useMemo(() => {
    return totalOrders > 0 ? ((confirmedOrders / totalOrders) * 100).toFixed(1) : '0';
  }, [totalOrders, confirmedOrders]);

  const totalRevenueConfirmed = useMemo(() => {
    return orders
      .filter(o => o.status === 'confirmed')
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  }, [orders]);

  // Real Dynamic Top Wilayas Aggregation
  const topWilayas = useMemo(() => {
    if (orders.length === 0) return [];
    
    const wilayaMap = {};
    orders.forEach((o) => {
      const name = o.wilaya || 'Non spécifiée';
      if (!wilayaMap[name]) {
        wilayaMap[name] = { total: 0, confirmed: 0 };
      }
      wilayaMap[name].total += 1;
      if (o.status === 'confirmed') {
        wilayaMap[name].confirmed += 1;
      }
    });

    return Object.entries(wilayaMap)
      .map(([name, data]) => ({
        name,
        count: data.total,
        rate: ((data.confirmed / data.total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Real Dynamic 7-Day Chart Data Calculation
  const chartData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? "Aujourd'hui" : d.toLocaleDateString('fr-FR', { weekday: 'short' });

      // Count orders created on or before this day
      const dayOrders = orders.filter(o => {
        if (!o.created_at) return false;
        return o.created_at.split('T')[0] === dateStr;
      });

      const dayTotal = dayOrders.length;
      const dayConfirmed = dayOrders.filter(o => o.status === 'confirmed').length;
      const dayRate = dayTotal > 0 ? (dayConfirmed / dayTotal) * 100 : 0;

      days.push({
        label: dayLabel,
        date: dateStr,
        count: dayTotal,
        confirmed: dayConfirmed,
        rate: dayRate
      });
    }

    return days;
  }, [orders]);

  // Compute SVG Path points for the 7-day chart
  const svgChartPath = useMemo(() => {
    if (totalOrders === 0) {
      return { path: "M 0,130 L 500,130", area: "M 0,130 L 500,130 L 500,140 L 0,140 Z", points: [] };
    }

    const width = 500;
    const height = 120;
    const paddingY = 15;

    const points = chartData.map((d, index) => {
      const x = (index / (chartData.length - 1)) * width;
      // y ranges from (height - paddingY) at 0% to paddingY at 100%
      const y = height - ((d.rate / 100) * (height - 2 * paddingY) + paddingY);
      return { x, y, rate: d.rate, day: d.label };
    });

    // Build cubic bezier curve or smooth line path
    let pathD = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      pathD += ` C ${cx1},${cy1} ${cx2},${cy2} ${curr.x},${curr.y}`;
    }

    const areaD = `${pathD} L 500,140 L 0,140 Z`;
    return { path: pathD, area: areaD, points };
  }, [chartData, totalOrders]);

  return (
    <div className="space-y-6 font-body">
      
      {/* Welcome / Status Alert Banner */}
      {totalOrders === 0 ? (
        <div className="bg-gradient-to-r from-accent/10 via-background to-background rounded-3xl p-6 border border-accent/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-heading font-extrabold text-foreground">
                Bienvenue sur OrderConfirm ! 🚀
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl leading-relaxed font-body">
                Votre compte marchand est prêt. Ajoutez votre première commande ou importez un fichier CSV pour lancer la confirmation automatique par WhatsApp.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAddOrder}
            className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-full text-xs font-heading font-bold transition-all shrink-0 shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter votre 1ère commande</span>
          </button>
        </div>
      ) : (
        <div className="bg-background rounded-2xl p-5 border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-extrabold text-foreground">Relances WhatsApp automatiques actives</h3>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} commande(s) en attente de réponse sur WhatsApp. Synchronisé en temps réel.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAddOrder}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-heading font-bold hover:bg-primary/90 transition-all shrink-0"
          >
            + Ajouter une commande
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Orders */}
        <div className="bg-background rounded-2xl p-5 border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-heading font-bold uppercase text-[11px] tracking-wider">Total Commandes</span>
            <ShoppingBag className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{totalOrders}</span>
            {totalOrders > 0 ? (
              <span className="text-[11px] font-heading font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                En direct
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                0 enregistrée
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mt-2 font-body">
            {totalOrders > 0 ? 'Sur l’ensemble du compte' : 'Aucune commande créée'}
          </span>
        </div>

        {/* Card 2: Confirmation Rate */}
        <div className="bg-background rounded-2xl p-5 border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-heading font-bold uppercase text-[11px] tracking-wider">Taux de Confirmation</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{confirmationRate}%</span>
            {totalOrders > 0 ? (
              <span className="text-[11px] font-heading font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {confirmedOrders}/{totalOrders} valides
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                Pas de données
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 font-body">
            {totalOrders > 0 ? `${confirmedOrders} confirmée(s) par WhatsApp` : 'En attente de relances'}
          </span>
        </div>

        {/* Card 3: Rejected Orders */}
        <div className="bg-background rounded-2xl p-5 border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-heading font-bold uppercase text-[11px] tracking-wider">Commandes Annulées</span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{rejectedOrders}</span>
            {rejectedOrders > 0 ? (
              <span className="text-[11px] font-heading font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Évités à l’envoi
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                0 annulation
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mt-2 font-body">
            {rejectedOrders > 0 ? 'Frais d’expédition économisés' : 'Aucune annulation détectée'}
          </span>
        </div>

        {/* Card 4: Confirmed Revenue */}
        <div className="bg-background rounded-2xl p-5 border border-border/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="font-heading font-bold uppercase text-[11px] tracking-wider">Chiffre d'Affaires Confirmé</span>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-heading font-extrabold tracking-tight text-foreground truncate">
              {totalRevenueConfirmed.toLocaleString('fr-FR')} <span className="text-xs font-bold text-muted-foreground">DA</span>
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-2 font-body">
            {totalRevenueConfirmed > 0 ? 'Prêt pour expédition Yalidine/ZR' : 'Revenu des commandes confirmées'}
          </span>
        </div>

      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Realtime Confirmation Rate Chart */}
        <div className="lg:col-span-2 bg-background rounded-2xl p-6 border border-border/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-extrabold text-foreground">Taux de confirmation en temps réel</h3>
              <p className="text-xs text-muted-foreground">Évolution des réponses des clients sur WhatsApp cette semaine</p>
            </div>
            <span className="text-xs font-heading font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              {totalOrders > 0 ? 'Données Réelles' : 'Semaine en cours'}
            </span>
          </div>

          {totalOrders === 0 ? (
            <div className="h-56 w-full flex flex-col items-center justify-center p-6 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/80">
              <BarChart2 className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <h4 className="text-sm font-heading font-bold text-foreground">Aucune donnée de confirmation cette semaine</h4>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Le graphique s'actualisera automatiquement dès que vous aurez créé des commandes et envoyé vos premières relances WhatsApp.
              </p>
            </div>
          ) : (
            <>
              <div className="h-56 w-full pt-4 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="hsl(239, 84%, 67%)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Horizontal Grid Lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <line x1="0" y1="65" x2="500" y2="65" stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="hsl(var(--border))" strokeDasharray="3 3" />

                  {/* Gradient Fill & Dynamic Curve */}
                  <path d={svgChartPath.area} fill="url(#overviewGradient)" />
                  <path d={svgChartPath.path} fill="none" stroke="hsl(239, 84%, 67%)" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Dynamic Points */}
                  {svgChartPath.points.map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="hsl(239, 84%, 67%)" className="hover:scale-125 transition-transform" />
                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#FFFFFF" />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60 font-mono">
                {chartData.map((d, i) => (
                  <span key={i} className="text-center">
                    <span className="block font-heading font-semibold text-[11px]">{d.label}</span>
                    <span className="text-[10px] text-accent">{d.count > 0 ? `${Math.round(d.rate)}%` : '—'}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Real Dynamic Top Wilayas Breakdown */}
        <div className="bg-background rounded-2xl p-6 border border-border/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-heading font-extrabold text-foreground">Top Wilayas</h3>
              <MapPin className="h-4 w-4 text-accent" />
            </div>

            {topWilayas.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-heading font-bold text-foreground">Aucune wilaya enregistrée</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Vos principales wilayas d'Algérie et leurs taux de confirmation s'afficheront ici après l'ajout de vos commandes.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {topWilayas.map((w, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-foreground font-heading font-bold">{w.name}</span>
                      <span className="text-emerald-600 font-semibold">{w.rate}% ({w.count} com.)</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(Number(w.rate), 8)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab('orders')}
            className="mt-6 text-xs text-accent font-heading font-bold hover:underline text-center block w-full"
          >
            Voir la gestion des commandes →
          </button>
        </div>
      </div>

      {/* Real Dynamic Recent Activity Stream */}
      <div className="bg-background rounded-2xl p-6 border border-border/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-heading font-extrabold text-foreground">Dernières interactions WhatsApp</h3>
            <p className="text-xs text-muted-foreground">Mises à jour automatiques des commandes de votre boutique</p>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs font-heading font-bold text-accent hover:underline"
          >
            Voir toutes les commandes
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center bg-secondary/20 rounded-xl border border-dashed border-border/60">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs font-heading font-bold text-foreground">Aucune interaction WhatsApp récente</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Les confirmations et annulations envoyées par vos clients s'afficheront ici en temps réel.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    order.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-600' :
                    order.status === 'rejected' ? 'bg-rose-500/15 text-rose-600' :
                    'bg-amber-500/15 text-amber-600'
                  }`}>
                    {order.status === 'confirmed' ? <CheckCircle2 className="h-4.5 w-4.5" /> :
                     order.status === 'rejected' ? <XCircle className="h-4.5 w-4.5" /> :
                     <Clock className="h-4.5 w-4.5" />}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground">{order.customer_name}</h4>
                    <span className="text-[11px] text-muted-foreground">
                      {order.product} • {order.wilaya}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-heading font-bold text-foreground block">{Number(order.price || 0).toLocaleString()} DA</span>
                  <span className={`text-[10px] font-heading font-bold capitalize ${
                    order.status === 'confirmed' ? 'text-emerald-600' :
                    order.status === 'rejected' ? 'text-rose-600' :
                    'text-amber-600'
                  }`}>
                    {order.status === 'confirmed' ? 'Confirmé' : order.status === 'rejected' ? 'Annulé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
