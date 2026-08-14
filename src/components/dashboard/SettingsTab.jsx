import React, { useState } from 'react';
import { Settings, Check, Save, BellRing, PhoneCall } from 'lucide-react';

export default function SettingsTab({ merchant = {}, onSaveSettings }) {
  const [businessName, setBusinessName] = useState(merchant.business_name || '');
  const [phone, setPhone] = useState(merchant.phone || '');
  const [initialSendDelayMinutes, setInitialSendDelayMinutes] = useState(String(merchant.initial_send_delay_minutes ?? '0'));
  const [remindersEnabled, setRemindersEnabled] = useState(merchant.reminders_enabled !== false);
  const [retryHours, setRetryHours] = useState(String(merchant.reminder_delay_hours ?? '2'));
  const [maxRemindersCount, setMaxRemindersCount] = useState(String(merchant.max_reminders_count ?? '2'));
  const [followUpDelayHours, setFollowUpDelayHours] = useState(String(merchant.follow_up_delay_hours ?? '2'));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings({
        business_name: businessName,
        phone: phone,
        initial_send_delay_minutes: Number(initialSendDelayMinutes),
        reminder_delay_hours: Number(retryHours),
        reminders_enabled: remindersEnabled,
        max_reminders_count: Number(maxRemindersCount),
        follow_up_delay_hours: Number(followUpDelayHours)
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-body">
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground">Paramètres de la Boutique</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gérez les informations de votre boutique, l'activation des relances WhatsApp et le délai de suivi.
        </p>
      </div>

      <div className="max-w-3xl bg-background rounded-3xl p-6 border border-border/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-heading font-extrabold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-accent" /> Configuration Générale
          </h3>
          {saveSuccess && (
            <span className="text-xs font-heading font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-pulse">
              <Check className="h-3.5 w-3.5" /> Modifications enregistrées !
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-foreground mb-1.5">Nom de la boutique</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-foreground mb-1.5">Numéro d'expédition WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring font-mono"
              />
            </div>
          </div>

          {/* Section 2: Initial Send Delay */}
          <div className="pt-4 border-t border-border/60">
            <label className="block text-xs font-heading font-bold text-foreground mb-1.5 flex items-center justify-between">
              <span>Délai avant le 1er message de confirmation</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Premier envoi</span>
            </label>
            <select
              value={initialSendDelayMinutes}
              onChange={(e) => setInitialSendDelayMinutes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:ring-2 focus:ring-ring"
            >
              <option value="0">Immédiat (Dès la réception de la commande)</option>
              <option value="5">5 minutes après la commande</option>
              <option value="15">15 minutes après la commande</option>
              <option value="30">30 minutes après la commande</option>
              <option value="60">1 heure après la commande</option>
              <option value="120">2 heures après la commande</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Délai d'attente avant le déclenchement du premier message WhatsApp de confirmation au client.
            </p>
          </div>

          {/* Section 3: Automated WhatsApp Reminders Config */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-2xl border border-border/70">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold ${remindersEnabled ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-heading font-extrabold text-foreground">Relances Automatiques WhatsApp</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {remindersEnabled 
                      ? 'Les relances seront envoyées automatiquement selon vos règles avant le passage en "À rappeler".'
                      : 'Relances désactivées. La commande passera en "À rappeler" après le délai sans réponse choisi.'}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {/* Custom Rules (Interval & Max Count) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-semibold text-foreground mb-1.5 flex items-center justify-between">
                  <span>Délai d'attente entre relances (heures)</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Intervalle</span>
                </label>
                <select
                  disabled={!remindersEnabled}
                  value={retryHours}
                  onChange={(e) => setRetryHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="1">1 heure sans réponse</option>
                  <option value="2">2 heures sans réponse (Recommandé)</option>
                  <option value="4">4 heures sans réponse</option>
                  <option value="6">6 heures sans réponse</option>
                  <option value="12">12 heures sans réponse</option>
                  <option value="24">24 heures sans réponse</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Temps d'attente sans réponse entre chaque relance automatique.
                </p>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-foreground mb-1.5 flex items-center justify-between">
                  <span>Nombre maximal de relances</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Nombre max</span>
                </label>
                <select
                  disabled={!remindersEnabled}
                  value={maxRemindersCount}
                  onChange={(e) => setMaxRemindersCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="1">1 relance automatique</option>
                  <option value="2">2 relances automatiques (Recommandé)</option>
                  <option value="3">3 relances automatiques</option>
                  <option value="4">4 relances automatiques</option>
                  <option value="5">5 relances automatiques</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Nombre de relances avant de transmettre au marchand.
                </p>
              </div>
            </div>

            {/* Section 4: Follow-up Status Transition Delay */}
            <div className="pt-3">
              <label className="block text-xs font-heading font-semibold text-foreground mb-1.5 flex items-center justify-between">
                <span>Délai d'attente avant passage en "📞 À rappeler" (heures)</span>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Passage en À rappeler</span>
              </label>
              <select
                value={followUpDelayHours}
                onChange={(e) => setFollowUpDelayHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs font-heading font-semibold text-foreground focus:ring-2 focus:ring-ring"
              >
                <option value="1">1 heure sans réponse</option>
                <option value="2">2 heures sans réponse (Recommandé)</option>
                <option value="4">4 heures sans réponse</option>
                <option value="6">6 heures sans réponse</option>
                <option value="12">12 heures sans réponse</option>
                <option value="24">24 heures sans réponse</option>
              </select>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <PhoneCall className="h-3 w-3 text-orange-600 shrink-0" />
                <span>
                  {remindersEnabled
                    ? 'Temps à attendre APPRÈS la dernière relance sans réponse pour faire passer la commande en "📞 À rappeler".'
                    : 'Temps à attendre APPRÈS le 1er message sans réponse pour faire passer la commande en "📞 À rappeler".'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all shadow-xs flex items-center justify-center gap-2 mt-4"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer la configuration</span>
          </button>
        </form>
      </div>
    </div>
  );
}
