import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";

interface WhatsAppModalProps {
  open: boolean;
  onClose: () => void;
}

export const WhatsAppModal = ({ open, onClose }: WhatsAppModalProps) => {
  const handleJoinGroup = () => {
    window.open('https://chat.whatsapp.com/LfPy4mku4rT74B3PRfGhj3?mode=gi_c', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-card border border-primary/30 max-w-[340px] mx-auto p-0 rounded-2xl overflow-hidden shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-gradient-to-b from-primary/10 to-card p-6">
          <DialogHeader className="space-y-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-primary text-center text-lg font-bold uppercase tracking-wide">
              GRUPO EXCLUSIVO
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-foreground/80 text-center text-sm leading-relaxed">
              Entre no nosso grupo VIP do WhatsApp e receba sinais exclusivos, dicas e suporte direto dos nossos especialistas!
            </p>
            
            <div className="bg-background/30 rounded-xl p-3 border border-border">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>+500 membros ativos</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleJoinGroup}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold uppercase h-12 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                ENTRAR NO GRUPO
              </Button>
              
              <Button 
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground font-normal text-sm h-10 rounded-xl"
              >
                Depois
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
