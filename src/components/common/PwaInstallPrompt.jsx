import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if app is already running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      setShowPrompt(false);
      return;
    }

    // Check global early prompt
    if (window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    // Capture Android/Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPwaPrompt = e;
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      window.deferredPwaPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const activePrompt = window.deferredPwaPrompt || deferredPrompt;
    if (activePrompt) {
      try {
        activePrompt.prompt();
        const { outcome } = await activePrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setShowPrompt(false);
        }
        window.deferredPwaPrompt = null;
        setDeferredPrompt(null);
      } catch (err) {
        if (isIos) setShowInstallGuide(true);
      }
    } else if (isIos) {
      setShowInstallGuide(true);
    } else {
      setShowInstallGuide(true);
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Mobile ONLY (< 768px - Hidden on PC/Desktop md:hidden) Clean Pure White Floating Button */}
      <div className="md:hidden fixed top-3 left-3 right-3 z-50 flex items-center justify-between gap-2 font-body animate-in slide-in-from-top-5 duration-300">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-3 px-4 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-heading font-extrabold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Download className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
          <span>تثبيت التطبيق الآن ⚡ (Install App)</span>
        </button>

        <button
          onClick={() => setShowPrompt(false)}
          className="h-10 w-10 bg-white text-slate-500 hover:text-slate-900 border border-slate-200/90 rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-all active:scale-95"
          title="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Step-by-step Installation Guide Modal (Only if browser blocks automatic prompt) */}
      {showInstallGuide && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-4 font-body animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-extrabold text-foreground flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-accent" /> تثبيت تطبيق OrderConfirm على الهاتف
              </h3>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {isIos ? (
                <>
                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-2xl border border-border/60">
                    <div className="h-7 w-7 rounded-xl bg-accent/15 text-accent font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">
                      اضغط على زر <strong className="text-accent font-bold">مشاركة (Share <Share className="inline h-3.5 w-3.5" />)</strong> في أسفل متصفح Safari.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-2xl border border-border/60">
                    <div className="h-7 w-7 rounded-xl bg-accent/15 text-accent font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">
                      اختر <strong className="text-accent font-bold">إضافة إلى الشاشة الرئيسية (Sur l'écran d'accueil <PlusSquare className="inline h-3.5 w-3.5" />)</strong>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-2xl border border-border/60">
                    <div className="h-7 w-7 rounded-xl bg-accent/15 text-accent font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">
                      اضغط على <strong className="text-accent font-bold">خيارات المتصفح (⋮ القائمة في أعلى اليسار/اليمين)</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-2xl border border-border/60">
                    <div className="h-7 w-7 rounded-xl bg-accent/15 text-accent font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">
                      اختر <strong className="text-accent font-bold">تثبيت التطبيق (Installer l'application)</strong> أو <strong className="text-accent font-bold">إضافة إلى الشاشة الرئيسية</strong>.
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-start gap-3 p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  سيظهر تطبيق OrderConfirm على شاشتك الرئيسية كأي تطبيق عادي ومستقل!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-3 bg-accent text-white rounded-2xl text-xs font-heading font-bold hover:bg-accent/90 transition-all"
            >
              حسناً، فهمت !
            </button>
          </div>
        </div>
      )}
    </>
  );
}
