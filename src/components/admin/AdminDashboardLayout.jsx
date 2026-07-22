import React from 'react';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Bell, 
  Search, 
  ArrowLeft,
  Crown,
  ExternalLink,
  MessageSquare,
  Send
} from 'lucide-react';
import { LogoIcon } from '../common/Logo';

export default function AdminDashboardLayout({ 
  adminUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onSwitchToMerchantApp, 
  children 
}) {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <Home className="h-4 w-4" /> },
    { id: 'merchants', label: 'Gestion Marchands', icon: <Users className="h-4 w-4" /> },
    { id: 'admins', label: 'Administrateurs', icon: <ShieldCheck className="h-4 w-4 text-indigo-500" /> },
    { id: 'orders', label: 'Commandes Globales', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'templates', label: 'Modèles WhatsApp', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages WhatsApp', icon: <Send className="h-4 w-4" /> },
    { id: 'subscriptions', label: 'Abonnements', icon: <Crown className="h-4 w-4 text-amber-500" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex font-body text-foreground selection:bg-accent selection:text-white">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-background border-r border-border/80 p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          
          {/* Logo & Admin Branding */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <LogoIcon size={54} className="h-14 w-auto shrink-0" />
              <div>
                <div className="font-heading font-black text-foreground tracking-tight text-lg flex items-center gap-1.5">
                  <span>OrderConfirm</span>
                </div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 inline-block mt-0.5">
                  Espace Admin
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action: Back to Merchant App */}
          <button
            onClick={onSwitchToMerchantApp}
            className="w-full py-2.5 px-3 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Basculer Espace Marchand</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">
              Administration
            </span>
            <div className="mt-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="space-y-4 pt-4 border-t border-border/80">
          <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white font-heading font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
              AD
            </div>
            <div className="truncate">
              <span className="text-xs font-heading font-bold text-foreground block truncate">
                Super Administrateur
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                {adminUser?.email || 'admin@orderconfirm.dz'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-heading font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border/80 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-heading font-bold text-muted-foreground">URL Sécurisée :</span>
            <code className="text-xs font-mono bg-secondary px-2.5 py-1 rounded-md border border-border text-foreground">
              /admin-oc-2026
            </code>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-heading font-bold border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Accès Administrateur Restreint</span>
            </div>
          </div>
        </header>

        {/* Dynamic View Body */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
