import React, { useState } from 'react';
import { X, Lock, Mail, Building, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { LogoIcon } from '../common/Logo';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const translateError = (err) => {
    const message = err?.message || String(err);
    if (message.includes('User already registered') || message.includes('user_already_exists') || message.includes('already registered')) {
      return 'Cette adresse e-mail est déjà associée à un compte.';
    }
    if (message.includes('Password should be at least')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Adresse e-mail ou mot de passe incorrect.';
    }
    return message || 'Une erreur est survenue.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!businessName.trim() || !phone.trim()) {
        setErrorMsg('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              business_name: businessName.trim(),
              phone: phone.trim()
            }
          }
        });
        if (error) throw error;

        setSuccessMsg('Compte créé avec succès ! Redirection vers le tableau de bord...');
        setTimeout(() => {
          onAuthSuccess(data?.user || { email: email.trim(), business_name: businessName.trim() });
          onClose();
        }, 1200);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;
        if (!data?.user) {
          throw new Error('Adresse e-mail ou mot de passe incorrect.');
        }

        setSuccessMsg('Connexion réussie ! Redirection...');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch (err) {
      setErrorMsg(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-[94vw] max-w-md bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border shadow-2xl font-body max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <LogoIcon size={38} className="h-9 w-auto" />
            <span className="font-heading font-black text-foreground text-xl tracking-tight">OrderConfirm</span>
          </div>
          <h3 className="font-heading font-bold text-2xl text-foreground tracking-tight">
            {mode === 'signup' ? 'Créer votre compte' : 'Accédez à votre espace'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === 'signup'
              ? 'Rejoignez les marchands e-commerce qui automatisent leurs confirmations COD.'
              : 'Gérez vos commandes, relances WhatsApp et statistiques.'}
          </p>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Nom de votre boutique</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Boutique El Bahia"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    placeholder="0550 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Adresse E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="marchand@exemple.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Chargement...</span>
            ) : (
              <>
                <span>{mode === 'signup' ? "S'inscrire gratuitement" : 'Se connecter'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
          {mode === 'signup' ? (
            <p>
              Vous avez déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="text-accent font-semibold hover:underline">
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{' '}
              <button onClick={() => setMode('signup')} className="text-accent font-semibold hover:underline">
                Créer un compte
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
