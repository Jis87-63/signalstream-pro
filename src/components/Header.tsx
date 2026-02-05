 import { useOnlineCount } from '@/hooks/useOnlineCount';
 
 interface HeaderProps {
   isConnected: boolean;
 }
 
 export const Header = ({ isConnected }: HeaderProps) => {
   const onlineCount = useOnlineCount();
 
   return (
     <header className="sticky top-0 z-50 bg-card border-b border-border px-3 py-2.5">
       <div className="flex items-center justify-between max-w-[900px] mx-auto">
         <div className="flex items-center gap-2.5">
           <img 
             src="/logo.png" 
             alt="SSCASHOUT" 
             className="w-8 h-8 rounded-lg object-cover"
           />
           <div>
             <h1 className="text-base font-bold text-foreground">SSCASHOUT</h1>
             <span className="text-[10px] text-muted-foreground">
               {isConnected ? 'Aguarde entrada' : 'Conectando ...'}
             </span>
           </div>
         </div>
         
         <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${
           isConnected 
             ? 'bg-background text-primary border-border' 
             : 'bg-background text-warning border-border'
         }`}>
           <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary' : 'bg-warning'}`} />
           <span>{onlineCount} online</span>
         </div>
       </div>
     </header>
   );
 };