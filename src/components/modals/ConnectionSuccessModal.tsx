import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Rocket } from "lucide-react";

interface ConnectionSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const ConnectionSuccessModal = ({ open, onClose }: ConnectionSuccessModalProps) => {
  const handleCreateAccount = () => {
    window.open('https://go.aff.oddsbest.co/uvvguo18', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-[#1a1a2e] border border-primary/30 max-w-[340px] mx-auto p-0 rounded-2xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-primary/10 to-[#1a1a2e] p-6">
          <DialogHeader className="space-y-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-primary text-center text-lg font-bold uppercase tracking-wide flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Conexão estabelecida!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-foreground/90 text-center text-sm leading-relaxed">
              O sistema está <span className="text-primary font-semibold">online</span> e pronto para gerar sinais!
            </p>
            
            <div className="bg-background/50 border border-border rounded-xl p-3 text-xs text-foreground/70 leading-relaxed">
              <p className="mb-2">
                <span className="text-primary font-medium">📌 Importante:</span> Para usar os sinais, conecte o bot ao Aviator:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-1">
                <li>Clique em <strong>"Criar Conta"</strong> abaixo</li>
                <li>Preencha o formulário da casa</li>
                <li>Deposite e comece a lucrar!</li>
              </ol>
              <p className="mt-2 text-muted-foreground italic">
                Já tem conta? Ignore e feche esta mensagem.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold uppercase h-12 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Criar Conta
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
