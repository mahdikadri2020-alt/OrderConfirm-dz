import React, { useState } from 'react';
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
  Plus,
  Menu,
  X,
  User,
  Shield
} from 'lucide-react';

export default function DashboardLayout({ 
  merchant, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onOpenAddOrder, 
  children 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <Home className="h-4 w-4" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag className="h-4 w-4" />, badge: '12' },
    { id: 'templates', label: 'Modèles WhatsApp', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" /> },
    { id: 'apikeys', label: 'Clés API', icon: <Key className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col md:flex-row font-body text-foreground selection:bg-accent selection:text-white relative">
      
      {/* 1. Desktop Sidebar (Hidden on Mobile < 768px) */}
      <aside className="hidden md:flex w-64 bg-background border-r border-border/80 p-5 flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Logo & Merchant Name */}
          <div className="flex items-center gap-3">
            <LogoIcon size={50} className="h-12 w-auto shrink-0" />
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
            className="w-full py-2.5 px-3 bg-accent text-white rounded-xl text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Commande</span>
          </button>

          {/* Admin Portal Quick Action Button */}
          {merchant?.is_admin && (
            <button
              onClick={onGoToAdmin}
              className="w-full py-2.5 px-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-heading font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Espace Administrateur</span>
            </button>
          )}

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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent font-extrabold'
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
              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-700">
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
            <div className="h-8 w-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
              DZ
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-foreground block truncate max-w-[110px]">
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

      {/* 2. Mobile Top App Bar (< 768px) */}
      <header className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <LogoIcon size={32} className="h-8 w-auto shrink-0" />
          <div>
            <div className="font-heading font-black text-foreground text-sm tracking-tight leading-none">OrderConfirm</div>
            <span className="text-[10px] text-muted-foreground block truncate max-w-[120px] font-body mt-0.5">
              {merchant.business_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddOrder}
            className="px-2.5 py-1.5 bg-accent text-white rounded-full text-[11px] font-heading font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Commande</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 rounded-xl bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer Overlay (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-xs bg-background h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-accent/20 text-accent font-heading font-black flex items-center justify-center text-sm">
                    DZ
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-xs text-foreground truncate max-w-[150px]">{merchant.business_name}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> WhatsApp Lié
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {merchant?.is_admin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onGoToAdmin) onGoToAdmin();
                  }}
                  className="w-full py-2.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-heading font-extrabold flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Espace Administrateur</span>
                </button>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">Navigation</span>
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-heading font-bold transition-all ${
                        isActive
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Integrations Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-amber-700">
                    <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> n8n Webhook
                  </span>
                  <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">Actif</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Synchronisé en temps réel avec votre bot WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full py-3 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        {/* Desktop Top Header (Hidden on Mobile) */}
        <header className="hidden md:flex h-16 bg-background/80 backdrop-blur border-b border-border/80 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-xl text-foreground">
              {menuItems.find(i => i.id === activeTab)?.label || 'Tableau de bord'}
            </h1>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full font-heading font-semibold">
              Algérie & Maghreb
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-1.5 bg-secondary/60 border border-border/70 rounded-full text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-60"
              />
            </div>

            <div className="h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center cursor-pointer hover:text-foreground">
              <Bell className="h-4 w-4" />
            </div>

            <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold">
              Pro Marchand
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border/80 flex items-center justify-around py-2 px-1 font-heading text-muted-foreground shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            activeTab === 'overview' ? 'text-accent font-extrabold' : 'hover:text-foreground'
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[9px]">Accueil</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-0.5 relative transition-colors ${
            activeTab === 'orders' ? 'text-accent font-extrabold' : 'hover:text-foreground'
          }`}
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <span className="text-[9px]">Commandes</span>
          <span className="absolute -top-1 right-1 h-3.5 w-3.5 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            12
          </span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            activeTab === 'templates' ? 'text-accent font-extrabold' : 'hover:text-foreground'
          }`}
        >
          <MessageSquare className="h-4.5 w-4.5" />
          <span className="text-[9px]">Modèles</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            activeTab === 'settings' ? 'text-accent font-extrabold' : 'hover:text-foreground'
          }`}
        >
          <Settings className="h-4.5 w-4.5" />
          <span className="text-[9px]">Paramètres</span>
        </button>
      </nav>

    </div>
  );
}
