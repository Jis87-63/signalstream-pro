 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 
 interface AvisoModalProps {
   open: boolean;
   onClose: () => void;
 }
 
 export const AvisoModal = ({ open, onClose }: AvisoModalProps) => {
   const handleCreateAccount = () => {
     onClose();
     window.open('https://go.aff.oddsbest.co/uvvguo18', '_blank');
   };
 
   return (
     <Dialog open={open} onOpenChange={onClose}>
       <DialogContent className="bg-gradient-to-br from-card to-background border-2 border-primary max-w-[400px] p-6">
         <DialogHeader>
           <DialogTitle className="text-primary text-center text-xl font-bold uppercase tracking-wide">
             ⚠️ AVISO IMPORTANTE
           </DialogTitle>
         </DialogHeader>
         
         <div className="space-y-4">
           <p className="text-muted-foreground text-center text-[15px] leading-relaxed">
             Para usar o sistema corretamente, é necessário estar conectado à casa de apostas onde o sistema funciona. Caso ainda não possua uma conta, crie a sua através do botão abaixo e garanta o acesso completo ao sistema.
           </p>
           
           <div className="flex gap-3">
             <Button 
               onClick={onClose}
               variant="secondary"
               className="flex-1 font-semibold uppercase"
             >
               FECHAR
             </Button>
             
             <Button 
               onClick={handleCreateAccount}
               className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase"
             >
               CRIAR CONTA
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };