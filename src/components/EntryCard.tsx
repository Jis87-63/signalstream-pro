interface EntryCardProps {
  aposde: string;
  cashout: string;
  tentativas: number;
  status: 'aguardando' | 'green' | 'loss' | 'analisando';
  velaFinal?: string;
}

export const EntryCard = ({ aposde, cashout, tentativas, status, velaFinal }: EntryCardProps) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'green':
        return {
          text: velaFinal ? `GREEN ${velaFinal}` : 'GREEN',
          className: 'badge-green'
        };
      case 'loss':
        return {
          text: 'LOSS',
          className: 'badge-loss'
        };
      case 'analisando':
        return {
          text: 'Analisando…',
          className: 'bg-primary/20 text-primary animate-pulse'
        };
      default:
        return {
          text: 'Aguarde…',
          className: 'bg-secondary text-foreground'
        };
    }
  };
 
   const statusDisplay = getStatusDisplay();
 
   return (
     <section className="bg-card border-2 border-primary rounded-2xl p-3 glow-green">
       <div className="flex items-center justify-between mb-3">
         <h2 className="text-lg font-bold text-foreground">Entrada confirmada</h2>
         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusDisplay.className}`}>
           {statusDisplay.text}
         </span>
       </div>
 
       <div className="grid grid-cols-3 gap-2">
         <div className="bg-foreground/5 border border-foreground/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
           <span className="text-[10px] font-medium text-muted-foreground mb-0.5">Depois de</span>
           <span className="text-lg font-bold text-foreground">{aposde}</span>
         </div>
         <div className="bg-foreground/5 border border-foreground/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
           <span className="text-[10px] font-medium text-muted-foreground mb-0.5">Tirar no:</span>
           <span className="text-lg font-bold text-foreground">{cashout}</span>
         </div>
         <div className="bg-foreground/5 border border-foreground/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
           <span className="text-[10px] font-medium text-muted-foreground mb-0.5">Tentativas</span>
           <span className="text-lg font-bold text-foreground">{tentativas}</span>
         </div>
       </div>
     </section>
   );
 };