import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function AdminDeleteMerchantModal({ merchant, onClose, onConfirmDelete }) {
  const [typedName, setTypedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!merchant) return null;

  const targetName = merchant.business_name || merchant.store_name || 'Boutique Marchande';
  const targetEmail = merchant.email || 'Non renseigné';
  const isMatch = typedName.trim() === targetName.trim();

  const handleConfirm = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    setErrorMsg('');

    try {
      await onConfirmDelete(merchant);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la suppression du compte marchand :", err);
      setErrorMsg(err.message || "Erreur lors de la suppression. Veuillez réessayer.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-body">
      <div className="bg-background w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between bg-rose-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-foreground tracking-tight">
                حذف حساب التاجر نهائياً
              </h2>
              <p className="text-xs text-muted-foreground">
                Suppression définitive du compte marchand
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-right" dir="rtl">
          
          {/* Target Account Summary */}
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>اسم المتجر:</span>
              <strong className="text-foreground font-heading font-bold">{targetName}</strong>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>البريد الإلكتروني:</span>
              <strong className="text-foreground font-mono">{targetEmail}</strong>
            </div>
          </div>

          {/* Warning Card */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-700 text-xs">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-heading font-bold block">تحذير هـام:</strong>
              <p className="leading-relaxed">
                هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع الطلبيات والرسائل والقوالب المرتبطة بهذا الحساب.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Instruction & Confirmation Input */}
          <div className="space-y-2">
            <label className="block text-xs font-heading font-bold text-foreground">
              لتأكيد الحذف، يرجى كتابة اسم المتجر <span className="text-rose-600">"{targetName}"</span> أدناه:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={`أكتب "${targetName}" للتأكيد...`}
              disabled={isDeleting}
              dir="ltr"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-rose-500 text-foreground text-left placeholder:text-muted-foreground/60"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-secondary/20 flex items-center justify-end gap-3" dir="rtl">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-secondary text-foreground text-xs font-heading font-bold transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isMatch || isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-heading font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الحذف...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>حذف نهائياً</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
