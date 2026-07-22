import React from 'react';
import { LogoIcon } from '../common/Logo';
import { 
  Home, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  Key, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Zap, 
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function DashboardLayout({ 
  merchant, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onOpenAddOrder, 
  children 
}) {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <Home className="h-4 w-4" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag className="h-4 w-4" />, badge: '12' },
    { id: 'templates', label: 'Modèles WhatsApp', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" /> },
    { id: 'apikeys', label: 'Clés API', icon: <Key className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex font-body text-foreground selection:bg-accent selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border/80 p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Logo & Merchant Name */}
          <div className="flex items-center gap-3">
            <LogoIcon size={54} className="h-14 w-auto shrink-0" />
            <div>
              <div className="font-heading font-black text-foreground tracking-tight text-lg">
                OrderConfirm
              </div>
              <span className="text-xs font-body text-muted-foreground block truncate max-w-[140px]">
                {merchant.business_name}
              </span>
            </div>
          </div>

          {/* New Order Quick Action */}
          <button
            onClick={onOpenAddOrder}
            className="w-full py-2.5 px-3 bg-accent text-white rounded-xl text-xs font-heading font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Commande</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">Navigation</span>
            <div className="mt-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Integrations Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> n8n Webhook
              </span>
              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">Actif</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Vos messages WhatsApp sont prêts à être synchronisés avec votre workflow n8n.
            </p>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center text-xs">
              DZ
            </div>
            <div className="text-left">
              <span className="text-xs font-medium text-foreground block truncate max-w-[110px]">
                {merchant.business_name}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> WhatsApp Lié
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Se déconnecter"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-background/80 backdrop-blur border-b border-border/80 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-normal text-foreground">
              {menuItems.find(i => i.id === activeTab)?.label || 'Tableau de bord'}
            </h1>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
              Algérie & Maghreb
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, wilaya..."
                className="pl-9 pr-4 py-1.5 bg-secondary/60 border border-border/70 rounded-full text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-64"
              />
            </div>

            <div className="h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center cursor-pointer hover:text-foreground">
              <Bell className="h-4 w-4" />
            </div>

            <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              Pro Marchand
            </span>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
