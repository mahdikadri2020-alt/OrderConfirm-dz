import React, { useState } from 'react';
import { X, Lock, Mail, Building, Phone, ArrowRight, CheckCircle2, AlertCircle, Clock, User, MapPin, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { LogoIcon } from '../common/Logo';

const ALGERIAN_WILAYAS = [
  '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna', '06 - Béjaïa',
  '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira', '11 - Tamanrasset', '12 - Tébessa',
  '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou', '16 - Alger', '17 - Djelfa', '18 - Jijel',
  '19 - Sétif', '20 - Saïda', '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma',
  '25 - Constantine', '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
  '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arreridj', '35 - Boumerdès', '36 - El Tarf',
  '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela', '41 - Souk Ahras', '42 - Tipaza',
  '43 - Mila', '44 - Aïn Defla', '45 - Naâma', '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane'
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [monthlyOrders, setMonthlyOrders] = useState('1-50');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

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

    if (mode === 'signup') {
      if (!fullName.trim() || !businessName.trim() || !phone.trim()) {
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
              full_name: fullName.trim(),
              business_name: businessName.trim(),
              phone: phone.trim(),
              wilaya: wilaya,
              monthly_orders: monthlyOrders
            }
          }
        });
        if (error) throw error;

        await supabase
          .from('account_requests')
          .insert([{
            full_name: fullName.trim(),
            email: email.trim(),
            whatsapp: phone.trim(),
            store_name: businessName.trim(),
            wilaya: wilaya,
            monthly_orders: monthlyOrders,
            status: 'pending',
            created_at: new Date().toISOString()
          }]);

        setIsSubmittedSuccess(true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;
        if (!data?.user) {
          throw new Error('Adresse e-mail ou mot de passe incorrect.');
        }

        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-body">
      <div className="relative w-[94vw] max-w-lg bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubmittedSuccess ? (
          <div className="text-center py-4 space-y-4" dir="rtl">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-2xl text-foreground">
                تم إرسال طلبك بنجاح !
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                سنتصل بك قريباً لإكمال عملية الدفع وتفعيل حسابك.
              </p>
            </div>

            <button
              onClick={() => {
                setMode('login');
                setIsSubmittedSuccess(false);
              }}
              className="w-full py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all shadow-md mt-2"
            >
              تسجيل الدخول إلى حسابك
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2.5 mb-2">
                <LogoIcon size={36} className="h-8 w-auto" />
                <span className="font-heading font-black text-foreground text-xl tracking-tight">OrderConfirm</span>
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                {mode === 'signup' ? 'Créer votre compte marchand' : 'Accédez à votre espace'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === 'signup'
                  ? 'Rejoignez les marchands e-commerce qui automatisent leurs confirmations COD.'
                  : 'Gérez vos commandes, relances WhatsApp et statistiques.'}
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="Nom & Prénom"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Nom de votre boutique</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Téléphone / WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="tel"
                          required
                          placeholder="0550 12 34 56"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Wilaya</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <select
                          value={wilaya}
                          onChange={(e) => setWilaya(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {ALGERIAN_WILAYAS.map((w) => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Adresse E-mail</label>
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
                <label className="block text-xs font-medium text-foreground mb-1">Mot de passe</label>
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
                  <label className="block text-xs font-medium text-foreground mb-1">Confirmer le mot de passe</label>
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
                className="w-full py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Chargement...</span>
                ) : (
                  <>
                    <span>{mode === 'signup' ? "Envoyer la demande d'inscription" : 'Se connecter'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle link */}
            <div className="mt-5 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
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
          </>
        )}
      </div>
    </div>
  );
}
