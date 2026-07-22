import React, { useState } from 'react';
import { Settings, Check, Save } from 'lucide-react';

export default function SettingsTab({ merchant, onSaveSettings }) {
  const [businessName, setBusinessName] = useState(merchant.business_name || '');
  const [phone, setPhone] = useState(merchant.phone || '');
  const [retryHours, setRetryHours] = useState('2');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      business_name: businessName,
      phone: phone,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 font-body">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Paramètres</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gérez les informations de votre boutique et les délais de relance automatique.
        </p>
      </div>

      <div className="max-w-3xl bg-background rounded-2xl p-6 border border-border/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-accent" /> Informations de la Boutique
          </h3>
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" /> Modifications enregistrées !
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Nom de la boutique</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/40 border border-border/80 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Numéro d'expédition</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/40 border border-border/80 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Délai de relance automatique si sans réponse
            </label>
            <select
              value={retryHours}
              onChange={(e) => setRetryHours(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/40 border border-border/80 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring"
            >
              <option value="1">1 heure après la commande</option>
              <option value="2">2 heures après la commande (Recommandé)</option>
              <option value="6">6 heures après la commande</option>
              <option value="24">24 heures après la commande</option>
              <option value="0">Pas de relance automatique</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent/90 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer les paramètres</span>
          </button>
        </form>
      </div>
    </div>
  );
}
