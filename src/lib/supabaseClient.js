import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const now = Date.now();
const DAY = 86400000;

// High-performing realistic mock orders dataset for "Essai gratuit" trial preview
export const generateMockOrders = () => [
  // Today (Day 0)
  {
    id: 'ord-2001',
    customer_name: 'Karim Benali',
    customer_phone: '0550 12 34 56',
    product: 'Pack Chaussures Sport Pro X',
    price: 14500,
    wilaya: '16 - Alger',
    address: 'Hydra, Rue Ahmed Ghermoul',
    status: 'confirmed',
    created_at: new Date(now - 0.1 * DAY).toISOString(),
    confirmed_at: new Date(now - 0.05 * DAY).toISOString(),
    messages: [
      { id: 'm1', content: 'Bonjour Karim Benali 👋, merci pour votre commande de Pack Chaussures Sport Pro X (14500 DA). Répondez 1 pour CONFIRMER ou 2 pour ANNULER.', direction: 'outgoing', status: 'delivered', time: '14:20' },
      { id: 'm2', content: '1 Oui je confirme merci', direction: 'incoming', status: 'read', time: '14:22' }
    ]
  },
  {
    id: 'ord-2002',
    customer_name: 'Yassine Saidi',
    customer_phone: '0661 98 76 54',
    product: 'Montre Connectée Z4 Ultra',
    price: 8900,
    wilaya: '31 - Oran',
    address: 'Es Senia, Boulevard ALN',
    status: 'confirmed',
    created_at: new Date(now - 0.2 * DAY).toISOString(),
    confirmed_at: new Date(now - 0.15 * DAY).toISOString(),
    messages: [
      { id: 'm3', content: 'Bonjour Yassine Saidi 👋, confirmation de votre commande...', direction: 'outgoing', status: 'delivered', time: '13:10' },
      { id: 'm4', content: '1', direction: 'incoming', status: 'read', time: '13:15' }
    ]
  },
  {
    id: 'ord-2003',
    customer_name: 'Sofiane Hamidi',
    customer_phone: '0770 12 34 88',
    product: 'Écouteurs Sans Fil Pro',
    price: 6500,
    wilaya: '16 - Alger',
    address: 'Kouba, Garidi 2',
    status: 'confirmed',
    created_at: new Date(now - 0.3 * DAY).toISOString(),
    confirmed_at: new Date(now - 0.25 * DAY).toISOString()
  },
  {
    id: 'ord-2004',
    customer_name: 'Nour El Houda',
    customer_phone: '0555 99 88 77',
    product: 'Sac à Main Cuir Véritable',
    price: 12800,
    wilaya: '25 - Constantine',
    address: 'Cité Bellevue',
    status: 'pending',
    created_at: new Date(now - 0.4 * DAY).toISOString()
  },
  {
    id: 'ord-2005',
    customer_name: 'Walid Brahimi',
    customer_phone: '0540 33 22 11',
    product: 'Parfum Oud Royal Edition',
    price: 9500,
    wilaya: '09 - Blida',
    address: 'Boufarik, Rue des Frères',
    status: 'confirmed',
    created_at: new Date(now - 0.5 * DAY).toISOString()
  },

  // Yesterday (Day 1)
  {
    id: 'ord-2006',
    customer_name: 'Meriem Khelifi',
    customer_phone: '0770 45 67 89',
    product: 'Robe de Soirée Silk Elegance',
    price: 22000,
    wilaya: '16 - Alger',
    address: 'Chéraga, Cité 104 Logements',
    status: 'confirmed',
    created_at: new Date(now - 1.1 * DAY).toISOString()
  },
  {
    id: 'ord-2007',
    customer_name: 'Amine Bouzid',
    customer_phone: '0549 11 22 33',
    product: 'Casque Bluetooth ANC HD',
    price: 7400,
    wilaya: '31 - Oran',
    address: 'Courbet, Akid Lotfi',
    status: 'confirmed',
    created_at: new Date(now - 1.3 * DAY).toISOString()
  },
  {
    id: 'ord-2008',
    customer_name: 'Khaled Benaissa',
    customer_phone: '0662 44 55 66',
    product: 'Pack T-Shirts Premium (x3)',
    price: 4900,
    wilaya: '19 - Sétif',
    address: 'Avenue 8 Mai 1945',
    status: 'confirmed',
    created_at: new Date(now - 1.5 * DAY).toISOString()
  },
  {
    id: 'ord-2009',
    customer_name: 'Lina Touati',
    customer_phone: '0550 77 11 22',
    product: 'Lisseur Cheveux Infrarouge',
    price: 8500,
    wilaya: '23 - Annaba',
    address: 'El Bouni Centre',
    status: 'rejected',
    created_at: new Date(now - 1.7 * DAY).toISOString()
  },

  // 2 Days Ago (Day 2)
  {
    id: 'ord-2010',
    customer_name: 'Abderrahmane Ouali',
    customer_phone: '0771 88 99 00',
    product: 'Veste Cuir Homme Biker',
    price: 18500,
    wilaya: '16 - Alger',
    address: 'El Biar, Place Kennedy',
    status: 'confirmed',
    created_at: new Date(now - 2.1 * DAY).toISOString()
  },
  {
    id: 'ord-2011',
    customer_name: 'Samira Belkacem',
    customer_phone: '0552 33 44 55',
    product: 'Coffret Cosmetique Bio',
    price: 11200,
    wilaya: '31 - Oran',
    address: 'Maraval Centre',
    status: 'confirmed',
    created_at: new Date(now - 2.3 * DAY).toISOString()
  },
  {
    id: 'ord-2012',
    customer_name: 'Riad Madani',
    customer_phone: '0660 11 22 44',
    product: 'Caméra Surveillance WiFi',
    price: 9900,
    wilaya: '25 - Constantine',
    address: 'Ziadia, Cité 500',
    status: 'confirmed',
    created_at: new Date(now - 2.5 * DAY).toISOString()
  },
  {
    id: 'ord-2013',
    customer_name: 'Imane Sifi',
    customer_phone: '0541 66 77 88',
    product: 'Baskets Run Air Max',
    price: 13500,
    wilaya: '09 - Blida',
    address: 'Ouled Yaich',
    status: 'confirmed',
    created_at: new Date(now - 2.7 * DAY).toISOString()
  },

  // 3 Days Ago (Day 3)
  {
    id: 'ord-2014',
    customer_name: 'Faris Zerrouki',
    customer_phone: '0553 99 00 11',
    product: 'Robot Cuisinier Multifonction',
    price: 24500,
    wilaya: '16 - Alger',
    address: 'Bab Ezzouar, Cité 8 Mai',
    status: 'confirmed',
    created_at: new Date(now - 3.1 * DAY).toISOString()
  },
  {
    id: 'ord-2015',
    customer_name: 'Chaimaa Mahfouf',
    customer_phone: '0772 11 33 55',
    product: 'Ensemble Sport Femme',
    price: 7800,
    wilaya: '13 - Tlemcen',
    address: 'Mansourah Centre',
    status: 'confirmed',
    created_at: new Date(now - 3.3 * DAY).toISOString()
  },
  {
    id: 'ord-2016',
    customer_name: 'Billel Smati',
    customer_phone: '0663 22 44 66',
    product: 'Support Voiture MagSafe',
    price: 3500,
    wilaya: '31 - Oran',
    address: 'Ain El Turk',
    status: 'confirmed',
    created_at: new Date(now - 3.5 * DAY).toISOString()
  },

  // 4 Days Ago (Day 4)
  {
    id: 'ord-2017',
    customer_name: 'Hassen Cherif',
    customer_phone: '0554 44 66 88',
    product: 'Sac de Voyage Cuir Travel',
    price: 15900,
    wilaya: '16 - Alger',
    address: 'Dely Ibrahim',
    status: 'confirmed',
    created_at: new Date(now - 4.1 * DAY).toISOString()
  },
  {
    id: 'ord-2018',
    customer_name: 'Yousra Haddad',
    customer_phone: '0773 55 77 99',
    product: 'Brosse Soufflante 5-en-1',
    price: 9200,
    wilaya: '19 - Sétif',
    address: 'El Eulma, Rue de France',
    status: 'confirmed',
    created_at: new Date(now - 4.3 * DAY).toISOString()
  },
  {
    id: 'ord-2019',
    customer_name: 'Tarek Meziani',
    customer_phone: '0664 77 99 11',
    product: 'Projecteur Mini LED HD',
    price: 19800,
    wilaya: '25 - Constantine',
    address: 'Nouvelle Ville Ali Mendjeli',
    status: 'rejected',
    created_at: new Date(now - 4.6 * DAY).toISOString()
  },

  // 5 Days Ago (Day 5)
  {
    id: 'ord-2020',
    customer_name: 'Nabil Mansour',
    customer_phone: '0555 77 88 99',
    product: 'Tondeuse Barbe Pro Lithium',
    price: 6800,
    wilaya: '16 - Alger',
    address: 'Hussein Dey, Rue Tripoli',
    status: 'confirmed',
    created_at: new Date(now - 5.1 * DAY).toISOString()
  },
  {
    id: 'ord-2021',
    customer_name: 'Asma Ferhani',
    customer_phone: '0774 22 44 66',
    product: 'Veilleuse Coranique Tactile',
    price: 4500,
    wilaya: '35 - Boumerdès',
    address: 'Figuier Plage',
    status: 'confirmed',
    created_at: new Date(now - 5.3 * DAY).toISOString()
  },
  {
    id: 'ord-2022',
    customer_name: 'Zinedine Zidane',
    customer_phone: '0542 11 33 77',
    product: 'Maillot Retro Vintage Algérie',
    price: 5900,
    wilaya: '31 - Oran',
    address: 'Place d\'Armes',
    status: 'confirmed',
    created_at: new Date(now - 5.5 * DAY).toISOString()
  },

  // 6 Days Ago (Day 6)
  {
    id: 'ord-2023',
    customer_name: 'Mourad Benkhedda',
    customer_phone: '0556 11 22 33',
    product: 'Clavier Mécanique Gamer RGB',
    price: 11500,
    wilaya: '16 - Alger',
    address: 'Saoula Centre',
    status: 'confirmed',
    created_at: new Date(now - 6.1 * DAY).toISOString()
  },
  {
    id: 'ord-2024',
    customer_name: 'Houda Guettaf',
    customer_phone: '0775 88 99 11',
    product: 'Organiseur Maquillage Rotatif',
    price: 3800,
    wilaya: '09 - Blida',
    address: 'Gharbiah',
    status: 'confirmed',
    created_at: new Date(now - 6.4 * DAY).toISOString()
  }
];

// Default mock merchant data for instant browser preview/testing
export const initialMockState = {
  merchant: {
    id: 'demo-merchant-dz-16',
    business_name: 'Boutique El Bahia (Alger)',
    phone: '0550 12 34 56',
    subscription_plan: 'Pro Marchand',
    n8n_webhook_url: 'https://n8n.elbahia-dz.com/webhook/whatsapp-orders',
    whatsapp_status: 'connected'
  },
  orders: generateMockOrders(),
  templates: [
    {
      id: 't-default',
      template_text: 'Bonjour {customer_name} 👋, merci pour votre commande de {product} pour un montant de {price} DA. Veuillez répondre par *1* pour CONFIRMER votre livraison à {wilaya} ({address}) ou *2* pour ANNULER.',
      is_default: true
    },
    {
      id: 't-urgent',
      template_text: 'Rappel Urgent 📦 : Votre commande {product} ({price} DA) attend votre confirmation. Tapez 1 pour valider l’expédition à {wilaya}.',
      is_default: false
    }
  ],
  apiKeys: [
    { id: 'k1', name: 'Boutique Shopify Principal', key_prefix: 'oc_live_8f9a', created_at: '2026-06-01', last_used: 'Il y a 5 min' },
    { id: 'k2', name: 'WooCommerce Magasin Oran', key_prefix: 'oc_live_3e1b', created_at: '2026-06-15', last_used: 'Hier' }
  ],
  subscription: {
    plan_name: 'Pro Marchand',
    orders_limit: 5000,
    orders_used: 1840,
    current_period_end: '2026-08-30'
  }
};
