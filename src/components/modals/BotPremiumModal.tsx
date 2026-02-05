 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 
 interface BotPremiumModalProps {
   open: boolean;
   onClose: () => void;
 }
 
 export const BotPremiumModal = ({ open, onClose }: BotPremiumModalProps) => {
   const handleGetPremium = () => {
     onClose();
     const message = encodeURIComponent('Ola gostarias de obter o bot versão Premium 100%');
     window.open(`https://wa.me/258878046439?text=${message}`, '_blank');
   };
 
   return (
     <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-destructive/50 max-w-[360px] mx-4 p-6 rounded-3xl">
         <DialogHeader>
          <DialogTitle className="text-primary text-center text-lg font-bold uppercase tracking-wide">
             BOT AVIATOR 100% ACERTO*
           </DialogTitle>
         </DialogHeader>
         
         <div className="space-y-4">
          <p className="text-foreground text-center text-sm leading-relaxed">
             Pare de usar a versão gratuita e ative agora a versão paga do Bot Aviator.
           </p>
           
          <p className="text-foreground text-center text-sm leading-relaxed">
             Com a versão premium, você terá acesso aos sinais com 100% de acerto, mostrando exatamente onde o Aviator vai cair.
           </p>
           
          <p className="text-foreground text-center text-sm leading-relaxed">
             Garanta já a sua vantagem exclusiva por{' '}
            <span className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-bold">
               450 MT
             </span>
             {' '}e comece a faturar.
           </p>
           
           <div className="flex gap-3">
             <Button 
               onClick={onClose}
               variant="secondary"
              className="flex-1 font-semibold uppercase rounded-xl"
             >
               DEPOIS
             </Button>
             
             <Button 
               onClick={handleGetPremium}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold uppercase rounded-xl"
             >
               VER AGORA
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };