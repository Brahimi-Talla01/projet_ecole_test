"use client";

import { useVerifyEmail } from '@/features/authentication/presentation/hooks/useVerifyEmail';
import { Button } from '@/core/ui/atoms/Button';
import { API_ROUTES } from '@/core/config/routes';

export default function VerifyEmailPage() {
  const { status, countdown, token } = useVerifyEmail();

  return (
    <div className="layout-grid min-h-screen items-center">
      <div className="col-span-4 tab:col-start-3 tab:col-span-4 text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gris-100">
        
        {/* ÉTAT : VÉRIFICATION EN COURS */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="btn-loader w-12 h-12 text-primary-800" />
            <h1 className="text-2xl font-bold text-gris-900">Vérification de votre compte...</h1>
            <p className="text-gris-500">Un instant, nous validons votre adresse email.</p>
          </div>
        )}

        {/* ÉTAT : SUCCÈS */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-success-100 text-success-600 rounded-full flex items-center justify-center text-4xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gris-900">Email vérifié !</h1>
            <p className="text-gris-500">
              Votre compte est maintenant actif. Bienvenue sur la plateforme.
            </p>
            <div className="bg-gris-50 px-4 py-2 rounded-full text-sm font-medium text-gris-600">
              Redirection vers l'accueil dans {countdown}s...
            </div>
            <Button 
                onClick={() => { window.location.href = '/'; }} 
                className="mt-4"
                >
                Aller à l'accueil maintenant
            </Button>
          </div>
        )}

        {/* ÉTAT : ERREUR */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in">
            <div className="w-20 h-20 bg-error-100 text-error-600 rounded-full flex items-center justify-center text-4xl">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-gris-900">Lien invalide ou expiré</h1>
            <p className="text-gris-500">
              Nous n'avons pas pu vérifier votre email. Le lien est peut-être déjà utilisé.
            </p>
            <div className="flex flex-col gap-3 w-full mt-4">
              <Button 
                onClick={() => { window.location.href = API_ROUTES.AUTH_REGISTER; }}
              >
                Réessayer l'inscription
              </Button>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="text-gris-500 text-sm hover:underline"
              >
                Contacter le support
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}