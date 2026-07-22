import React, { useState, useEffect } from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import FeaturesSection from './components/landing/FeaturesSection';
import Footer from './components/landing/Footer';
import AuthModal from './components/auth/AuthModal';
import SignUpPage from './components/auth/SignUpPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OverviewTab from './components/dashboard/OverviewTab';
import OrdersTab from './components/dashboard/OrdersTab';
import TemplatesTab from './components/dashboard/TemplatesTab';
import SettingsTab from './components/dashboard/SettingsTab';
import ApiKeysTab from './components/dashboard/ApiKeysTab';

// Admin Components & Mock Data
import AdminDashboardLayout from './components/admin/AdminDashboardLayout';
import AdminOverviewTab from './components/admin/AdminOverviewTab';
import AdminAdminsTab from './components/admin/AdminAdminsTab';
import AdminOrdersTab from './components/admin/AdminOrdersTab';
import AdminTemplatesTab from './components/admin/AdminTemplatesTab';
import AdminMessagesTab from './components/admin/AdminMessagesTab';
import AdminSubscriptionsTab from './components/admin/AdminSubscriptionsTab';
import { mockAdminMerchants, mockPlatformStats } from './lib/mockAdminData';

import ErrorBoundary from './components/common/ErrorBoundary';
import { supabase, isSupabaseConfigured, initialMockState } from './lib/supabaseClient';
import { AlertTriangle, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const [view, setView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('admin-oc-2026')) {
      return 'admin';
    }
    if (path.includes('inscription') || path.includes('signup')) {
      return 'inscription';
    }
    if (path.includes('app')) {
      return 'app';
    }
    return 'landing';
  }); // 'landing' | 'inscription' | 'app' | 'admin'

  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  
  // Auth state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  // App Data State
  const [merchant, setMerchant] = useState(initialMockState.merchant);
  const [orders, setOrders] = useState(initialMockState.orders);
  const [templates, setTemplates] = useState(initialMockState.templates);
  const [apiKeys, setApiKeys] = useState(initialMockState.apiKeys);
  const [subscription, setSubscription] = useState(initialMockState.subscription);

  // Admin Data State
  const [adminMerchants, setAdminMerchants] = useState(mockAdminMerchants);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminSubscriptions, setAdminSubscriptions] = useState([]);
  const [platformStats, setPlatformStats] = useState(mockPlatformStats);

  // Listen to browser navigation & pathname updates
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin-oc-2026')) {
        setView('admin');
      } else if (path.includes('inscription') || path.includes('signup')) {
        setView('inscription');
      } else if (path.includes('connexion') || path.includes('login')) {
        setView('landing');
        setAuthMode('login');
        setIsAuthOpen(true);
      } else if (path.includes('app')) {
        setView('app');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Restore & Server-Validate Supabase Session on Mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Validate token with Supabase backend server (getUser makes an API request to Supabase Auth)
      supabase.auth.getUser().then(({ data, error }) => {
        if (error || !data?.user) {
          // Token is invalid, user was deleted on backend, or expired -> force logout & clear localStorage
          supabase.auth.signOut();
          setCurrentUser(null);
          localStorage.clear();
        } else {
          setCurrentUser(data.user);
        }
      });

      const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError || !userData?.user) {
            await supabase.auth.signOut();
            setCurrentUser(null);
            localStorage.clear();
          } else {
            setCurrentUser(userData.user);
          }
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        authListener?.unsubscribe();
      };
    }
  }, []);

  // Fetch Supabase Merchant Profile & Orders + Templates + Subscriptions + API Keys
  useEffect(() => {
    if (isSupabaseConfigured && currentUser) {
      const fetchData = async () => {
        try {
          // Verify user exists on backend before doing anything
          const { data: authCheck, error: authErr } = await supabase.auth.getUser();
          if (authErr || !authCheck?.user) {
            await supabase.auth.signOut();
            setCurrentUser(null);
            localStorage.clear();
            setView('landing');
            return;
          }

          // 1. Fetch current merchant profile
          const { data: fetchedMerchant } = await supabase
            .from('merchants')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          let activeMerchant = fetchedMerchant;
          if (!activeMerchant) {
            const { data: newM } = await supabase
              .from('merchants')
              .insert([{
                user_id: currentUser.id,
                business_name: currentUser.user_metadata?.business_name || 'Boutique El Bahia',
                phone: currentUser.user_metadata?.phone || '0550000000',
                plan: 'debutant',
                status: 'active',
                is_admin: currentUser.email === 'mahdi.kadri2020@gmail.com'
              }])
              .select('*')
              .single();
            activeMerchant = newM;
          }

          if (activeMerchant) {
            setMerchant(activeMerchant);
          }

          const currentMerchantId = activeMerchant?.id;

          if (currentMerchantId) {
            // 2. Fetch orders scoped strictly to this merchant
            const { data: ordersData } = await supabase
              .from('orders')
              .select('*')
              .eq('merchant_id', currentMerchantId)
              .order('created_at', { ascending: false });

            setOrders(ordersData || []);

            // 3. Fetch message templates scoped to this merchant
            const { data: templatesData } = await supabase
              .from('message_templates')
              .select('*')
              .eq('merchant_id', currentMerchantId);

            if (templatesData && templatesData.length > 0) {
              setTemplates(templatesData);
            } else {
              setTemplates([
                {
                  id: 't-default',
                  merchant_id: currentMerchantId,
                  template_text: 'Bonjour {customer_name} 👋, merci pour votre commande de {product} pour un montant de {price} DA. Veuillez répondre par *1* pour CONFIRMER votre livraison à {wilaya} ({address}) ou *2* pour ANNULER.',
                  is_default: true
                }
              ]);
            }

            // 4. Fetch subscription scoped to this merchant
            const { data: subData } = await supabase
              .from('subscriptions')
              .select('*')
              .eq('merchant_id', currentMerchantId)
              .maybeSingle();

            if (subData) {
              setSubscription({
                plan_name: subData.plan_name || 'Débutant',
                orders_limit: subData.orders_limit || 1000,
                orders_used: ordersData?.length || 0,
                current_period_end: subData.current_period_end || '2026-08-15'
              });
            } else {
              setSubscription({
                plan_name: merchantData?.plan || 'Débutant',
                orders_limit: 1000,
                orders_used: ordersData?.length || 0,
                current_period_end: '2026-08-15'
              });
            }

            // 5. Fetch API keys scoped to this merchant
            const { data: keysData } = await supabase
              .from('api_keys')
              .select('*')
              .eq('merchant_id', currentMerchantId);

            setApiKeys(keysData || []);
          } else {
            setOrders([]);
            setApiKeys([]);
          }

          // 6. If admin, fetch all platform-wide resources using admin view and relations
          if (merchantData?.is_admin) {
            try {
              // 6a. Merchants with email view
              const { data: merchantsWithEmailData } = await supabase
                .from('merchants_with_email')
                .select('*')
                .order('created_at', { ascending: false });

              if (merchantsWithEmailData && merchantsWithEmailData.length > 0) {
                setAdminMerchants(merchantsWithEmailData);
              } else {
                const { data: rawMerchantsData } = await supabase
                  .from('merchants')
                  .select('*')
                  .order('created_at', { ascending: false });
                if (rawMerchantsData) setAdminMerchants(rawMerchantsData);
              }
            } catch (mErr) {
              console.warn('Error fetching merchants_with_email:', mErr);
            }

            try {
              // 6b. All orders across merchants
              const { data: allOrdersData } = await supabase
                .from('orders')
                .select('*, merchants(business_name)')
                .order('created_at', { ascending: false });

              if (allOrdersData) {
                setAdminOrders(allOrdersData.map((o) => ({
                  ...o,
                  merchant_business_name: o.merchants?.business_name || 'Boutique Marchande'
                })));
              }
            } catch (oErr) {
              console.warn('Error fetching admin orders:', oErr);
            }

            try {
              // 6c. All message templates across merchants
              const { data: allTemplatesData } = await supabase
                .from('message_templates')
                .select('*, merchants(business_name)')
                .order('created_at', { ascending: false });

              if (allTemplatesData) {
                setAdminTemplates(allTemplatesData.map((t) => ({
                  ...t,
                  merchant_business_name: t.merchants?.business_name || 'Boutique Marchande'
                })));
              }
            } catch (tErr) {
              console.warn('Error fetching admin templates:', tErr);
            }

            try {
              // 6d. All whatsapp messages across merchants
              const { data: allMessagesData } = await supabase
                .from('whatsapp_messages')
                .select('*, merchants(business_name)')
                .order('created_at', { ascending: false });

              if (allMessagesData) {
                setAdminMessages(allMessagesData.map((m) => ({
                  ...m,
                  merchant_business_name: m.merchants?.business_name || 'Boutique Marchande'
                })));
              }
            } catch (msgErr) {
              console.warn('Error fetching admin whatsapp_messages:', msgErr);
            }

            try {
              // 6e. All subscriptions across merchants
              const { data: allSubscriptionsData } = await supabase
                .from('subscriptions')
                .select('*, merchants(business_name)')
                .order('created_at', { ascending: false });

              if (allSubscriptionsData) {
                setAdminSubscriptions(allSubscriptionsData.map((s) => ({
                  ...s,
                  merchant_business_name: s.merchants?.business_name || 'Boutique Marchande'
                })));
              }
            } catch (subErr) {
              console.warn('Error fetching admin subscriptions:', subErr);
            }
          }
        } catch (err) {
          console.warn('Error fetching Supabase merchant resources:', err);
        }
      };

      fetchData();

      // Realtime Subscription on Orders table
      const channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser]);

  // Auth Handlers
  const handleOpenAuth = (mode = 'login') => {
    if (mode === 'signup') {
      setView('inscription');
      window.history.pushState({}, '', '/inscription');
    } else {
      setAuthMode('login');
      setIsAuthOpen(true);
      window.history.pushState({}, '', '/connexion');
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user?.business_name) {
      setMerchant((prev) => ({ ...prev, business_name: user.business_name }));
    }
    
    // Check if user navigated to admin path or has admin role
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('admin-oc-2026') || user?.is_admin || user?.user_metadata?.is_admin) {
      setView('admin');
      window.history.pushState({}, '', '/admin-oc-2026');
    } else {
      setView('app');
      window.history.pushState({}, '', '/app');
    }
  };

  const handleLogout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setCurrentUser(null);
    try {
      localStorage.clear();
    } catch (e) {
      // Ignore
    }
    setMerchant(initialMockState.merchant);
    setOrders([]);
    setApiKeys([]);
    setView('landing');
    window.history.pushState({}, '', '/');
  };

  // Orders Actions
  const handleAddOrder = async (newOrder) => {
    let activeMerchantId = merchant?.id;

    // Resolve real merchant UUID if currently mock or empty
    if (isSupabaseConfigured && currentUser && (!activeMerchantId || activeMerchantId === 'demo-merchant-dz-16')) {
      const { data: mData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (mData?.id) {
        activeMerchantId = mData.id;
        setMerchant((prev) => ({ ...prev, id: mData.id }));
      }
    }

    const orderPayload = {
      merchant_id: activeMerchantId || merchant.id,
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      product: newOrder.product,
      price: Number(newOrder.price || 0),
      wilaya: newOrder.wilaya,
      address: newOrder.address || '',
      status: newOrder.status || 'pending',
      created_at: newOrder.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured && currentUser) {
      if (!activeMerchantId || activeMerchantId === 'demo-merchant-dz-16') {
        throw new Error("Identifiant marchand introuvable.");
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select('*')
        .single();

      if (error) {
        console.error("Erreur d'insertion de la commande dans Supabase :", error);
        throw error;
      }

      if (data) {
        setOrders((prev) => [data, ...prev.filter((o) => o.id !== newOrder.id)]);
        setSubscription((prev) => ({ ...prev, orders_used: (prev?.orders_used || 0) + 1 }));
        return data;
      }
    } else {
      const localOrder = { ...newOrder, merchant_id: activeMerchantId || merchant.id };
      setOrders((prev) => [localOrder, ...prev]);
      setSubscription((prev) => ({ ...prev, orders_used: (prev?.orders_used || 0) + 1 }));
      return localOrder;
    }
  };

  const handleImportCSV = async (newOrders) => {
    let activeMerchantId = merchant?.id;

    if (isSupabaseConfigured && currentUser && (!activeMerchantId || activeMerchantId === 'demo-merchant-dz-16')) {
      const { data: mData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (mData?.id) {
        activeMerchantId = mData.id;
        setMerchant((prev) => ({ ...prev, id: mData.id }));
      }
    }

    const dbRows = newOrders.map((o) => ({
      merchant_id: activeMerchantId || merchant.id,
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      product: o.product,
      price: Number(o.price || 0),
      wilaya: o.wilaya,
      address: o.address || '',
      status: o.status || 'pending',
      created_at: o.created_at || new Date().toISOString()
    }));

    if (isSupabaseConfigured && currentUser) {
      if (!activeMerchantId || activeMerchantId === 'demo-merchant-dz-16') {
        throw new Error("Identifiant marchand introuvable.");
      }

      const { data, error } = await supabase
        .from('orders')
        .insert(dbRows)
        .select('*');

      if (error) {
        console.error("Erreur d'importation CSV dans Supabase :", error);
        throw error;
      }

      if (data && data.length > 0) {
        setOrders((prev) => [...data, ...prev]);
        setSubscription((prev) => ({ ...prev, orders_used: (prev?.orders_used || 0) + data.length }));
        return data;
      }
    } else {
      setOrders((prev) => [...dbRows, ...prev]);
      setSubscription((prev) => ({ ...prev, orders_used: (prev?.orders_used || 0) + newOrders.length }));
      return dbRows;
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : o.confirmed_at
            }
          : o
      )
    );

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    }
  };

  const handleEditOrder = async (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
    );

    if (isSupabaseConfigured && currentUser) {
      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: updatedOrder.customer_name,
          customer_phone: updatedOrder.customer_phone,
          product: updatedOrder.product,
          price: Number(updatedOrder.price || 0),
          wilaya: updatedOrder.wilaya,
          address: updatedOrder.address || '',
          status: updatedOrder.status || 'pending'
        })
        .eq('id', updatedOrder.id);

      if (error) {
        console.error("Erreur lors de la modification de la commande :", error);
        throw error;
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    if (isSupabaseConfigured && currentUser) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error("Erreur lors de la suppression de la commande :", error);
        throw error;
      }
    }
  };

  // Templates Actions
  const handleSaveTemplate = async (id, text) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, template_text: text } : t))
    );

    if (isSupabaseConfigured && currentUser && merchant.id) {
      await supabase.from('message_templates').upsert([
        {
          merchant_id: merchant.id,
          template_text: text,
          is_default: true
        }
      ]);
    }
  };

  // Settings Actions
  const handleSaveSettings = async (updatedMerchant) => {
    setMerchant((prev) => ({ ...prev, ...updatedMerchant }));

    if (isSupabaseConfigured && currentUser && merchant.id) {
      await supabase
        .from('merchants')
        .update({
          business_name: updatedMerchant.business_name,
          phone: updatedMerchant.phone,
          status: updatedMerchant.status
        })
        .eq('id', merchant.id);
    }
  };

  // API Keys Actions
  const handleGenerateKey = async (newKeyObj) => {
    const newKeyItem = {
      id: `k-${Date.now()}`,
      merchant_id: merchant.id,
      name: newKeyObj.name,
      key_prefix: newKeyObj.key_prefix,
      created_at: 'À l\'instant',
      last_used: 'Jamais'
    };

    setApiKeys((prev) => [newKeyItem, ...prev]);

    if (isSupabaseConfigured && currentUser && merchant.id) {
      await supabase.from('api_keys').insert([
        {
          merchant_id: merchant.id,
          name: newKeyObj.name,
          key_prefix: newKeyObj.key_prefix,
          key_hash: newKeyObj.full_secret || newKeyObj.key_prefix
        }
      ]);
    }
  };

  const handleRevokeKey = async (keyId) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));

    if (isSupabaseConfigured && currentUser) {
      await supabase.from('api_keys').delete().eq('id', keyId);
    }
  };

  // Admin Actions
  const handleToggleMerchantStatus = (merchantId) => {
    setAdminMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? { ...m, status: m.status === 'suspended' ? 'active' : 'suspended' }
          : m
      )
    );

    if (isSupabaseConfigured && currentUser) {
      const target = adminMerchants.find((m) => m.id === merchantId);
      const newStatus = target?.status === 'suspended' ? 'active' : 'suspended';
      supabase.from('merchants').update({ status: newStatus }).eq('id', merchantId);
    }
  };

  const handleChangeMerchantPlan = (merchantId, newPlan) => {
    setAdminMerchants((prev) =>
      prev.map((m) => (m.id === merchantId ? { ...m, plan: newPlan } : m))
    );

    if (isSupabaseConfigured && currentUser) {
      supabase.from('merchants').update({ plan: newPlan }).eq('id', merchantId);
    }
  };

  // RENDER ADMIN DASHBOARD VIEW (/admin-oc-2026)
  if (view === 'admin') {
    // Check security: user must be admin or viewing hidden path in demo mode
    const isPathAdmin = window.location.pathname.toLowerCase().includes('admin-oc-2026');
    const isUserAdmin = merchant?.is_admin || currentUser?.is_admin || Boolean(currentUser?.user_metadata?.is_admin);

    // If logged in as non-admin trying to access hidden route, show 404 or redirect to app
    if (currentUser && !isUserAdmin && !isSupabaseConfigured) {
      // In offline preview mode with explicit admin URL, allow viewing admin dashboard for preview
    } else if (currentUser && !isUserAdmin) {
      return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center font-body">
          <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-foreground">404 — Page non trouvée</h1>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            La page que vous recherchez n'existe pas ou vous n'avez pas les autorisations nécessaires pour y accéder.
          </p>
          <button
            onClick={() => {
              setView('app');
              window.history.pushState({}, '', '/app');
            }}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au Tableau de bord Marchand</span>
          </button>
        </div>
      );
    }

    return (
      <AdminDashboardLayout
        adminUser={currentUser || { email: 'admin@orderconfirm.dz' }}
        activeTab={activeAdminTab}
        setActiveTab={setActiveAdminTab}
        onLogout={handleLogout}
        onSwitchToMerchantApp={() => {
          setView('app');
          window.history.pushState({}, '', '/app');
        }}
      >
        <ErrorBoundary>
          {activeAdminTab === 'overview' && (
            <AdminOverviewTab
              merchants={adminMerchants}
              platformStats={platformStats}
              onToggleMerchantStatus={handleToggleMerchantStatus}
              onChangeMerchantPlan={handleChangeMerchantPlan}
            />
          )}

          {activeAdminTab === 'merchants' && (
            <AdminOverviewTab
              merchants={adminMerchants}
              platformStats={platformStats}
              onToggleMerchantStatus={handleToggleMerchantStatus}
              onChangeMerchantPlan={handleChangeMerchantPlan}
            />
          )}

          {activeAdminTab === 'admins' && (
            <AdminAdminsTab merchants={adminMerchants} />
          )}

          {activeAdminTab === 'orders' && (
            <AdminOrdersTab orders={adminOrders.length > 0 ? adminOrders : orders} />
          )}

          {activeAdminTab === 'templates' && (
            <AdminTemplatesTab templates={adminTemplates.length > 0 ? adminTemplates : templates} />
          )}

          {activeAdminTab === 'messages' && (
            <AdminMessagesTab whatsappMessages={adminMessages} />
          )}

          {activeAdminTab === 'subscriptions' && (
            <AdminSubscriptionsTab subscriptions={adminSubscriptions} />
          )}
        </ErrorBoundary>
      </AdminDashboardLayout>
    );
  }

  // RENDER DEDICATED SIGNUP PAGE / ROUTE (/inscription)
  if (view === 'inscription') {
    return (
      <SignUpPage
        onGoToLogin={() => {
          setView('landing');
          setAuthMode('login');
          setIsAuthOpen(true);
          window.history.pushState({}, '', '/connexion');
        }}
        onAuthSuccess={handleAuthSuccess}
        onGoHome={() => {
          setView('landing');
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  // RENDER APP VIEWS
  if (view === 'app') {
    return (
      <DashboardLayout
        merchant={merchant}
        activeTab={activeDashboardTab}
        setActiveTab={setActiveDashboardTab}
        onLogout={handleLogout}
        onOpenAddOrder={() => setActiveDashboardTab('orders')}
        onGoToAdmin={() => {
          setView('admin');
          window.history.pushState({}, '', '/admin-oc-2026');
        }}
      >
        <ErrorBoundary>
          {activeDashboardTab === 'overview' && (
            <OverviewTab
              orders={orders}
              onSelectTab={setActiveDashboardTab}
              onOpenAddOrder={() => setActiveDashboardTab('orders')}
            />
          )}

          {activeDashboardTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onAddOrder={handleAddOrder}
              onImportCSV={handleImportCSV}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeDashboardTab === 'templates' && (
            <TemplatesTab
              templates={templates}
              onSaveTemplate={handleSaveTemplate}
            />
          )}

          {activeDashboardTab === 'settings' && (
            <SettingsTab
              merchant={merchant}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {activeDashboardTab === 'apikeys' && (
            <ApiKeysTab
              apiKeys={apiKeys}
              onGenerateKey={handleGenerateKey}
              onRevokeKey={handleRevokeKey}
            />
          )}
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  // RENDER LANDING PAGE VIEW
  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-foreground">
      {/* 100vh Hero Container */}
      <div className="h-screen flex flex-col bg-background overflow-hidden relative">
        <Navbar onOpenAuth={handleOpenAuth} onGoToApp={() => setView('app')} />
        <Hero onOpenAuth={handleOpenAuth} onGoToApp={() => setView('app')} />
      </div>

      {/* Additional Marketing Content Sections */}
      <FeaturesSection onGoToApp={() => setView('inscription')} />
      <Footer onGoToApp={() => setView('app')} />

      {/* Auth Modal (Inscription / Connexion) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
