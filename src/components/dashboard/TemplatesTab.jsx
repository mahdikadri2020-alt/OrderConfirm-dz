import React, { useState } from 'react';
import { MessageSquare, Sparkles, Check, Phone, Send, Info } from 'lucide-react';

export default function TemplatesTab({ templates, onSaveTemplate }) {
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0]?.id || 't-default');
  const [templateText, setTemplateText] = useState(templates[0]?.template_text || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const variables = [
    { tag: '{customer_name}', label: 'Nom du client', sample: 'Karim Benali' },
    { tag: '{product}', label: 'Nom du produit', sample: 'Chaussures Sport Pro' },
    { tag: '{price}', label: 'Prix en DA', sample: '14500' },
    { tag: '{wilaya}', label: 'Wilaya', sample: '16 - Alger' },
    { tag: '{address}', label: 'Adresse', sample: 'Hydra, Rue Ahmed' },
  ];

  const insertVariable = (tag) => {
    setTemplateText((prev) => prev + ' ' + tag);
  };

  const handleSave = () => {
    onSaveTemplate(activeTemplateId, templateText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Render sample text for the live phone preview
  let previewFormatted = templateText;
  variables.forEach((v) => {
    previewFormatted = previewFormatted.replace(new RegExp(v.tag, 'g'), v.sample);
  });

  return (
    <div className="space-y-6 font-body">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Modèles de Messages WhatsApp</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Personnalisez le message de confirmation automatique envoyé à vos clients e-commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor (7 cols) */}
        <div className="lg:col-span-7 bg-background rounded-2xl p-6 border border-border/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" /> Éditeur de Modèle
            </h3>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="h-3 w-3" /> Modèle enregistré !
              </span>
            )}
          </div>

          {/* Clickable Variable Tags */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Insérer des variables dynamiques (Cliquez pour ajouter) :
            </label>
            <div className="flex flex-wrap gap-2">
              {variables.map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => insertVariable(v.tag)}
                  className="px-2.5 py-1 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg text-xs font-mono font-semibold transition-all border border-accent/20"
                >
                  + {v.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Texte du Message WhatsApp</label>
            <textarea
              rows={6}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-4 bg-secondary/40 border border-border/80 rounded-2xl text-xs text-foreground font-body leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="bg-secondary/50 p-3.5 rounded-xl text-xs text-muted-foreground flex items-start gap-2 border border-border/60">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p>
              <strong>Astuce WhatsApp :</strong> Utilisez `*texte*` pour mettre en gras et `_texte_` pour l'italique. Le client répond <strong>1</strong> pour valider et <strong>2</strong> pour annuler.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent/90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Enregistrer le Modèle WhatsApp</span>
          </button>
        </div>

        {/* Smartphone Live Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 relative">
            {/* Camera Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3" />

            {/* WhatsApp App Screen Header */}
            <div className="bg-[#075e54] text-white p-3 rounded-t-2xl flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                ✦
              </div>
              <div>
                <h4 className="text-xs font-semibold">OrderConfirm DZ</h4>
                <span className="text-[9px] opacity-80 block">Boutique El Bahia</span>
              </div>
            </div>

            {/* WhatsApp Chat Area */}
            <div className="bg-[#efeae2] p-3 rounded-b-2xl h-[340px] overflow-y-auto space-y-3 font-sans">
              <div className="bg-white/80 p-2 text-[10px] text-center text-slate-600 rounded-lg shadow-sm">
                🔒 Les messages sont chiffrés de bout en bout.
              </div>

              {/* Message Bubble */}
              <div className="bg-[#dcf8c6] text-slate-900 p-3 rounded-2xl rounded-tr-none text-[11px] leading-relaxed shadow-sm font-sans">
                <p className="whitespace-pre-wrap">{previewFormatted || 'Aperçu du message...'}</p>
                <span className="text-[9px] text-slate-500 block text-right mt-1">19:30 ✓✓</span>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
          </div>

          <span className="text-xs text-muted-foreground mt-3 font-medium">Aperçu en direct sur le smartphone du client</span>
        </div>
      </div>
    </div>
  );
}
