 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 const firebaseConfig = {
   databaseURL: "https://bot-ia-20e75-default-rtdb.firebaseio.com",
 };
 
 interface VelaData {
   timestamp: number;
   ultimaVela: string;
   maiorVela: string;
   totalVelas: number;
   velas: string[];
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const response = await fetch(
       `${firebaseConfig.databaseURL}/historico-velas.json`
     );
 
     if (!response.ok) {
       throw new Error(`Firebase fetch failed: ${response.status}`);
     }
 
     const dados = await response.json();
 
     if (!dados) {
       return new Response(
         JSON.stringify({
           status: "offline",
           message: "Sem dados disponíveis",
           velas: [],
           servidor: "desconectado",
           data: new Date().toISOString(),
         }),
         {
           status: 200,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         }
       );
     }
 
     const entries = Object.values(dados) as VelaData[];
     const sorted = entries.sort((a, b) => b.timestamp - a.timestamp);
     const latest = sorted[0];
 
     const result = {
       status: "online",
       servidor: "conectado",
       data: new Date(latest.timestamp).toISOString(),
       ultimaVela: latest.ultimaVela,
       maiorVela: latest.maiorVela,
       totalVelas: latest.totalVelas,
       velas: latest.velas?.slice(0, 15) || [],
     };
 
     return new Response(JSON.stringify(result), {
       status: 200,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   } catch (error) {
     console.error("Error fetching signals:", error);
     return new Response(
       JSON.stringify({
         status: "error",
         message: error instanceof Error ? error.message : "Erro desconhecido",
         servidor: "erro",
         data: new Date().toISOString(),
       }),
       {
         status: 500,
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       }
     );
   }
 });