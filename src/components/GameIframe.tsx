 export const GameIframe = () => {
   return (
     <div className="w-full h-[800px] mt-4 rounded-lg overflow-hidden border border-foreground/5 shadow-lg">
      <iframe 
        src="https://www.placard.co.mz"
         className="w-full h-full border-none"
         title="Jogo"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowFullScreen
       />
     </div>
   );
 };