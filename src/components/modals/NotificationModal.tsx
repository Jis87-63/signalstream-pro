import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Smartphone } from "lucide-react";

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  onAllow: () => void;
}

export const NotificationModal = ({ open, onClose, onAllow }: NotificationModalProps) => {
  const [denyClickable, setDenyClickable] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (open) {
      setDenyClickable(false);
      setCountdown(5);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setDenyClickable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open]);

  const handleAllow = async () => {
    await onAllow();
    onClose();
  };

  const handleDeny = () => {
    if (denyClickable) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-[#1a1a2e] border border-[#3a3a5c] max-w-[340px] mx-auto p-0 rounded-2xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-[#252542] to-[#1a1a2e] p-6">
          <DialogHeader className="space-y-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-foreground text-left text-base font-semibold">
                  SSCASHOUT
                </DialogTitle>
                <p className="text-xs text-muted-foreground">quer enviar notificações</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-background/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-foreground/80">
                  <p>Receba alertas instantâneos de:</p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">🎯</span>
                      <span>Novas entradas confirmadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✅</span>
                      <span>Resultados GREEN em tempo real</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">🔔</span>
                      <span>Mesmo com o navegador fechado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleDeny}
                variant="ghost"
                disabled={!denyClickable}
                className={`flex-1 text-xs font-normal h-11 rounded-xl transition-all duration-300 ${
                  denyClickable 
                    ? 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/5' 
                    : 'text-transparent cursor-default'
                }`}
              >
                {denyClickable ? 'Agora não' : `Aguarde ${countdown}s`}
              </Button>
              
              <Button 
                onClick={handleAllow}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold h-11 rounded-xl shadow-lg"
              >
                Permitir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
