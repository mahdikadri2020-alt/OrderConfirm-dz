import React, { useState } from 'react';
import { MessageSquare, Info, Lock, ShieldCheck } from 'lucide-react';

export default function TemplatesTab({ templates, onSaveTemplate }) {
  const [showInfoToast, setShowInfoToast] = useState(false);

  // Meta Approved Template: order_confirm
  const approvedTemplateText = 'مرحباً {{1}}، تم تسجيل طلبك "{{2}}" بقيمة {{3}} دينار جزائري. يرجى الرد بـ "نعم" للتأكيد أو "لا" للإلغاء.';

  const variables = [
    { tag: '{{1}}', label: 'اسم العميل (Nom client)', sample: 'كريم بن علي' },
    { tag: '{{2}}', label: 'اسم المنتج (Produit)', sample: 'حذاء رياضي برو' },
    { tag: '{{3}}', label: 'السعر الإجمالي (Prix DA)', sample: '14 500' },
  ];

  // Render sample text for the live phone preview
  let previewFormatted = approvedTemplateText;
  variables.forEach((v) => {
    previewFormatted = previewFormatted.replace(v.tag, v.sample);
  });

  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowInfoToast(true);
    setTimeout(() => setShowInfoToast(false), 4000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner & Status Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-heading font-bold mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>🟢 القالب الحالي: order_confirm - معتمد ونشط</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Modèles de Messages WhatsApp</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aperçu du modèle officiel WhatsApp (Meta) utilisé pour les confirmations automatiques.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2.5 rounded-2xl shrink-0">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-200">Statut WhatsApp (Meta)</span>
            <span className="block text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">🟢 Approuvé & Actif (order_confirm)</span>
          </div>
        </div>
      </div>

      {/* Main Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-3.5 text-amber-900 dark:text-amber-200 shadow-sm">
        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs md:text-sm leading-relaxed" dir="rtl">
          <p className="font-bold text-amber-950 dark:text-amber-100">
            تنبيه هام حول تخصيص الرسائل:
          </p>
          <p className="text-amber-900/90 dark:text-amber-200/90">
            الرسائل تُرسل حالياً عبر قالب معتمد رسمياً من واتساب (Meta) لضمان التسليم. لا يمكن تخصيص النص حالياً - المتغيرات (اسم العميل، المنتج، السعر) تُملأ تلقائياً لكل طلبية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Read-Only Editor (7 cols) */}
        <div className="lg:col-span-7 bg-background rounded-2xl p-6 border border-border/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" /> القالب المعتمد (Lecture Seule)
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground text-[11px] font-medium border border-border">
              <Lock className="h-3 w-3 text-muted-foreground" /> Verrouillé par Meta
            </span>
          </div>

          {/* Dynamic Variables Breakdown */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              المتغيرات الديناميكية المستعملة تلقائياً (Variables Meta) :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {variables.map((v) => (
                <div
                  key={v.tag}
                  className="p-2.5 bg-secondary/50 rounded-xl border border-border/70 text-xs flex flex-col gap-0.5"
                >
                  <span className="font-mono font-bold text-accent">{v.tag}</span>
                  <span className="text-[11px] text-foreground font-medium">{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Read-Only Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-foreground">نص الرسالة المعتمد (WhatsApp Approved Text)</label>
              <span className="text-[10px] text-muted-foreground font-mono">Code: order_confirm</span>
            </div>
            <div className="relative">
              <textarea
                rows={4}
                readOnly
                value={approvedTemplateText}
                dir="rtl"
                className="w-full p-4 bg-secondary/60 border border-border rounded-2xl text-xs md:text-sm text-foreground font-body leading-relaxed focus:outline-none cursor-not-allowed select-text resize-none"
              />
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border px-2 py-1 rounded-md text-[10px] text-muted-foreground flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" /> قراءة فقط
              </div>
            </div>
          </div>

          {/* Tip / Note */}
          <div className="bg-secondary/40 p-3.5 rounded-xl text-xs text-muted-foreground flex items-start gap-2.5 border border-border/60">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>آلية التأكيد:</strong> يتلقى الزبون الرسالة ويجيب بـ <strong>"نعم"</strong> لتأكيد الطلب أو <strong>"لا"</strong> لإلغائه. يقوم n8n بتحديث حالة الطلبية في Dashboard مباشرة.
            </p>
          </div>

          {/* Toast / Alert Message for Disabled Save */}
          {showInfoToast && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>لا يمكن تعديل النص حالياً. الرسائل تُرسل عبر قالب Meta المعتمد "order_confirm".</span>
            </div>
          )}

          {/* Disabled Save Button with Info Notice */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="w-full py-3 bg-muted text-muted-foreground rounded-full text-xs font-semibold hover:bg-muted/80 transition-all flex items-center justify-center gap-2 border border-border cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Enregistrer le Modèle WhatsApp (التعديل معطّل)</span>
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
              <div className="bg-white/80 p-2 text-[10px] text-center text-slate-600 rounded-lg shadow-sm font-sans" dir="ltr">
                🔒 Les messages sont chiffrés de bout en bout.
              </div>

              {/* Message Bubble */}
              <div className="bg-[#dcf8c6] text-slate-900 p-3 rounded-2xl rounded-tr-none text-[11px] leading-relaxed shadow-sm font-sans" dir="rtl">
                <p className="whitespace-pre-wrap font-sans">{previewFormatted}</p>
                <span className="text-[9px] text-slate-500 block text-left mt-1 font-mono" dir="ltr">19:30 ✓✓</span>
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

