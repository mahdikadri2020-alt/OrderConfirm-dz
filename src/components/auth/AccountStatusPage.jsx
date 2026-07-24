import React from 'react';
import { 
  Clock, 
  AlertCircle, 
  Ban, 
  CalendarX, 
  LogOut, 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  Building, 
  Phone, 
  User,
  CheckCircle2
} from 'lucide-react';
import Logo, { LogoIcon } from '../common/Logo';

export default function AccountStatusPage({ merchant, user, onLogout }) {
  const status = merchant?.status || 'pending_approval';
  const businessName = merchant?.business_name || user?.user_metadata?.business_name || 'Votre Boutique';
  const phone = merchant?.phone || user?.user_metadata?.phone || 'Non renseigné';
  const email = user?.email || 'Non renseigné';
  const subEnd = merchant?.subscription_end;

  const getStatusConfig = () => {
    switch (status) {
      case 'pending_approval':
        return {
          icon: <Clock className="h-8 w-8 text-amber-500" />,
          badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          badgeText: "En attente d'approbation",
          title: 'Inscription réussie ! En attente de validation',
          description: `Votre compte marchand pour "${businessName}" a bien été enregistré. Pour activer votre accès, notre équipe commerciale vous contactera par téléphone très prochainement.`,
          steps: [
            { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, title: 'Compte créé', desc: 'Vos coordonnées ont été enregistrées avec succès.' },
            { icon: <PhoneCall className="h-4 w-4 text-amber-500 animate-pulse" />, title: 'Appel de notre équipe', desc: `Nous vous appellerons au ${phone} pour confirmer vos besoins.` },
            { icon: <Clock className="h-4 w-4 text-muted-foreground" />, title: 'Activation du tableau de bord', desc: "L'accès complet à votre espace vous sera débloqué immédiatement après l'appel." }
          ]
        };

      case 'suspended':
        return {
          icon: <Ban className="h-8 w-8 text-rose-500" />,
          badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
          badgeText: 'Compte suspendu',
          title: 'Accès au compte temporairement suspendu',
          description: `Le compte de votre boutique "${businessName}" est actuellement suspendu par l'administration. Veuillez contacter le support client pour résoudre la situation.`,
          steps: []
        };

      case 'expired': {
        const formattedDate = (() => {
          if (!subEnd) return '';
          const d = new Date(subEnd);
          return !isNaN(d.getTime()) ? ` le ${d.toLocaleDateString('fr-FR')}` : '';
        })();

        return {
          icon: <CalendarX className="h-8 w-8 text-orange-500" />,
          badgeBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
          badgeText: 'Abonnement expiré',
          title: 'Votre abonnement a expiré',
          description: `L'abonnement de votre boutique "${businessName}" a pris fin${formattedDate}. Contactez-nous dès maintenant par téléphone ou WhatsApp pour renouveler votre accès.`,
          steps: []
        };
      }

      case 'rejected':
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          badgeBg: 'bg-red-500/10 text-red-600 border-red-500/20',
          badgeText: 'Demande non approuvée',
          title: "Demande d'inscription refusée",
          description: `Votre demande d'inscription pour la boutique "${businessName}" n'a pas pu être validée. N'hésitez pas à contacter notre équipe si vous pensez qu'il s'agit d'une erreur.`,
          steps: []
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-secondary/30 font-body text-foreground flex flex-col justify-between selection:bg-accent selection:text-white">
      
      {/* Header */}
      <header className="w-full bg-background border-b border-border/80 px-4 sm:px-8 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <LogoIcon size={36} className="h-9 w-auto shrink-0" />
          <span className="font-heading font-black text-foreground text-lg tracking-tight">OrderConfirm</span>
        </div>

        <button
          onClick={onLogout}
          className="px-3.5 py-2 bg-secondary hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 border border-border rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Déconnexion</span>
        </button>
      </header>

      {/* Main Status Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center my-6">
        <div className="bg-background rounded-3xl border border-border/80 p-6 sm:p-10 shadow-xl space-y-6">
          
          {/* Top Status Icon & Badge */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border/60">
              {config.icon}
            </div>
            
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border ${config.badgeBg}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {config.badgeText}
                </span>
              </div>
              <h1 className="font-heading font-black text-xl sm:text-2xl text-foreground tracking-tight">
                {config.title}
              </h1>
            </div>
          </div>

          {/* Main Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {config.description}
          </p>

          {/* Account Details Box */}
          <div className="bg-secondary/40 rounded-2xl p-4 border border-border/60 space-y-2.5">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground block">
              Détails de la demande
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">Boutique</span>
                  <span className="font-heading font-bold text-foreground">{businessName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">Téléphone</span>
                  <span className="font-mono font-bold text-foreground">{phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">E-mail</span>
                  <span className="font-heading font-medium text-foreground">{email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps (For Pending Approval) */}
          {config.steps.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-foreground">
                Étapes avant l'accès au tableau de bord :
              </h3>
              <div className="space-y-2.5">
                {config.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40">
                    <div className="mt-0.5 shrink-0">{step.icon}</div>
                    <div>
                      <h4 className="text-xs font-heading font-bold text-foreground">{step.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Section */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-heading font-bold text-foreground block">Une question ou besoin d'aide ?</span>
              <span className="text-[11px] text-muted-foreground block">Notre équipe est disponible 6j/7 pour vous assister.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-border/60 text-[11px] text-muted-foreground">
        OrderConfirm — Plateforme d'automatisation WhatsApp pour l'e-commerce en Algérie.
      </footer>

    </div>
  );
}
