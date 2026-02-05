 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 
 interface WhatsAppModalProps {
   open: boolean;
   onClose: () => void;
 }
 
 export const WhatsAppModal = ({ open, onClose }: WhatsAppModalProps) => {
   const handleJoinGroup = () => {
     onClose();
     window.open('https://chat.whatsapp.com/LfPy4mku4rT74B3PRfGhj3?mode=gi_c', '_blank');
   };
 
   return (
     <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-primary/50 max-w-[360px] mx-4 p-6 rounded-3xl">
         <DialogHeader>
          <DialogTitle className="text-primary text-center text-lg font-bold uppercase tracking-wide">
             GRUPO OFICIAL WHATSAPP
           </DialogTitle>
         </DialogHeader>
         
         <div className="space-y-4">
          <p className="text-foreground text-center text-sm leading-relaxed font-medium">
             Entre agora no grupo de WhatsApp e tenha acesso a dicas exclusivas, outros bots 100% assertivos e suporte 24/24 para tirar todas as suas dúvidas.
           </p>
           
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
             No grupo você encontra tudo o que precisa para ganhar no Aviator todos os dias com segurança.
           </p>
           
           <Button 
             onClick={handleJoinGroup}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 uppercase tracking-wide heartbeat glow-green rounded-xl"
           >
             ENTRAR NO GRUPO AGORA
           </Button>
         </div>
       </DialogContent>
     </Dialog>
   );
 };