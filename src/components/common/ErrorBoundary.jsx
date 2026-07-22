import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full p-8 flex flex-col items-center justify-center text-center font-body bg-background rounded-3xl border border-border shadow-xs my-6">
          <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-foreground">Une erreur est survenue</h2>
          <p className="text-xs text-muted-foreground max-w-md mt-2 leading-relaxed">
            Un problème inattendu s'est produit lors de l'affichage de ce composant. Vos données sont en sécurité.
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 bg-secondary/50 rounded-xl border border-border text-left max-w-lg w-full">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-rose-600 block mb-1">
                Détail de l'erreur JavaScript :
              </span>
              <code className="text-[11px] font-mono text-rose-700 block whitespace-pre-wrap truncate">
                {this.state.error.toString()}
              </code>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Recharger la page</span>
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="px-5 py-2.5 bg-secondary text-foreground font-heading font-bold text-xs rounded-full border border-border hover:bg-secondary/80 transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
