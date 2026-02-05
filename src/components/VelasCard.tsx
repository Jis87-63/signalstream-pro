 interface VelasCardProps {
   velas: string[];
   isConnected: boolean;
 }
 
 const getVelaColor = (value: number) => {
   if (value >= 10) return 'vela-pill-pink';
   if (value >= 2) return 'vela-pill-purple';
   if (value >= 1) return 'vela-pill-red';
   return 'vela-pill-green';
 };
 
 export const VelasCard = ({ velas, isConnected }: VelasCardProps) => {
   const displayVelas = velas.slice(0, 4);
 
   return (
     <div className="bg-card border border-border rounded-xl p-4">
       <h3 className="text-base font-semibold mb-3">
         <span className="flex items-center gap-2 text-accent">
           {isConnected ? (
             <>
               <span className="ping-dot" />
               <span>Analisando velas</span>
               <span className="loading-dots">
                 <span></span>
                 <span></span>
                 <span></span>
               </span>
             </>
           ) : (
             <span className="text-warning">Aguardando servidor...</span>
           )}
         </span>
       </h3>
       
       <ul className="flex gap-2 flex-wrap">
         {displayVelas.length > 0 ? (
           displayVelas.map((vela, index) => {
             const value = parseFloat(vela);
             const colorClass = getVelaColor(value);
             return (
               <li 
                 key={index}
                 className={`vela-pill ${colorClass}`}
               >
                 {value.toFixed(2)}x
               </li>
             );
           })
         ) : (
           <li className="text-muted-foreground text-sm">
             Aguardando velas do servidor...
           </li>
         )}
       </ul>
     </div>
   );
 };