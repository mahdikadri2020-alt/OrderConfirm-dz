import React, { useState } from 'react';
import { Building, Mail, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, User, MapPin, BarChart2, Clock } from 'lucide-react';
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

export default function SignUpPage({ onGoToLogin, onAuthSuccess, onGoHome }) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [monthlyOrders, setMonthlyOrders] = useState('1-50');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

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

    if (!fullName.trim()) {
      setErrorMsg('Veuillez saisir votre nom complet.');
      return;
    }
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

    try {
      // 1. Create Supabase Auth user
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

      // 2. Insert single record into account_requests (status = 'pending')
      const { error: reqError } = await supabase
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

      if (reqError) {
        console.warn("Account request insert warning:", reqError);
      }

      setIsSubmittedSuccess(true);
    } catch (err) {
      setErrorMsg(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-3 sm:p-6 font-body text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background pointer-events-none" />

      {/* Top logo & back button */}
      <div className="w-full max-w-lg flex items-center justify-between mb-4 sm:mb-6 z-10">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span>Accueil</span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
          <LogoIcon size={32} className="h-8 sm:h-10 w-auto" />
          <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-foreground">OrderConfirm</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-lg bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border shadow-2xl z-10">
        
        {isSubmittedSuccess ? (
          /* Clear Success Screen Requirement #1 */
          <div className="text-center py-6 space-y-6 animate-fadeIn" dir="rtl">
            <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Clock className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-heading font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <span>طلب قيد المراجعة</span>
              </span>
              
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
                تم إرسال طلبك بنجاح !
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                سنتصل بك قريباً لإكمال عملية الدفع وتفعيل حسابك.
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                Nous vous contacterons sous peu pour procéder au paiement et activer votre compte.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-right space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>اسم المتجر:</span>
                <strong className="text-foreground font-heading font-bold">{businessName}</strong>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>رقم الهاتف:</span>
                <strong className="text-foreground font-mono">{phone}</strong>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>البريد الإلكتروني:</span>
                <strong className="text-foreground font-mono">{email}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onGoToLogin}
                className="flex-1 py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all shadow-md"
              >
                تسجيل الدخول إلى حسابك
              </button>
              <button
                onClick={onGoHome}
                className="py-3 px-6 bg-secondary text-foreground rounded-full text-xs font-heading font-bold hover:bg-secondary/80 transition-all border border-border"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        ) : (
          /* Signup Form */
          <>
            <div className="mb-5 sm:mb-6 text-center">
              <span className="text-[10px] sm:text-xs font-heading font-bold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full">
                Inscription Gratuite
              </span>
              <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-foreground mt-2.5 sm:mt-3 tracking-tight">
                Créer votre compte marchand
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5">
                Remplissez les informations ci-dessous pour soumettre votre demande d'activation.
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
                {errorMsg.includes('déjà associée') && (
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="mt-1 w-full py-2 bg-accent text-white rounded-xl text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Se connecter à mon compte →</span>
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nom complet <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Nom & Prénom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
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
                    className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Phone & Wilaya in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Téléphone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      placeholder="0550 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                    />
                  </div>
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Wilaya <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Expected Monthly Orders */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Volume de commandes estimé / mois
                </label>
                <div className="relative">
                  <BarChart2 className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="1-50">1 - 50 commandes / mois</option>
                    <option value="50-200">50 - 200 commandes / mois</option>
                    <option value="200-500">200 - 500 commandes / mois</option>
                    <option value="500+">Plus de 500 commandes / mois</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
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
                    className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
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
                      className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Confirmer <span className="text-rose-500">*</span>
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
                      className="w-full pl-10 pr-3 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md mt-3 disabled:opacity-50"
              >
                {loading ? (
                  <span>Envoyer la demande...</span>
                ) : (
                  <>
                    <span>Envoyer ma demande d'inscription</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link to login */}
            <div className="mt-5 text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
              <p>
                Vous avez déjà un compte ?{' '}
                <button onClick={onGoToLogin} className="text-accent font-semibold hover:underline">
                  Se connecter
                </button>
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
