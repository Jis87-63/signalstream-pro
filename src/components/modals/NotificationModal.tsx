import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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
        className="bg-[#1a1a2e] border border-[#3a3a5c]/50 max-w-[320px] mx-auto p-0 rounded-3xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-[#1f1f35] to-[#1a1a2e] p-5">
          <DialogHeader className="space-y-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <img 
                  src="/logo.png" 
                  alt="SSCASHOUT" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-foreground text-left text-sm font-semibold">
                  SSCASHOUT
                </DialogTitle>
                <p className="text-[11px] text-muted-foreground/80">quer enviar notificações</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="bg-background/20 rounded-2xl p-3 border border-white/5">
              <div className="flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 text-[13px] text-foreground/80">
                  <p className="font-medium">Receba alertas de:</p>
                  <ul className="space-y-1 text-[11px] text-foreground/70">
                    <li className="flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Novas entradas confirmadas</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>✅</span>
                      <span>Resultados GREEN em tempo real</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>🔔</span>
                      <span>Mesmo com navegador fechado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2.5 pt-1">
              <Button 
                onClick={handleDeny}
                variant="ghost"
                disabled={!denyClickable}
                className={`flex-1 text-[11px] font-normal h-10 rounded-2xl transition-all duration-300 ${
                  denyClickable 
                    ? 'text-muted-foreground/50 hover:text-muted-foreground/70 hover:bg-white/5' 
                    : 'text-muted-foreground/20 cursor-default'
                }`}
              >
                {denyClickable ? 'Agora não' : `${countdown}s`}
              </Button>
              
              <Button 
                onClick={handleAllow}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold text-sm h-10 rounded-2xl shadow-lg"
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
