import React, { useState, useEffect } from 'react';
import { BellRing, Check, X, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const VAPID_PUBLIC_KEY = 'BD6TK3sWhcfkHvDAfc5dio2LW4FjUcJqG8z5YImM-SL9w00NSRNJ5PKYvMJIAfHfbUmjSHcZz-s-N3U15DmySF4';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
        try {
          const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          });
        } catch (subErr) {
          console.warn('Real pushManager subscribe fallback notice:', subErr);
        }
      }

      if (subscription) {
        const subJson = subscription.toJSON();
        const p256dh = subJson.keys?.p256dh || '';
        const auth = subJson.keys?.auth || '';

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
        setTimeout(() => setSubscribedSuccess(false), 3500);
      }
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
          <span>Notifications Push VAPID activées (Appareil relié) !</span>
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
          <p className="text-[11px] text-muted-foreground leading-snug">
            Recevez un son et un إشعار instantané lors de chaque confirmation de commande, même si l'application est fermée.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleRequestPermission}
          disabled={loading}
          className="flex-1 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-heading font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Activation...</span>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Activer les notifications</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
