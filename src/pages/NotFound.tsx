import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Animação de glitch
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleContactOwner = () => {
    const message = encodeURIComponent('Olá, encontrei uma página que não existe no SSCASHOUT.');
    window.open(`https://wa.me/258878046439?text=${message}`, '_blank');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto space-y-8">
        {/* Ícone animado */}
        <div className="relative">
          <div className={`w-24 h-24 mx-auto bg-destructive/20 rounded-full flex items-center justify-center transition-all duration-150 ${glitch ? 'translate-x-1 skew-x-2' : ''}`}>
            <AlertTriangle className={`w-12 h-12 text-destructive transition-all duration-150 ${glitch ? 'opacity-50' : 'opacity-100'}`} />
          </div>
          
          {/* Efeito de glitch */}
          {glitch && (
            <>
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-primary/20 rounded-full translate-x-1 -translate-y-1 opacity-50" />
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-accent/20 rounded-full -translate-x-1 translate-y-1 opacity-50" />
            </>
          )}
        </div>

        {/* Código 404 */}
        <div className="space-y-2">
          <h1 className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-destructive to-destructive/60 transition-all duration-150 ${glitch ? 'tracking-widest' : 'tracking-tight'}`}>
            404
          </h1>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-destructive to-transparent" />
        </div>

        {/* Mensagem */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A página que você está procurando não existe ou foi removida. 
            Verifique se o endereço está correto ou volte para o início.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleGoBack}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold h-12 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Bot
          </Button>
          
          <Button 
            onClick={handleContactOwner}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold h-12 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com Proprietário
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/50 pt-4">
          © Nexus Corporation TI
        </p>
      </div>
    </div>
  );
};

export default NotFound;
