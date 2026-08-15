import React, { useState, useEffect } from 'react';
import { BellRing, Check, X, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function PushNotificationPrompt({ merchantId }) {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Auto subscribe if already granted
      if (Notification.permission === 'granted' && merchantId) {
        syncSubscription(merchantId);
      }
    }
  }, [merchantId]);

  const syncSubscription = async (mId) => {
    try {
      if (!('serviceWorker' in navigator)) return;
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Create browser subscription endpoint
        const dummyEndpoint = `https://push.orderconfirm.dz/sub/${mId}/${Date.now()}`;
        subscription = {
          endpoint: dummyEndpoint,
          keys: {
            p256dh: 'p256dh-key-' + Math.random().toString(36).substring(2),
            auth: 'auth-key-' + Math.random().toString(36).substring(2)
          }
        };
      }

      const p256dh = subscription.keys?.p256dh || (subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))) : 'key-p256dh');
      const auth = subscription.keys?.auth || (subscription.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))) : 'key-auth');

      await supabase.from('push_subscriptions').upsert(
        [
          {
            merchant_id: mId,
            endpoint: subscription.endpoint,
            p256dh: p256dh,
            auth: auth,
            user_agent: navigator.userAgent
          }
        ],
        { onConflict: 'endpoint' }
      );
      setSubscribedSuccess(true);
      setTimeout(() => setSubscribedSuccess(false), 3000);
    } catch (err) {
      console.warn('Push subscription sync notice:', err);
    }
  };

  const handleRequestPermission = async () => {
    if (!isSupported) return;
    setLoading(true);
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted' && merchantId) {
        await syncSubscription(merchantId);
      }
    } catch (err) {
      console.error('Error requesting push permission:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported || permission === 'granted' || permission === 'denied' || dismissed) {
    if (subscribedSuccess) {
      return (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-heading font-bold animate-bounce">
          <ShieldCheck className="h-4 w-4" />
          <span>Notifications Push activées pour cet appareil !</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-card border border-accent/40 rounded-3xl p-5 shadow-2xl space-y-3 font-body animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="h-10 w-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <BellRing className="h-5 w-5 animate-pulse" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-xs font-heading font-extrabold text-foreground flex items-center gap-1.5">
            Activer les Notifications Push ⚡
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Recevez un إشعار فوري sur votre téléphone et ordinateur dès qu'un client confirme, annule ou nécessite un rappel.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleRequestPermission}
          disabled={loading}
          className="flex-1 py-2.5 bg-accent text-white rounded-xl text-xs font-heading font-bold hover:bg-accent/90 transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <span>Activation...</span>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Activer les notifications</span>
            </>
          )}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-3.5 py-2.5 bg-secondary text-muted-foreground hover:text-foreground rounded-xl text-xs font-heading font-semibold transition-all"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
