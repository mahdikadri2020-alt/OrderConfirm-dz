import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    // Capture Android/Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt for iOS if not installed
    if (isIosDevice && !isStandalone) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Floating Eye-Catching Mobile Install Bar */}
      <div className="fixed top-3 left-3 right-3 z-50 md:top-4 md:right-4 md:left-auto md:max-w-md bg-gradient-to-r from-accent to-emerald-600 text-white rounded-3xl p-4 shadow-2xl border border-white/20 font-body animate-in slide-in-from-top-5 duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Smartphone className="h-6 w-6 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-heading font-extrabold text-white flex items-center gap-1">
                تثبيت تطبيق OrderConfirm 📱
              </h4>
              <p className="text-[11px] text-white/90 font-medium">
                قم بتثبيت التطبيق على هاتفك للوصول السريع والإشعارات.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPrompt(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="w-full py-3 bg-white text-accent hover:bg-emerald-50 rounded-2xl text-xs font-heading font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>تثبيت التطبيق الآن ⚡ (Install App)</span>
          </button>
        </div>
      </div>

      {/* iOS Step-by-step Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-4 font-body animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-extrabold text-foreground flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-accent" /> تثبيت التطبيق على iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
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

              <div className="flex items-start gap-3 p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  سيظهر تطبيق OrderConfirm على شاشتك الرئيسية ويعمل تماماً مثل التطبيقات العادية بدون شريط متصفح!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 bg-accent text-white rounded-2xl text-xs font-heading font-bold hover:bg-accent/90 transition-all"
            >
              فهمت، شكراً !
            </button>
          </div>
        </div>
      )}
    </>
  );
}
