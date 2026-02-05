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
   const handleAllow = async () => {
     await onAllow();
     onClose();
   };
 
   return (
     <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-accent/50 max-w-[360px] mx-4 p-6 rounded-3xl">
         <DialogHeader>
           <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center">
               <Bell className="w-8 h-8 text-accent" />
             </div>
           </div>
          <DialogTitle className="text-foreground text-center text-lg font-bold">
             Ativar Notificações
           </DialogTitle>
         </DialogHeader>
         
         <div className="space-y-4">
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
             Receba alertas instantâneos de novas entradas e resultados GREEN diretamente no seu dispositivo, mesmo quando não estiver no site!
           </p>
           
          <div className="bg-background rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-foreground">
               <span className="text-primary">✅</span>
               <span>Alertas de novas entradas</span>
             </div>
            <div className="flex items-center gap-2 text-xs text-foreground">
               <span className="text-primary">✅</span>
               <span>Notificações de GREEN</span>
             </div>
            <div className="flex items-center gap-2 text-xs text-foreground">
               <span className="text-primary">✅</span>
               <span>Nunca perca uma entrada</span>
             </div>
           </div>
           
           <div className="flex gap-3">
             <Button 
               onClick={onClose}
               variant="secondary"
              className="flex-1 font-semibold rounded-xl"
             >
               Depois
             </Button>
             
             <Button 
               onClick={handleAllow}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl"
             >
               Permitir
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };