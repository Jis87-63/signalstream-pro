import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface AvisoModalProps {
  open: boolean;
  onClose: () => void;
}

export const AvisoModal = ({ open, onClose }: AvisoModalProps) => {
  const handleCreateAccount = () => {
    window.open('https://go.aff.oddsbest.co/uvvguo18', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-[#1a1a2e] border border-warning/30 max-w-[340px] mx-auto p-0 rounded-2xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-warning/10 to-[#1a1a2e] p-6">
          <DialogHeader className="space-y-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </div>
            <DialogTitle className="text-warning text-center text-lg font-bold uppercase tracking-wide">
              ⚠️ AVISO IMPORTANTE
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-foreground/80 text-center text-sm leading-relaxed">
              Para usar o sistema corretamente, é necessário estar conectado à casa de apostas onde o sistema funciona.
            </p>
            
            <p className="text-foreground/80 text-center text-sm leading-relaxed">
              Caso ainda não possua uma conta, <span className="text-warning font-semibold">crie a sua</span> através do botão abaixo e garanta o acesso completo ao sistema.
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-warning to-warning/80 hover:opacity-90 text-warning-foreground font-bold uppercase h-12 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                CRIAR CONTA
              </Button>
              
              <Button 
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground/60 hover:text-muted-foreground font-normal text-sm h-10 rounded-xl"
              >
                Já tenho conta, fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
