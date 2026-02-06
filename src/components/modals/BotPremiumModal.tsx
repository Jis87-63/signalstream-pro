import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Shield, Target } from "lucide-react";

interface BotPremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export const BotPremiumModal = ({ open, onClose }: BotPremiumModalProps) => {
  const handleGetPremium = () => {
    const message = encodeURIComponent('Ola gostarias de obter o bot versão Premium 100%');
    window.open(`https://wa.me/258878046439?text=${message}`, '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-[#1a1a2e] border border-destructive/30 max-w-[340px] mx-auto p-0 rounded-2xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-destructive/10 to-[#1a1a2e] p-6">
          <DialogHeader className="space-y-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 text-center text-lg font-bold uppercase tracking-wide">
              BOT AVIATOR 100% ACERTO*
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-foreground/80 text-center text-sm leading-relaxed">
              Pare de usar a versão gratuita e ative agora a versão paga do Bot Aviator.
            </p>
            
            <div className="bg-background/30 rounded-xl p-3 space-y-2 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-foreground/80">
                <Target className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Sinais com 100% de acerto</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/80">
                <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span>Mostra exatamente onde o Aviator vai cair</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/80">
                <Shield className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Suporte VIP exclusivo</span>
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-foreground/60 text-sm">Por apenas</span>
              <div className="inline-block bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground px-4 py-2 rounded-xl font-bold text-xl ml-2 shadow-lg">
                450 MT
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleGetPremium}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:opacity-90 text-black font-bold uppercase h-12 rounded-xl shadow-lg"
              >
                QUERO AGORA
              </Button>
              
              <Button 
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground/60 hover:text-muted-foreground font-normal text-sm h-10 rounded-xl"
              >
                Continuar com versão gratuita
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
