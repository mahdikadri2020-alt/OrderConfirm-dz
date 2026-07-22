import React, { useState } from 'react';
import { Building, Mail, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { LogoIcon } from '../common/Logo';

export default function SignUpPage({ onGoToLogin, onAuthSuccess, onGoHome }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  const translateError = (err) => {
    const message = err?.message || String(err);
    if (message.includes('User already registered') || message.includes('user_already_exists') || message.includes('already registered')) {
      return 'Cette adresse e-mail est déjà associée à un compte. Veuillez vous connecter.';
    }
    if (message.includes('Password should be at least')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (message.includes('invalid email') || message.includes('Unable to validate email address')) {
      return 'Veuillez saisir une adresse e-mail valide.';
    }
    return message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!businessName.trim()) {
      setErrorMsg('Veuillez saisir le nom de votre boutique.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Veuillez saisir votre adresse e-mail.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Veuillez saisir votre numéro de téléphone.');
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

    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        // 1. Create Supabase Auth user
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

        const newUser = data?.user;

        if (newUser) {
          // Merchant row, default template & subscription are created automatically by DB trigger
          if (data?.session) {
            setSuccessMsg('Compte créé avec succès ! Redirection vers votre tableau de bord...');
            setTimeout(() => {
              onAuthSuccess({
                id: newUser.id,
                email: newUser.email,
                business_name: businessName.trim()
              });
            }, 1200);
          } else {
            setNeedsEmailConfirm(true);
            setSuccessMsg('Compte créé ! Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
          }
        }
      } catch (err) {
        setErrorMsg(translateError(err));
      } finally {
        setLoading(false);
      }
    } else {
      // Offline Demo Auth Fallback
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Compte démo créé avec succès ! Redirection vers le tableau de bord...');
        setTimeout(() => {
          onAuthSuccess({
            id: 'demo-merchant-new',
            email: email,
            business_name: businessName
          });
        }, 800);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 font-body text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background pointer-events-none" />

      {/* Top logo & back button */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGoHome}>
          <LogoIcon size={42} className="h-10 w-auto" />
          <span className="text-xl font-heading font-black tracking-tight text-foreground">OrderConfirm</span>
        </div>
      </div>

      {/* Signup Form Card */}
      <div className="relative w-full max-w-md bg-background rounded-3xl p-8 border border-border shadow-2xl z-10">
        <div className="mb-6 text-center">
          <span className="text-xs font-heading font-bold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full">
            Inscription Gratuite
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground mt-3 tracking-tight">
            Créer votre compte
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Automatisez la confirmation de vos commandes WhatsApp en Algérie.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {!needsEmailConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Nom de la boutique <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Boutique El Bahia"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Adresse E-mail <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="marchand@exemple.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Numéro de téléphone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  placeholder="0550 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Confirmer le mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white rounded-full text-xs font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Création du compte...</span>
              ) : (
                <>
                  <span>S'inscrire gratuitement</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-all"
            >
              Se connecter maintenant
            </button>
          </div>
        )}

        {/* Link to login */}
        <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
          <p>
            Vous avez déjà un compte ?{' '}
            <button onClick={onGoToLogin} className="text-accent font-semibold hover:underline">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
