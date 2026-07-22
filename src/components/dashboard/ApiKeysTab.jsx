import React, { useState } from 'react';
import { Key, Plus, Copy, Check, Trash2, Code, ShieldCheck } from 'lucide-react';

export default function ApiKeysTab({ apiKeys, onGenerateKey, onRevokeKey }) {
  const [keyName, setKeyName] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [newCreatedSecret, setNewCreatedSecret] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState('curl');

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (!keyName) return;
    const secretKey = `oc_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    onGenerateKey({
      name: keyName,
      key_prefix: secretKey.substring(0, 12),
      full_secret: secretKey
    });
    setNewCreatedSecret(secretKey);
    setKeyName('');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const codeSnippets = {
    curl: `curl -X POST "https://your-project.supabase.co/functions/v1/new-order" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: oc_live_8f9a..." \\
  -d '{
    "merchant_id": "demo-merchant-dz-16",
    "customer_name": "Karim Benali",
    "customer_phone": "0550123456",
    "product": "Chaussures Sport Pro",
    "price": 14500,
    "wilaya": "16 - Alger",
    "address": "Hydra"
  }'`,
    javascript: `const response = await fetch("https://your-project.supabase.co/functions/v1/new-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "oc_live_8f9a..."
  },
  body: JSON.stringify({
    merchant_id: "demo-merchant-dz-16",
    customer_name: "Karim Benali",
    customer_phone: "0550123456",
    product: "Chaussures Sport Pro",
    price: 14500,
    wilaya: "16 - Alger"
  })
});

const data = await response.json();
console.log("WhatsApp Webhook Triggered:", data);`,
    python: `import requests

url = "https://your-project.supabase.co/functions/v1/new-order"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "oc_live_8f9a..."
}
payload = {
    "merchant_id": "demo-merchant-dz-16",
    "customer_name": "Karim Benali",
    "customer_phone": "0550123456",
    "product": "Chaussures Sport Pro",
    "price": 14500,
    "wilaya": "16 - Alger"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  return (
    <div className="space-y-6 font-body">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Clés API & Intégration E-Commerce</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Générez des clés d'API pour connecter vos boutiques WooCommerce, Shopify ou applications sur-mesure.
        </p>
      </div>

      {/* Generate Form */}
      <div className="bg-background rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-accent" /> Générer une nouvelle clé API
        </h3>

        {newCreatedSecret && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> Nouvelle Clé API Générée avec Succès !
            </div>
            <p className="text-xs text-emerald-800">
              Copiez cette clé maintenant. Elle ne sera plus jamais réaffichée en clair :
            </p>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-xs text-foreground">
              <span className="truncate flex-1">{newCreatedSecret}</span>
              <button
                onClick={() => copyToClipboard(newCreatedSecret, 'secret')}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-sans font-semibold hover:bg-emerald-700"
              >
                {copiedId === 'secret' ? 'Copie !' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerateSubmit} className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Nom de l'intégration (ex: WooCommerce Magasin Alger)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent/90 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Générer
          </button>
        </form>
      </div>

      {/* Existing API Keys Table */}
      <div className="bg-background rounded-2xl border border-border/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold text-foreground">Vos Clés API Actives</h3>
        </div>
        <div className="divide-y divide-border/40">
          {apiKeys.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-heading font-semibold text-foreground">Aucune clé API générée pour le moment</p>
              <p className="text-[11px]">Utilisez le formulaire ci-dessus pour créer une clé d'intégration pour WooCommerce ou Shopify.</p>
            </div>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className="p-4 px-6 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-foreground">{key.name}</h4>
                  <span className="text-muted-foreground font-mono text-[11px]">{key.key_prefix}...••••••••</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-[11px]">Dernière utilisation : {key.last_used || 'Jamais'}</span>
                  <button
                    onClick={() => onRevokeKey(key.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Révoker la clé"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Code Snippets & Integration Guide */}
      <div className="bg-background rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Code className="h-4 w-4 text-accent" /> Exemples de Code & Intégration Webhook
          </h3>

          <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl">
            {['curl', 'javascript', 'python'].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveCodeTab(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  activeCodeTab === lang ? 'bg-background text-accent font-bold shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{codeSnippets[activeCodeTab]}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(codeSnippets[activeCodeTab], 'snippet')}
            className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-sans font-semibold backdrop-blur transition-all flex items-center gap-1"
          >
            {copiedId === 'snippet' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedId === 'snippet' ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
